import { createAsyncThunk } from "@reduxjs/toolkit";
import { CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { notificationSuccess, notificationFail } from "store/slices/notificationSlice";
import {
  checkUser,
  setLoading,
  getLoginUser,
  setThankYou,
  setNotifications,
  setNotificationUnread,
  setDealDetailId,
} from "store/slices/authSlice";
import * as AWS from "aws-sdk";
import axios from "axios";
import { userRoles, updateUserData, getAccessLocationPermission } from "helper/services";
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  UpdatePasswordRequest,
  UpdateUserAttrRequest,
  IUpdateProfile,
} from "types/custom-types";
import config from "config/config";
import Messages from "helper/messages";
import slsApiClient from "config/slsApiClient";
import jwtDecode from "jwt-decode";
import { Auth } from "aws-amplify";
import moment from "moment";
import { getConnectUsers } from "./connectUserThunk";
import { getLeadDetails } from "./leaseThunk";

AWS.config.update({
  accessKeyId: config.AWS.ACCESS_KEY,
  secretAccessKey: config.AWS.SECRET_KEY,
  region: config.AWS.REGION,
});

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

export const databaseLogin = createAsyncThunk(
  "databaseLogin",
  async (_request: any, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await slsApiClient().post(`login`, _request);
      dispatch(setLoading(false));
      if (response?.data?.status) {
        localStorage.setItem("user_data", JSON.stringify(response?.data?.user));
        const locationArr: any = [];
        const associations = response?.data?.user?.connect_associations;
        associations?.map((association: any) => {
          if (association?.locations?.length > 0) {
            association?.locations?.map((loc: any) => {
              if (locationArr.indexOf(loc?.id) === -1) {
                locationArr.push(loc?.id);
              }
              return true;
            });
          }
          return locationArr;
        });
        if (
          response?.data?.user?.role !== userRoles.SYSTEM_ADMIN &&
          response?.data?.user?.role !== userRoles.ADMIN
        ) {
          localStorage.setItem(
            "selected_locations",
            JSON.stringify(locationArr ? locationArr : [])
          );
        }
        dispatch(notificationSuccess(Messages.SUCCESS.LOGIN));
        window.location.replace("/home");
      } else {
        dispatch(notificationFail(response?.data?.message || Messages.ERROR.LOGIN));
      }
    } catch (error: any) {
      dispatch(setLoading(false));
      dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.LOGIN));
    }
  }
);

export const login = createAsyncThunk("login", async (_request: LoginRequest, { dispatch }) => {
  dispatch(setLoading(true));
  const checkUser = await slsApiClient().get(
    `checkuser?email=${encodeURIComponent(
      _request.email.toLowerCase().trim()
    )}&sso=true&locked=true`
  );
  if (checkUser.data.status && !!checkUser.data.user) {
    if (checkUser.data.user.sso_google || checkUser.data.user.sso_microsoft) {
      dispatch(notificationFail(Messages.ERROR.REGISTER_WITH_SSO));
    } else {
      const authenticationData = {
        Username: _request.email.toLowerCase().trim(),
        Password: _request.password,
      };
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
      );
      const poolData = {
        UserPoolId: config.AWS.USER_POOL,
        ClientId: config.AWS.CLIENT_ID,
      };
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const userData = {
        Username: _request.email.toLowerCase().trim(),
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          dispatch(databaseLogin(_request));
        },
        onFailure: (error: any) => {
          if (error.message === "Incorrect username or password.") {
            axios
              .post(
                `${config.API_URL}login-failed`,
                { email: _request.email.toLowerCase().trim() },
                {
                  headers: {
                    "x-api-key": config.SLS_X_API_KEY,
                  },
                }
              )
              .catch((error) => {
                console.log("error ", error);
              });
          }
          dispatch(setLoading(false));
          dispatch(notificationFail(error.message));
        },
      });
    }
  } else {
    dispatch(setLoading(false));
    dispatch(notificationFail(checkUser.data.message));
  }
});

const databaseRegister = createAsyncThunk(
  "databaseRegister",
  async (_request: RegisterRequest, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await slsApiClient().post(`signup`, _request);
      if (response?.data?.status) {
        dispatch(setLoading(false));
        dispatch(
          notificationSuccess(
            _request.auth_type === 1 || _request.auth_type === 2
              ? Messages.SUCCESS.REGISTER_SSO
              : Messages.SUCCESS.REGISTER
          )
        );
        if (_request.auth_type === 1 || _request.auth_type === 2) {
          dispatch(databaseLogin({ email: _request.email, auth_type: _request.auth_type }));
        } else {
          dispatch(setThankYou({ auth_type: _request.auth_type }));
        }
        if (!_request.profileUpdate) {
          dispatch(getConnectUsers(null));
        } else {
          dispatch(setLoading(false));
        }
      } else {
        dispatch(notificationFail(Messages.ERROR.REGISTER));
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.REGISTER));
      dispatch(setLoading(false));
    }
  }
);

const cognitoRegister = createAsyncThunk(
  "cognitoRegister",
  (_request: RegisterRequest, { dispatch }) => {
    dispatch(setLoading(true));
    const email = _request.email.toLowerCase().trim();
    const firstName = _request.firstName?.trim();
    const lastName = _request.lastName?.trim();
    const phone = _request.phone ? _request.phone : "";
    const location = _request?.location || [];
    const role = _request?.role ? _request?.role?.trim() : "";
    const { userAccess } = _request;
    const poolData = {
      UserPoolId: config.AWS.USER_POOL,
      ClientId: config.AWS.CLIENT_ID,
    };

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const attributeList = [];
    const dataEmail = {
      Name: "email",
      Value: email,
    };

    const dataFirstName = {
      Name: "given_name",
      Value: firstName,
    };

    const dataLastName = {
      Name: "family_name",
      Value: lastName,
    };

    const dataPhone = {
      Name: "phone_number",
      Value: phone,
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeFirstName = new CognitoUserAttribute(dataFirstName);
    const attributeLastName = new CognitoUserAttribute(dataLastName);
    const attributePhone = new CognitoUserAttribute(dataPhone);
    attributeList.push(attributeEmail);
    attributeList.push(attributeFirstName);
    attributeList.push(attributeLastName);
    attributeList.push(attributePhone);

    userPool.signUp(email, config.DEFAULT_PASSWORD, attributeList, null, (error: any) => {
      if (error) {
        dispatch(setLoading(false));
        dispatch(notificationFail(error.message));
      } else {
        const paramDBSignup = {
          first_name: firstName,
          last_name: lastName,
          email,
          sms_phone: phone,
          location,
          role,
          user_access: userAccess,
          auth_type: 0,
          profileUpdate: true,
          timezone: moment.tz.guess(),
        };
        dispatch(databaseRegister(paramDBSignup));
      }
    });
  }
);

export const register = createAsyncThunk("register", (_request: RegisterRequest, { dispatch }) => {
  dispatch(cognitoRegister(_request));
});

export const cognitoForgotPassword = createAsyncThunk(
  "cognitoForgotPassword",
  (_request: ForgotPasswordRequest, { dispatch }) => {
    const poolData = {
      UserPoolId: config.AWS.USER_POOL,
      ClientId: config.AWS.CLIENT_ID,
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: _request.email.toLowerCase().trim(),
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: () => {
        dispatch(notificationSuccess(Messages.SUCCESS.OTP_SENT));
      },
      onFailure: (error: any) => {
        dispatch(notificationFail(error.message));
      },
    });
  }
);

export const verifyUser = createAsyncThunk("verifyUser", (_request: any, { dispatch }) => {
  const email = _request.email.toLowerCase().trim();
  const userChildParams = {
    UserAttributes: [
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    UserPoolId: config.AWS.USER_POOL,
    Username: email,
  };
  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  cognitoIdentityServiceProvider.adminUpdateUserAttributes(userChildParams, (error) => {
    if (error) {
      dispatch(notificationFail(error.message));
    }
  });
});

export const getUser = createAsyncThunk("getUser", (_request: any, { dispatch }) => {
  dispatch(setLoading(true));
  axios
    .get(
      `${config.API_URL}users/get-user?user_id=${_request.user_id}&fetch_all_data=${_request?.fetch_all_data}`,
      {
        headers: {
          "x-api-key": config.SLS_X_API_KEY,
        },
      }
    )
    .then(async (response) => {
      dispatch(setLoading(false));
      if (response?.data?.status) {
        if (_request?.fetch_all_data) {
          await updateUserData(response?.data.user, true);
        }
        dispatch(getLoginUser(response?.data?.user));
      } else {
        dispatch(notificationFail(response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
      }
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
    });
});

export const CognitoUpdateUser = createAsyncThunk(
  "CognitoUpdateUser",
  (_request: any, { dispatch }) => {
    dispatch(setLoading(true));
    const email = _request.email.toLowerCase().trim();
    const firstName = _request.firstName?.trim();
    const lastName = _request.lastName?.trim();
    const phone = _request.phone ? _request.phone : "";
    const smsNotifications = _request.smsNotifications ? _request.smsNotifications : false;
    const emailNotifications = _request.emailNotifications ? _request.emailNotifications : false;
    const workStart = _request.work_start_hour ? _request.work_start_hour : null;
    console.log("workStart ", workStart);
    const workEnd = _request.work_end_hour ? _request.work_end_hour : null;
    console.log("workEnd ", workEnd);
    const isUpdateOther = _request.isUpdateOther ? true : false;
    const { userAccess } = _request;

    const userChildParams = {
      UserAttributes: [
        {
          Name: "given_name",
          Value: firstName,
        },
        {
          Name: "family_name",
          Value: lastName,
        },
        {
          Name: "phone_number",
          Value: phone,
        },
      ],
      UserPoolId: config.AWS.USER_POOL,
      Username: email,
    };
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    cognitoIdentityServiceProvider.adminUpdateUserAttributes(userChildParams, (error) => {
      if (error) {
        dispatch(setLoading(false));
        dispatch(notificationFail(error.message));
      } else {
        const paramDBUpdate = {
          user_id: _request.userId,
          first_name: firstName,
          last_name: lastName,
          sms_phone: phone,
          job_title: _request?.job_title,
          msa: _request?.msa,
          location: _request?.location || [],
          user_access: userAccess,
          managing_owner: _request?.managing_owner,
          owner_first_name: _request?.owner_first_name,
          home_street_address: _request?.home_street_address,
          home_city: _request?.home_city,
          home_state: _request?.home_state,
          home_postal_code: _request?.home_postal_code,
          home_country: _request?.home_country,
          other_street_address: _request?.other_street_address,
          other_city: _request?.other_city,
          other_state: _request?.other_state,
          other_postal_code: _request?.other_postal_code,
          other_country: _request?.other_country,
          sms_notifications: smsNotifications,
          email_notifications: emailNotifications,
          is_update_other: isUpdateOther,
          work_start_hour: workStart,
          work_end_hour: workEnd,
        };
        axios
          .post(`${config.API_URL}update-user-profile`, paramDBUpdate, {
            headers: {
              "x-api-key": config.SLS_X_API_KEY,
            },
          })
          .then((response) => {
            if (response?.data?.status) {
              if (_request.profileUpdate) {
                dispatch(getUser({ user_id: _request.userId }));
              } else {
                dispatch(getConnectUsers(_request?.pagination || null));
              }
              dispatch(
                notificationSuccess(response?.data?.message || Messages.SUCCESS.USER_UPDATE)
              );
            } else {
              dispatch(notificationFail(Messages.ERROR.REGISTER));
              dispatch(setLoading(false));
            }
          })
          .catch((error) => {
            dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.REGISTER));
            dispatch(setLoading(false));
          });
      }
    });
  }
);

export const updateUserAttributes = createAsyncThunk(
  "updateUserAttributes",
  (_request: UpdateUserAttrRequest, { dispatch }) => {
    const { email, attributes, pagination, updatedByUserId } = _request;
    dispatch(setLoading(true));
    axios
      .post(
        `${config.API_URL}update-attribute`,
        {
          email,
          attributes,
          updated_by_user_id: updatedByUserId,
        },
        {
          headers: {
            "x-api-key": config.SLS_X_API_KEY,
          },
        }
      )
      .then((response) => {
        if (response?.data?.status) {
          let message: string = "";
          if (attributes.deleted) message = Messages.SUCCESS.USER_DELETE;
          if (attributes.deleted === false) message = Messages.SUCCESS.USER_RESTORE;
          if (attributes.locked) message = Messages.SUCCESS.USER_LOCK;
          if (attributes.locked === false) message = Messages.SUCCESS.USER_UNLOCK;

          dispatch(notificationSuccess(message));
          dispatch(getConnectUsers(pagination || null));
        } else {
          dispatch(notificationFail(response?.data?.message || Messages.ERROR.VERIFY_USER));
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        dispatch(notificationFail(error.message));
        dispatch(setLoading(false));
      });
  }
);

export const logout = createAsyncThunk("logout", (_, { dispatch }) => {
  const poolData = {
    UserPoolId: config.AWS.USER_POOL,
    ClientId: config.AWS.CLIENT_ID,
  };
  const userPool = new CognitoUserPool(poolData);
  const cognitoUser: any = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.getSession(async (error: any, session: any) => {
      if (error) {
        dispatch(notificationFail(error.message));
      }
      if (session !== null && session.isValid()) {
        await Auth.signOut();
        await cognitoUser.signOut();
      }
    });
  }
  localStorage.clear();
  window.location.replace(
    `https://${config.DOMAIN}/logout?client_id=${config.AWS.CLIENT_ID}&logout_uri=${window.location.origin}/sign-in`
  );
  // window.location.reload();
});

export const updatePassword = createAsyncThunk(
  "updatePassword",
  (_request: UpdatePasswordRequest, { dispatch }) => {
    const { oldPassword, newPassword } = _request;
    const email = _request.email.toLowerCase().trim();

    const poolData = {
      UserPoolId: config.AWS.USER_POOL,
      ClientId: config.AWS.CLIENT_ID,
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: oldPassword,
    });
    const userData: Object = {
      Username: email,
      Pool: userPool,
    };
    const params = {
      UserPoolId: config.AWS.USER_POOL,
      Username: email,
    };
    const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider();
    cognitoServiceProvider.adminConfirmSignUp(params, (err) => {
      if (err) {
        dispatch(notificationFail(err.message));
      } else {
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: () => {
            cognitoUser.changePassword(oldPassword, newPassword, (pError: any) => {
              if (pError) {
                dispatch(notificationFail(pError.message));
              } else {
                axios
                  .post(
                    `${config.API_URL}update-attribute`,
                    {
                      email,
                      attributes: { verified: true },
                    },
                    {
                      headers: {
                        "x-api-key": config.SLS_X_API_KEY,
                      },
                    }
                  )
                  .then((response) => {
                    if (response?.data?.status) {
                      dispatch(login({ email, password: newPassword }));
                    } else {
                      dispatch(
                        notificationFail(response?.data?.message || Messages.ERROR.VERIFY_USER)
                      );
                    }
                  })
                  .catch((error) => {
                    dispatch(notificationFail(error.message));
                  });
              }
            });
          },
          onFailure: (error: any) => {
            dispatch(notificationFail(error.message));
          },
        });
      }
    });
  }
);

const createForgotLinkBranchIO = async (params: any) =>
  new Promise((resolve, reject) => {
    const dynamicLinkObj = {
      branch_key: config.BRANCHIO_KEY,
      data: {
        $email: params.email,
      },
    };
    axios
      .post(config.BRANCHIO_URL, dynamicLinkObj)
      .then((result) => {
        resolve(result.data.url);
      })
      .catch((error) => {
        console.log("error ", error);
        reject(error);
      });
  });

export const updateForgotPassword = createAsyncThunk(
  "updateForgotPassword",
  (_request: any, { dispatch }) => {
    const email = _request.email.toLowerCase().trim();

    const poolData = {
      UserPoolId: config.AWS.USER_POOL,
      ClientId: config.AWS.CLIENT_ID,
    };

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmPassword(_request.code, _request.password, {
      onSuccess() {
        axios
          .post(
            `${config.API_URL}update-attribute`,
            { email, attributes: { locked: false } },
            {
              headers: {
                "x-api-key": config.SLS_X_API_KEY,
              },
            }
          )
          .then(async (response) => {
            if (response?.data?.status) {
              if (response?.data?.data?.role_name === userRoles.SOLA_PRO_USER) {
                dispatch(notificationSuccess(Messages.SUCCESS.PASSWORD_UPDATE));
                const redirectUrl: any = await createForgotLinkBranchIO({
                  email,
                });
                if (redirectUrl) {
                  window.location.href = redirectUrl;
                }
                // if (_request.navigate) {
                //   _request.navigate("/sign-in");
                // }
              } else {
                dispatch(login({ email, password: _request.password }));
              }
            } else {
              dispatch(notificationFail(response?.data?.message || Messages.ERROR.VERIFY_USER));
            }
          })
          .catch((error) => {
            dispatch(notificationFail(error.message));
          });
      },
      onFailure(error: any) {
        dispatch(notificationFail(error.message));
      },
    });
  }
);

export const checkUserInDatabase = createAsyncThunk(
  "checkUserInDatabase",
  (_request: any, { dispatch }) => {
    const email = _request.email.toLowerCase().trim();
    axios
      .get(`${config.API_URL}checkuser?email=${encodeURIComponent(email)}`, {
        headers: {
          "x-api-key": config.SLS_X_API_KEY,
        },
      })
      .then((response) => {
        dispatch(checkUser(response?.data?.status ? response?.data.user : null));
        if (_request.navigate) {
          if (response?.data?.user?.verified) {
            // dispatch(notificationFail(Messages.ERROR.ACCOUNT_ALREADY_CONFIRMED));
            _request.navigate("/forgot-password");
          } else if (!response?.data?.user && _request.navigate) {
            dispatch(notificationFail(Messages.ERROR.ACCOUNT_NOT_FOUND));
            _request.navigate("/sign-in");
          }
        }
      })
      .catch((error: any) => {
        console.log("error", error);
        dispatch(checkUser(null));
      });
  }
);

export const SSOLogin = createAsyncThunk("SSOLogin", (_, { dispatch }) => {
  dispatch(setLoading(true));
  Auth.currentAuthenticatedUser().then(async (user: any) => {
    const decoded: any = jwtDecode(user.signInUserSession.idToken.jwtToken);
    const email = decoded.email.toLowerCase().trim();
    let authType = 0;
    if (decoded.identities && decoded.identities[0]) {
      if (decoded.identities[0].providerName === "Google") {
        authType = 1;
      } else {
        authType = 2;
      }
    }
    dispatch(verifyUser({ email: user.username }));
    const checkUser = await slsApiClient().get(`checkuser?email=${encodeURIComponent(email)}`);
    if (checkUser?.data?.status) {
      dispatch(setLoading(false));
      dispatch(databaseLogin({ email, auth_type: authType }));
    } else {
      dispatch(
        databaseRegister({
          email,
          auth_type: authType,
          profileUpdate: true,
          timezone: moment.tz.guess(),
        })
      );
    }
  });
});

export const resetUserPassword = createAsyncThunk(
  "resetUserPassword",
  (_request: any, { dispatch }) => {
    const { email, password } = _request;
    const userChildParams = {
      Password: password,
      UserPoolId: config.AWS.USER_POOL,
      Username: email.toLowerCase().trim(),
      Permanent: true,
    };
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    cognitoIdentityServiceProvider.adminSetUserPassword(userChildParams, (error) => {
      if (error) {
        dispatch(notificationFail(error.message));
      } else {
        dispatch(verifyUser({ email: email.toLowerCase().trim() }));
        axios
          .post(
            `${config.API_URL}update-attribute`,
            {
              email: email.toLowerCase().trim(),
              attributes: { verified: true },
            },
            {
              headers: {
                "x-api-key": config.SLS_X_API_KEY,
              },
            }
          )
          .then((response) => {
            if (response?.data?.status) {
              dispatch(notificationSuccess(Messages.SUCCESS.PASSWORD_UPDATE));
            } else {
              dispatch(notificationSuccess(Messages.ERROR.SOMETHING_WENT_WRONG));
            }
          })
          .catch((error) => {
            dispatch(notificationFail(error.message || Messages.ERROR.SOMETHING_WENT_WRONG));
          });
      }
    });
  }
);

export const updateUserProfile = createAsyncThunk(
  "updateUserProfile",
  (_request: IUpdateProfile, { dispatch }) => {
    axios
      .post(`${config.API_URL}update-user-profile`, _request, {
        headers: {
          "x-api-key": config.SLS_X_API_KEY,
        },
      })
      .then(async (response) => {
        if (response?.data?.status) {
          if (response?.data?.data?.profile_picture) {
            const loginUserData = await updateUserData(
              null,
              true,
              "profile_picture",
              response?.data?.data?.profile_picture
            );
            dispatch(getLoginUser(loginUserData));
          }
          dispatch(notificationSuccess(Messages.SUCCESS.PROFILE_UPLOAD));
        } else {
          dispatch(notificationFail(response?.data?.message || Messages.ERROR.PROFILE_UPLOAD));
        }
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(setLoading(false));
        dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.PROFILE_UPLOAD));
      });
  }
);

export const updatePreferences = createAsyncThunk(
  "updatePreferences",
  (_request: any, { dispatch }) => {
    dispatch(setLoading(true));
    axios
      .post(`${config.API_URL}update-preferences`, _request, {
        headers: {
          "x-api-key": config.SLS_X_API_KEY,
        },
      })
      .then(async (response) => {
        dispatch(setLoading(false));
        if (response?.data?.status) {
          const loginUserData = await updateUserData(
            null,
            true,
            "connect_preferences",
            response?.data?.data
          );
          dispatch(getLoginUser(loginUserData));
          dispatch(notificationSuccess(Messages.SUCCESS.PREFERENCE_UPDATED));
          if (_request.lease_wizard) {
            _request.lease_wizard("/home");
          }
        } else {
          dispatch(notificationFail(response?.data?.message || Messages.ERROR.PREFERENCE_UPDATED));
        }
      })
      .catch((error) => {
        dispatch(setLoading(false));
        dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
      });
  }
);

export const createExportDataRequest = createAsyncThunk(
  "createExportDataRequest",
  async (_request: any, { dispatch }) => {
    const { exportDataReq, onCloseExportPopup } = _request;
    dispatch(setLoading(true));
    try {
      const response = await slsApiClient().post(`create-export-data-request`, exportDataReq);
      dispatch(setLoading(false));
      if (response?.data?.status) {
        onCloseExportPopup();
        dispatch(notificationSuccess(Messages.SUCCESS.DATA_EXPORT_CREATED_SUCCESSFULLY));
      } else {
        dispatch(notificationFail(response?.data?.message || Messages.ERROR.SOMETHING_WENT_WRONG));
      }
    } catch (error: any) {
      dispatch(notificationFail(error.message || Messages.ERROR.SOMETHING_WENT_WRONG));
      dispatch(setLoading(false));
    }
  }
);

export const saveSchedules = createAsyncThunk(
  "saveSchedules",
  async (_request: any, { dispatch }) => {
    console.log("_request ", _request);
    const { setSchedule, setThanksPopup, navigate } = _request;
    dispatch(setLoading(true));
    await slsApiClient()
      .post(`${config.API_URL}schedule/save-schedules`, _request)
      .then(async (response) => {
        dispatch(setLoading(false));
        if (response?.data?.status) {
          setSchedule(false);
          setThanksPopup(true);
          dispatch(getLeadDetails({ leadId: _request.connectDealId }));
          dispatch(notificationSuccess(Messages.SUCCESS.SCHEDULE_MEETING_SUCCESS));
          if (navigate) {
            navigate(`/crm/sola-pro-leads`);
          }
        } else {
          dispatch(notificationFail(response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
          if (navigate) {
            navigate(`/crm/sola-pro-leads`);
          }
        }
      })
      .catch((error) => {
        dispatch(setLoading(false));
        dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
        if (navigate) {
          navigate(`/crm/sola-pro-leads`);
        }
      });
  }
);

export const updateSchedules = createAsyncThunk(
  "updateSchedules",
  async (_request: any, { dispatch }) => {
    const { scheduleId, startTime, endTime, setSchedule, leadId } = _request;
    dispatch(setLoading(true));
    await slsApiClient()
      .post(`${config.API_URL}schedule/update-schedules`, {
        id: scheduleId,
        startTime,
        endTime,
      })
      .then(async (response) => {
        dispatch(setLoading(false));
        if (response?.data?.status) {
          dispatch(getLeadDetails({ leadId }));
          setSchedule(false);
          dispatch(notificationSuccess(Messages.SUCCESS.UPDATE_SCHEDULE_MEETING_SUCCESS));
        } else {
          console.log("else");
          dispatch(notificationFail(response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
        }
      })
      .catch((error) => {
        dispatch(setLoading(false));
        console.log("error ", error);
        dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
      });
  }
);

export const cancelSchedules = createAsyncThunk(
  "cancelSchedules",
  async (_request: any, { dispatch }) => {
    console.log("_request ", _request);
    const { scheduleId, setSchedule, leadId } = _request;
    await slsApiClient()
      .delete(`${config.API_URL}schedule/cancel-schedules?id=${scheduleId}`)
      .then(async (response) => {
        if (response?.data?.status) {
          dispatch(getLeadDetails({ leadId }));
          setSchedule(false);
          dispatch(notificationSuccess(Messages.SUCCESS.CANCEL_SCHEDULE_MEETING_SUCCESS));
        } else {
          dispatch(notificationFail(response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
        }
      })
      .catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
      });
  }
);

export const getAllNotifications = createAsyncThunk(
  "getAllNotifications",
  async (_request: any, { dispatch }) => {
    const {
      userId,
      setNotificationLoader,
      size,
      page,
      setNotificationPage,
      setNotificationTotalPage,
      notifications,
      heightScroll,
      setNotificationInterval,
    } = _request;
    const requestData: any = {
      user_id: userId,
      cms_location_ids: [],
    };
    // const getLocationIds = getAssociationLocations();
    const getLocationIds = getAccessLocationPermission("crm", "crm_deals", "", "view_access"); // Change realted SD-3070
    if (getLocationIds && getLocationIds?.get_location_by_ids) {
      requestData.cms_location_ids = getLocationIds?.get_location_by_ids || [];
    }
    if (setNotificationLoader) {
      setNotificationLoader(true);
    }
    await slsApiClient()
      .get(
        `${config.API_URL}get-all-notifications?user_id=${requestData.user_id}&page=${
          page || 0
        }&per_page=${size || 20}`,
        {
          params: { cms_location_ids: [...new Set(requestData.cms_location_ids)] },
        }
      )
      .then(async (response) => {
        if (setNotificationLoader) {
          setNotificationLoader(false);
        }
        if (response?.data?.status) {
          if (setNotificationInterval) {
            setNotificationInterval(null);
          }
          const result = response?.data;
          let allNotifications = response?.data?.data || [];
          if (notifications && notifications?.length && page !== 0) {
            allNotifications = [...allNotifications, ...notifications];
          }

          allNotifications = [
            ...new Map(allNotifications.map((obj: any) => [obj.id, obj])).values(),
          ];
          Object.assign(result, { data: allNotifications });
          dispatch(setNotifications(result.data));
          dispatch(setNotificationUnread(result.unreadCount));
          if (heightScroll) {
            document.getElementById("notificationPopup").scrollTo({
              top: heightScroll,
              behavior: "smooth",
            });
          }

          if (setNotificationPage) {
            setNotificationPage((response?.data?.meta?.current_page || 0) + 1);
            setNotificationTotalPage(response?.data?.meta?.total_pages);
          }
        } else {
          console.log("notification response", response);
          // dispatch(notificationFail(response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
        }
      })
      .catch((error) => {
        if (setNotificationLoader) {
          setNotificationLoader(false);
        }
        console.log("notification error", error);
        // dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
      });
  }
);
export const updateDealId = createAsyncThunk(
  "updateDealId",
  async (_request: any, { dispatch }) => {
    const { dealId } = _request;
    dispatch(setDealDetailId(dealId));
  }
);

export const markAsRead = createAsyncThunk("markAsRead", async (_request: any, { dispatch }) => {
  const { userId, notificationId, notifications } = _request;
  dispatch(setLoading(true));
  const requestData: any = {
    user_id: userId,
  };
  let url = `${config.API_URL}mark-as-read?user_id=${requestData.user_id}`;
  if (notificationId) {
    url += `&notification_id=${notificationId}`;
  }
  await slsApiClient()
    .get(url)
    .then(async (response) => {
      if (response?.data?.status) {
        if (notificationId && notifications && notifications.length > 0) {
          dispatch(setNotifications(notifications.filter((v: any) => v.id !== notificationId)));
        }
        dispatch(setLoading(false));
        dispatch(getAllNotifications({ userId }));
      } else {
        dispatch(setLoading(false));
        dispatch(notificationFail(response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
      }
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(notificationFail(error?.response?.data?.message || Messages.ERROR.NO_DATA_FOUND));
    });
});
