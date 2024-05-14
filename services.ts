import moment from "moment-timezone";
import imageCompression from "browser-image-compression";
import { blobToWebP } from "webp-converter-browser";
import { setLoading } from "store/slices/authSlice";
import { notificationFail } from "store/slices/notificationSlice";

export const insertinArray = (arr: any, index: any, newItem: any) => {
  const result = [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index),
  ];
  return result;
};

export const getAuthUser = () =>
  localStorage.getItem("user_data") ? JSON.parse(localStorage.getItem("user_data")) : null;

export const getUserTimeZone = (data: any) => {
  let timezone = "";
  let userData = data;
  if (!userData) {
    userData = getAuthUser();
  }
  if (userData?.connect_preferences && userData?.connect_preferences.length) {
    const getTimeZone = userData.connect_preferences.find(
      (obj: any) => obj.preference_type === "TIMEZONE"
    );
    if (getTimeZone && getTimeZone.preference_value) {
      timezone = getTimeZone.preference_value;
    }
  }
  return timezone;
};

export const getPreferenceValue = (data: any, preferenceType: string) => {
  let preferenceValue: any = null;
  let userData = data;
  if (!userData) {
    userData = getAuthUser();
  }
  if (userData?.connect_preferences && userData?.connect_preferences.length) {
    const getPreference = userData.connect_preferences.find(
      (obj: any) => obj.preference_type === preferenceType
    );
    if (getPreference && getPreference.preference_value) {
      preferenceValue = getPreference.preference_value;
    }
  }
  return preferenceValue;
};

export const updateUserData = async (
  data?: any,
  updateStorage?: boolean,
  key?: string,
  value?: any
) => {
  let userData = data;
  if (!userData) {
    userData = getAuthUser();
  }
  if (key) {
    userData[key] = value;
  }
  if (updateStorage) {
    localStorage.setItem("user_data", JSON.stringify(userData));
  }
  return userData;
};

export const userRoles = {
  SYSTEM_ADMIN: "System Admin",
  ADMIN: "Admin",
  FRANCHISEE: "Franchisee",
  LEAEASING: "Leasing",
  MARKETING: "Marketing",
  ACCOUNTING: "Accounting",
  LEASE_APPLICANT: "Lease Applicant",
  SOLA_PRO_USER: "Sola Pro",
  SOLA_ALUMNI: "Sola Alumni",
  FRANCHISEE_CRM_TESTER: "Franchisee CRM Tester",
};

export const userRoleAlias = {
  MARKETING: "dashboard_marketing",
  FRANCHISEE: "dashboard_franchisee",
  SOLA_PRO: "dashboard_solapro",
};

const unitNumber: any = {
  MILLION: 1000000,
  BILLION: 1000000000,
  TRILLION: 1000000000000,
  QUADRILLION: 1000000000000000,
};

export const subSting = (string: string, length = 10) => {
  if (!string) return "";
  let subSting = string.substring(0, length);
  if (string.length > length) {
    subSting += `...`;
  }
  return subSting;
};

export const removeSpecialCharacters = (string = "") =>
  string.replace(/[^\w\s]/gi, "-").toLowerCase();

export const removeSpecialCharactersFromPhone = (string = "") => {
  let number = string
    .replaceAll("+", "")
    .replaceAll("-", "")
    .replace(/[^0-9]/gi, "");
  number = `+1${number.substr(number.length - 10)}`;
  return number;
};

export const capitalizeFirstLetter = (string = "") =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const getLocalDateTime = (date: string, format: string = "MMMM D, YYYY, HH:mm") => {
  if (!date) {
    return "-";
  }
  const d = new Date(date);
  const timezone = getUserTimeZone(null);
  if (timezone) {
    return moment.tz(d, timezone).format(format);
  }
  return moment(d).format(format);
};

export const formatDate = (date: string, format: string = "MMMM D, YYYY, HH:mm") => {
  if (!date) {
    return "-";
  }
  const d = new Date(date);
  return moment(d).format(format);
};

export const phoneNumberformat = (value: string) => {
  if (value) {
    const number = value
      .replaceAll("+", "")
      .replaceAll("-", "")
      .replace(/[^0-9]/gi, "");
    return `+(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(
      6,
      number.length
    )}`;
  }
  return "-";
};

// function scrolls to particular section on click of menu / button
export const ScrollToSection = (id: string) => {
  const headerHeight = document.getElementById("mainHeader").offsetHeight + 25;

  const anchor = document.getElementById(id).offsetTop - headerHeight;
  if (anchor) {
    window.scrollTo({ top: anchor, behavior: "smooth" });
  }
};

// return error message from error array
export const getErrorMessage = (error: any) => {
  let msg = "";
  Object.entries(error).forEach((v: any) => {
    if (v[0] && v[1] && v[1].length) {
      if (msg) {
        msg += ", ";
      }
      msg += `${v[0]} ${v[1].join()}`;
    }
  });
  return msg;
};

// convert file to base64
export const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// display multiple dropdown values in view or listing page.
export const displayMultipleValue = (obj: any) => {
  if (obj && obj.length > 0) {
    return obj
      .map((val: any) => val.name)
      .join(", ")
      .replace(/, ([^,]*)$/, " and $1");
  }
  return "-";
};

export const displayMultipleValueWithName = (obj: any, name: string) => {
  if (obj && obj.length > 0) {
    return obj
      .map((val: any) => val[name])
      .join(", ")
      .replace(/, ([^,]*)$/, " and $1");
  }
  return "-";
};

/* Return FormData Value */
export const getValue = (value: any) => {
  let filteredValue: any = "";
  if (!value) {
    if (String(value) === "0") {
      filteredValue = 0;
    } else if (typeof value === "boolean") {
      filteredValue = false;
    }
  } else if (Array.isArray(value) && !value.length) {
    filteredValue = [];
  } else if (typeof value === "object" && !Object.keys(value).length) {
    filteredValue = {};
  } else if (value) {
    filteredValue = value;
  }
  return filteredValue;
};

/* set Filter value in arr with format */
export const filteredValue = (filterData: any) => {
  const filterArr: any = [];
  if (filterData && filterData.length) {
    filterData.map((obj: any) => {
      const filterBy: any = {};
      if (["is_present", "is_blank"].includes(obj.operatorValue)) {
        Object.assign(filterBy, { column: obj.columnField, operator_value: obj.operatorValue });
      } else if (obj?.is_date) {
        if (obj?.value?.length > 1) {
          if (obj?.from_date && obj?.to_date) {
            Object.assign(filterBy, {
              column: obj.columnField,
              operator_value: obj.operatorValue,
              value: {
                from_date: formatDate(obj?.from_date),
                to_date: formatDate(obj?.to_date),
              },
            });
          } else {
            Object.assign(filterBy, {
              column: obj.columnField,
              operator_value: obj.operatorValue,
              value: {
                from_date: formatDate(obj.value[0]),
                to_date: formatDate(obj.value[1]),
              },
            });
          }
        } else if (obj?.value?.length > 0) {
          Object.assign(filterBy, {
            column: obj.columnField,
            operator_value: obj.operatorValue,
            value: {
              date: formatDate(obj.value),
            },
          });
        }
        if (obj.operatorValue === "today") {
          Object.assign(filterBy, {
            column: obj.columnField,
            operator_value: obj.operatorValue,
            value: formatDate(obj.value),
          });
        }

        if (obj.operatorValue === "yesterday") {
          Object.assign(filterBy, {
            column: obj.columnField,
            operator_value: obj.operatorValue,
            value: formatDate(obj.value),
          });
        }
      } else if (obj?.value) {
        Object.assign(filterBy, {
          column: obj.columnField,
          operator_value: obj.operatorValue,
          value: obj.value,
        });
      }

      if (Object.keys(filterBy).length > 0) {
        filterArr.push(filterBy);
      }
      return true;
    });
  }
  return filterArr;
};

/* set Filter value in arr with format */
export const getDateRange = (type: any, value: number) => {
  const start = moment()
    .subtract(value, type)
    .startOf(type === "week" ? "isoWeek" : "month")
    .toDate();
  const end = moment()
    .subtract(type === "month" ? 1 : value, type)
    .endOf(type === "week" ? "isoWeek" : "month")
    .toDate();
  return [start, end];
};

export const getMUISelectValue = (value: any) => {
  let returnValue: any = false;
  if (typeof value === "undefined") {
    returnValue = "";
  } else if (value === "true" || value === true) {
    returnValue = true;
  }
  return returnValue;
};

// function scrolls to particular error
export const scrollToError = (errors: any) => {
  const catchedInputErrorElement = document.querySelector(`input[name=${Object.keys(errors)[0]}]`);
  if (catchedInputErrorElement) {
    catchedInputErrorElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }
};

// function scrolls to particular error
export const scrollToErrorByClass = (errors: any) => {
  let catchedInputErrorElement = document.querySelector(`input[name=${Object.keys(errors)[0]}]`);
  if (!catchedInputErrorElement) {
    [catchedInputErrorElement] = document.getElementsByClassName(`${Object.keys(errors)[0]}`);
  }
  if (catchedInputErrorElement) {
    catchedInputErrorElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }
};

export const adminSuperAdmin = () => {
  const userData: any = getAuthUser();
  if (userData?.role === userRoles.ADMIN || userData?.role === userRoles.SYSTEM_ADMIN) {
    return true;
  }
  return false;
};

export const systemAdmin = () => {
  const userData: any = getAuthUser();
  if (userData?.role === userRoles.SYSTEM_ADMIN) {
    return true;
  }
  return false;
};

export const getLocationTabs = (locationId: any, owners: any) => {
  let tabs = [];
  const userData = getAuthUser();
  if (userData?.access && userData?.access?.length > 0) {
    const getLocation = userData?.access.find((obj: any) => obj.alias === "locations");
    if (getLocation && getLocation?.child_menu?.length > 0) {
      const childMenus = getLocation?.child_menu?.find(
        (obj: any) => obj.alias === "locations_location"
      );
      if (childMenus?.page_sections?.length) {
        if (
          adminSuperAdmin() ||
          (owners?.length && owners.find((obj: any) => obj.user_id === userData.user_id))
        ) {
          tabs = childMenus?.page_sections;
        } else if (userData?.connect_location_users && userData?.connect_location_users?.length) {
          childMenus?.page_sections.map((obj: any) => {
            const tabAccess = userData?.connect_location_users?.find(
              (acs: any) =>
                acs.location_id === Number(locationId) && acs.menu_id === Number(obj.menu_id)
            );
            if (
              tabAccess &&
              (tabAccess?.add_access || tabAccess?.edit_access || tabAccess?.view_access)
            ) {
              tabs.push(obj);
            }
            return true;
          });
        }
      }
    }
  }
  return tabs;
};

export const getSolaProTabs = () => {
  let tabs = [];
  const { access } = getAuthUser();
  if (access && access?.length > 0) {
    const getSolaPro = access.find((obj: any) => obj.alias === "sola_pros");
    if (getSolaPro && getSolaPro?.child_menu?.length > 0) {
      const childMenus = getSolaPro?.child_menu?.find(
        (obj: any) => obj.alias === "sola_pros_sola_pros"
      );
      if (childMenus && childMenus?.page_sections?.length) {
        tabs = childMenus?.page_sections;
      }
    }
    if (getSolaPro && getSolaPro?.page_sections?.length > 0) {
      tabs = getSolaPro?.page_sections;
    }
  }
  return tabs;
};

export const getSolaProSurveyTabs = () => {
  let tabs = [];
  const { access } = getAuthUser();
  if (access && access?.length > 0) {
    const getSolaProSurvey = access.find((obj: any) => obj.alias === "survey");
    if (getSolaProSurvey && getSolaProSurvey?.child_menu?.length > 0) {
      const loca = getSolaProSurvey?.child_menu?.find((obj: any) => obj.alias === "survey_solapro");
      if (loca?.page_sections?.length) {
        tabs = loca?.page_sections;
      }
    }
  }
  return tabs;
};

export const getFranchiseeFlag = () => {
  let flag = false;
  const { roleDetails } = getAuthUser();
  if (roleDetails && roleDetails?.franchisee_flag) {
    flag = true;
  }
  return flag;
};

export const getLast6Months = (isShort?: boolean) => {
  const lastMonthsArr: any = [];
  const start = moment().startOf("month");
  for (let i = 0; i < 6; i++) {
    lastMonthsArr.push(start.subtract(1, "month").format(isShort ? "MMM" : "MMMM"));
  }
  return lastMonthsArr.reverse();
};

export const getLast12Months = (isShort?: boolean) => {
  const lastMonthsArr: any = [];
  const start = moment().startOf("month");
  for (let i = 0; i < 12; i++) {
    lastMonthsArr.push(start.subtract(1, "month").format(isShort ? "MMM" : "MMMM"));
  }
  return lastMonthsArr.reverse();
};

export const getAssociationLocations = () => {
  const userData = getAuthUser();
  const locations: any = [];
  if (userData?.role !== userRoles.ADMIN && userData?.role !== userRoles.SYSTEM_ADMIN) {
    if (userData?.connect_associations && userData?.connect_associations?.length) {
      userData?.connect_associations.map((val: any) => {
        val.locations.map((v: any) => {
          if (locations.indexOf(v.id) === -1) {
            locations.push(v.id);
          }
          return true;
        });
        return true;
      });
    }
    if (userData?.connect_location_users && userData.connect_location_users?.length) {
      userData.connect_location_users.map((obj: any) => {
        if (!locations.includes(obj.location_id)) {
          locations.push(obj.location_id);
        }
        return true;
      });
    }

    if (userData?.connect_location_owners && userData.connect_location_owners?.length) {
      userData.connect_location_owners.map((obj: any) => {
        if (!locations.includes(obj.id)) {
          locations.push(obj.id);
        }
        return true;
      });
    }
  }

  return {
    get_location_by_ids:
      userData?.role === userRoles.ADMIN || userData?.role === userRoles.SYSTEM_ADMIN
        ? null
        : locations.length
        ? [...new Set(locations)]
        : [0],
  };
};

export const getLocationsFilter = () => {
  const userData = getAuthUser();
  const locations: any = [];
  if (userData?.role !== userRoles.ADMIN && userData?.role !== userRoles.SYSTEM_ADMIN) {
    if (userData?.connect_associations && userData?.connect_associations?.length) {
      userData?.connect_associations.map((val: any) => {
        val.locations.map((v: any) => {
          if (locations.indexOf(v.id) === -1) {
            locations.push(v.name);
          }
          return true;
        });
        return true;
      });
    }
    if (userData?.connect_location_users && userData.connect_location_users?.length) {
      userData.connect_location_users.map((obj: any) => {
        if (!locations.includes(obj.location_id)) {
          locations.push(obj.location_name);
        }
        return true;
      });
    }

    if (userData?.connect_location_owners && userData.connect_location_owners?.length) {
      userData.connect_location_owners.map((obj: any) => {
        if (!locations.includes(obj.id)) {
          locations.push(obj.name);
        }
        return true;
      });
    }
  }

  return {
    get_location_by_name:
      userData?.role === userRoles.ADMIN || userData?.role === userRoles.SYSTEM_ADMIN
        ? null
        : locations.length
        ? [...new Set(locations)]
        : [0],
  };
};

export const getAllAssociationLocations = () => {
  const userData = getAuthUser();
  const locations: any = [];
  if (userData?.role !== userRoles.ADMIN && userData?.role !== userRoles.SYSTEM_ADMIN) {
    if (userData?.connect_associations && userData?.connect_associations?.length) {
      userData?.connect_associations.map((val: any) => {
        val.locations.map((v: any) => {
          if (locations.indexOf(v.id) === -1) {
            locations.push(v.id);
          }
          return true;
        });
        return true;
      });
    }
    if (userData?.connect_location_users && userData.connect_location_users?.length) {
      userData.connect_location_users.map((obj: any) => {
        if (!locations.includes(obj.location_id)) {
          locations.push(obj.location_id);
        }
        return true;
      });
    }

    if (userData?.connect_location_owners && userData.connect_location_owners?.length) {
      userData.connect_location_owners.map((obj: any) => {
        if (!locations.includes(obj.id)) {
          locations.push(obj.id);
        }
        return true;
      });
    }
  }
  return {
    get_location_by_ids:
      userData?.role === userRoles.ADMIN || userData?.role === userRoles.SYSTEM_ADMIN
        ? null
        : locations.length
        ? [...new Set(locations)]
        : false,
  };
};

export const getAssociationOwnersAndUsers = (addOwnerStatus: any) => {
  const userData: any = getAuthUser();
  let users: any = [];
  if (userData?.role === userRoles.ADMIN || userData?.role === userRoles.SYSTEM_ADMIN) {
    users = null;
  } else if (userData && userData?.connect_associations?.length) {
    userData?.connect_associations.map((association: any) => {
      if (association?.users?.length) {
        users = [...users, ...association.users];
      }
      if (addOwnerStatus && association?.owners?.length) {
        users = [...users, ...association.owners];
      }
      return true;
    });
  }
  return { users: users ? [...new Set(users)] : null };
};

export const getShortName = (locationFullName: string) => {
  if (!locationFullName) {
    return "-";
  }
  const word = locationFullName.split(" ");
  let shortName = "";
  if (word.length === 2) {
    shortName = word[0].charAt(0) + word[1].charAt(0);
  }
  if (word.length === 3) {
    shortName = word[0].charAt(0) + word[1].charAt(0) + word[2].charAt(0);
  }
  if (word.length === 1 || word.length > 3) {
    shortName = word[0].substring(0, 3);
  }
  return shortName.toUpperCase();
};

// add remove days months and years
export const minusDays = (date: any, number: number) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(date.getDate() - number));
};

export const addDays = (date: any, number: number) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(date.getDate() + number));
};

export const addMonths = (date: any, number: number) => {
  const newDate = new Date(date);
  return new Date(newDate.setMonth(newDate.getMonth() + number));
};

export const addYears = (date: any, number: number) => {
  const newDate = new Date(date);
  return new Date(newDate.setFullYear(newDate.getFullYear() + number));
};

export const addWeeks = (date: any, number: number) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + number * 7));
};

export const formatNumbers = (number: any) => {
  if (number) {
    return parseFloat(number)
      ?.toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
  return number;
};

export const getThousandValue = (number?: any) => {
  let newNumber: string = "";
  if (number) {
    newNumber = (parseFloat(number) / 1000)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
  return `${newNumber} K`;
};

export const blockInvalidChar = (e: any) =>
  ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

export const displayLastTime = (value: number) => {
  const date = new Date(value * 1000);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();
  const dayDiff = currentDate.getDate() - date.getDate();
  let result = "";
  if (timeDiff <= 24 * 60 * 60 * 1000 && dayDiff === 0) {
    // Today
    result = moment(date).format("h:mm a");
  } else if (timeDiff <= 48 * 60 * 60 * 1000 && dayDiff === 1) {
    // Yesterday
    result = "Yesterday";
  } else if (timeDiff <= 168 * 60 * 60 * 1000) {
    // Less than week
    result = moment(date).format("ddd");
  } else {
    result = moment(date).format("DD/MM/YYYY");
  }
  return result.toLowerCase();
};

export const abbreviateNumber = (number: any) => {
  const SI_SYMBOL = ["-", "M", "B", "T", "P"];
  let numWithAbbreviate: any = Math.abs(number).toFixed(2);
  const forCheckAbbreviateNumber: any = numWithAbbreviate;
  if (forCheckAbbreviateNumber >= unitNumber.MILLION) {
    numWithAbbreviate = (forCheckAbbreviateNumber / unitNumber.MILLION).toFixed(2) + SI_SYMBOL[1];
  }
  if (forCheckAbbreviateNumber >= unitNumber.BILLION) {
    numWithAbbreviate = (forCheckAbbreviateNumber / unitNumber.BILLION).toFixed(2) + SI_SYMBOL[2];
  }
  if (forCheckAbbreviateNumber >= unitNumber.TRILLION) {
    numWithAbbreviate = (forCheckAbbreviateNumber / unitNumber.TRILLION).toFixed(2) + SI_SYMBOL[3];
  }
  if (forCheckAbbreviateNumber >= unitNumber.QUADRILLION) {
    numWithAbbreviate =
      (forCheckAbbreviateNumber / unitNumber.QUADRILLION).toFixed(2) + SI_SYMBOL[4];
  }
  if (number < 0) {
    numWithAbbreviate = SI_SYMBOL[0] + numWithAbbreviate;
  }
  return numWithAbbreviate;
};

export const getPermission = (alias: string, childAlias?: string) => {
  const userData: any = getAuthUser();
  let access = false;
  if (userData?.access?.length) {
    const checkAccess = userData?.access.find((obj: any) => obj.alias === alias);
    if (checkAccess) {
      if (childAlias) {
        if (
          checkAccess?.child_menu?.length &&
          checkAccess.child_menu.find((obj: any) => obj.alias === childAlias)
        ) {
          access = true;
        }
      } else {
        access = true;
      }
    }
  }
  return access;
};

export const checkIsOwner = (userData: any, locationId: number) => {
  if (adminSuperAdmin()) {
    return true;
  }
  let isOwner = false;
  if (userData?.connect_associations?.length) {
    userData?.connect_associations.map((obj: any) => {
      if (obj?.locations && obj?.locations?.length) {
        const getLocation = obj?.locations?.find((l: any) => Number(l?.id) === Number(locationId));
        if (getLocation && obj?.owners?.length && obj?.owners?.includes(Number(userData.user_id))) {
          isOwner = true;
        }
      }
      return true;
    });
  }
  if (
    userData?.connect_location_owners &&
    userData?.connect_location_owners.find((l: any) => Number(l?.id) === Number(locationId))
  ) {
    isOwner = true;
  }
  return isOwner;
};
export const getAccessPermission = (
  locationId: any,
  menuAlias: string,
  childAlias: string,
  sectionAlias: string,
  accessType: string,
  owners?: any[]
) => {
  const userData = getAuthUser();
  if (
    adminSuperAdmin() ||
    checkIsOwner(userData, Number(locationId)) ||
    (owners?.length && owners.find((obj: any) => obj.user_id === userData.user_id))
  ) {
    return true;
  }
  let permission = false;
  if (
    userData &&
    userData?.access &&
    userData?.access?.length &&
    userData?.connect_location_users?.length
  ) {
    const checkMenuAlias = userData?.access.find((obj: any) => obj.alias === menuAlias);
    if (checkMenuAlias) {
      const checkChildAlias = checkMenuAlias.child_menu?.find(
        (child: any) => child.alias === childAlias
      );
      if (checkChildAlias && sectionAlias) {
        const checkSectionAlias = checkChildAlias?.page_sections?.find(
          (tab: any) => tab.alias === sectionAlias
        );
        if (checkSectionAlias) {
          permission = userData?.connect_location_users.find(
            (obj: any) =>
              obj.location_id === Number(locationId) &&
              obj.menu_id === Number(checkSectionAlias.menu_id)
          )?.[accessType];
        }
      } else if (checkChildAlias) {
        permission = userData?.connect_location_users.find(
          (obj: any) =>
            obj.location_id === Number(locationId) &&
            obj.menu_id === Number(checkChildAlias.menu_id)
        )?.[accessType];
      }
    }
  }
  return permission;
};

// Get Location Wise Permission realted Leads (SD-3070)
export const getAccessLocationPermission = (menu: any, child: any, section: any, access: any) => {
  const userData = getAuthUser();
  const locations: any = [];
  if (userData?.role !== userRoles.ADMIN && userData?.role !== userRoles.SYSTEM_ADMIN) {
    // if (userData?.connect_associations && userData?.connect_associations?.length) {
    //   userData?.connect_associations.map((val: any) => {
    //     val.locations.map((v: any) => {
    //       if (locations.indexOf(v.id) === -1) {
    //         const accessPermission = getAccessPermission(v.id, menu, child, section, access);
    //         if (accessPermission) {
    //           locations.push(v.id);
    //         }
    //       }
    //       return true;
    //     });
    //     return true;
    //   });
    // }
    if (userData?.connect_location_users && userData.connect_location_users?.length) {
      userData.connect_location_users.map((obj: any) => {
        if (!locations.includes(obj.location_id)) {
          const accessPermission = getAccessPermission(
            obj.location_id,
            menu,
            child,
            section,
            access
          );
          if (accessPermission) {
            locations.push(obj.location_id);
          }
        }
        return true;
      });
    }

    if (userData?.connect_location_owners && userData.connect_location_owners?.length) {
      userData.connect_location_owners.map((obj: any) => {
        if (!locations.includes(obj.id)) {
          locations.push(obj.id);
        }
        return true;
      });
    }
  }
  return {
    get_location_by_ids:
      userData?.role === userRoles.ADMIN || userData?.role === userRoles.SYSTEM_ADMIN
        ? null
        : locations?.length
        ? [...new Set(locations)]
        : [0],
  };
};
export const getLocationAllTabAccessPermission = (
  locationId: any,
  menuAlias: string, // locations
  childAlias: string, // locations_location
  sectionAlias: string,
  accessType: string,
  owners?: any[]
) => {
  const userData = getAuthUser();
  if (
    adminSuperAdmin() ||
    checkIsOwner(userData, Number(locationId)) ||
    (owners?.length && owners.find((obj: any) => obj.user_id === userData.user_id))
  ) {
    return true;
  }
  let permission = [];
  if (
    userData &&
    userData?.access &&
    userData?.access?.length &&
    userData?.connect_location_users?.length
  ) {
    const checkMenuAlias = userData?.access.find((obj: any) => obj.alias === menuAlias);
    if (checkMenuAlias) {
      const checkChildAlias = checkMenuAlias.child_menu?.find(
        (child: any) => child.alias === childAlias
      );
      if (checkChildAlias) {
        const checkSectionAlias = checkChildAlias?.page_sections?.map((tab: any) =>
          Number(tab.menu_id)
        );

        if (checkSectionAlias && checkSectionAlias.length) {
          permission = userData?.connect_location_users.filter(
            (obj: any) =>
              obj.location_id === Number(locationId) &&
              checkSectionAlias.includes(obj.menu_id) &&
              obj[accessType] === true
          );
        }
      }
    }
  }

  return permission.length > 0 ? true : false;
};

export const getLocationCrmAccess = () => {
  const userData = getAuthUser();
  const returnData: any = {
    locationAccess: [],
    crmAccess: [],
    defaultAccess: [],
  };
  if (userData?.access?.length) {
    const defaultAccessData: any = [];
    const getLocationAccess = userData?.access.find((obj: any) => obj.alias === "locations");
    if (getLocationAccess) {
      const getChildMenuAccess: any = getLocationAccess?.child_menu?.find(
        (newObj: any) => newObj.alias === "locations_location"
      );
      returnData.locationAccess = getChildMenuAccess?.page_sections || [];
      getChildMenuAccess?.page_sections?.map((obj: any) => {
        defaultAccessData.push({
          view_access: true,
          menu_id: Number(obj?.menu_id),
        });
        return true;
      });
    }
    const getCRMAccess: any = userData?.access?.find((obj: any) => obj.alias === "crm");
    if (getCRMAccess) {
      returnData.crmAccess = getCRMAccess?.child_menu || [];
      getCRMAccess?.child_menu?.map((obj: any) => {
        defaultAccessData.push({
          view_access: true,
          menu_id: Number(obj?.menu_id),
        });
        return true;
      });
    }
    returnData.defaultAccess = defaultAccessData;
  }
  return returnData;
};

export const getCRMCreateAccess = (accessType: string, menuAlias: string, childAlias?: any) => {
  const userData = getAuthUser();
  const locations: any = [];

  let menuId: any = null;
  const mainItem = userData?.access?.find((obj: any) => obj.alias === menuAlias);
  if (mainItem) {
    const accessItem = mainItem?.child_menu?.find((obj: any) => obj.alias === childAlias);
    if (accessItem) {
      menuId = Number(accessItem.menu_id);
    }
  }
  if (userData?.connect_associations?.length) {
    userData?.connect_associations.map((val: any) => {
      if (val?.owners?.length && val?.owners.includes(Number(userData.user_id))) {
        val.locations.map((v: any) => {
          if (locations.indexOf(v.id) === -1) {
            locations.push(v.id);
          }
          return true;
        });
      }
      return true;
    });
  }

  if (userData?.connect_location_owners && userData.connect_location_owners?.length) {
    userData.connect_location_owners.map((obj: any) => {
      if (!locations.includes(obj.id)) {
        locations.push(obj.id);
      }
      return true;
    });
  }

  if (userData?.connect_location_users && userData.connect_location_users?.length) {
    userData.connect_location_users.map((obj: any) => {
      if (
        !locations.includes(obj.location_id) &&
        menuId &&
        Number(obj.menu_id) === Number(menuId) &&
        obj[accessType]
      ) {
        locations.push(obj.location_id);
      }
      return true;
    });
  }

  return {
    get_location_by_ids: locations.length ? [...new Set(locations)] : [0],
    locations: locations.length,
  };
};

export const downloadCenterFields = (string?: any, joinsTables?: any) => {
  let finalString = "";
  if (string) {
    finalString = string;
  }
  if (joinsTables?.length) {
    joinsTables.map((obj: any) => {
      obj?.fields.map((v: any) => {
        finalString += `${finalString ? "," : ""}${obj.table}_${v}`;
        return true;
      });
      obj?.include?.map((child: any) => {
        child?.fields.map((v: any) => {
          finalString += `${finalString ? "," : ""}${child.table}_${v}`;
          return true;
        });
        return true;
      });
      return true;
    });
  }

  return finalString
    ? finalString
        .split(",")
        .map((key: any) => (key === "id" ? "ID" : key))
        .join(", ")
        .replace(/_/g, " ")
        .replace(/(?: |\b)(\w)/g, (key: any) => key.toUpperCase())
    : "";
};
// Apply advance filter
export const getFilterURL = (url: any, filterBy: any) => {
  let newUrl = url || "";
  const advanceSearch: any = [];
  let sendValues: any = {};
  filterBy.map((obj: any) => {
    if (obj?.columnField && obj?.value && obj?.operatorValue) {
      const mainValues: any = [
        "this_week",
        "last_week",
        "last_month",
        "last_3_months",
        "last_6_months",
        "last_12_months",
      ];
      if (mainValues.includes(obj?.operatorValue)) {
        sendValues = {
          columnName: obj?.associative_colums ? obj?.associative_colums : obj?.columnField,
          from_date: obj?.from_date,
          to_date: obj?.to_date,
          type: "between_and",
        };
      } else if (obj?.operatorValue === "between_and") {
        sendValues = {
          columnName: obj?.associative_colums ? obj?.associative_colums : obj?.columnField,
          from_date: moment(obj?.value[0]).format("yyyy-MM-DD"),
          to_date: moment(obj?.value[1]).format("yyyy-MM-DD"),
          type: "between_and",
        };
      } else if (obj?.operatorValue === "date") {
        sendValues = {
          columnName: obj?.associative_colums ? obj?.associative_colums : obj?.columnField,
          date: moment(obj?.value[0]).format("yyyy-MM-DD"),
          type: obj?.operatorValue,
        };
      } else if (obj?.operatorValue === "today" || obj?.operatorValue === "yesterday") {
        sendValues = {
          columnName: obj?.associative_colums ? obj?.associative_colums : obj?.columnField,
          date: obj?.value,
          type: obj?.operatorValue,
        };
      } else {
        sendValues = {
          columnName: obj?.associative_colums ? obj?.associative_colums : obj?.columnField,
          value: obj?.value,
          type: obj?.operatorValue,
        };
      }
      advanceSearch.push(sendValues);
    } else if (obj?.operatorValue === "is_blank" || obj?.operatorValue === "is_present") {
      sendValues = {
        columnName: obj?.associative_colums ? obj?.associative_colums : obj?.columnField,
        type: obj?.operatorValue,
      };
      advanceSearch.push(sendValues);
    }
    return true;
  });
  if (advanceSearch?.length) {
    newUrl += `&advance_search=${encodeURI(JSON.stringify(advanceSearch))}`;
  }
  return newUrl;
};

export const formatPhoneNumber = (phoneNumberString: any) => {
  const cleaned = `""${phoneNumberString}`.replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
};

export const fromToDate = (dates: any) => {
  const mainDates: any = {
    from_date: moment(dates[0]).format("yyyy-MM-DD"),
    to_Date: moment(dates[1]).format("yyyy-MM-DD"),
  };
  return mainDates;
};

export const onlyUniqueArray = (value: any, index: any, self: any) => self.indexOf(value) === index;
// Remove Export fields by
export const removeExportFields = (fields: any) => {
  if (!adminSuperAdmin()) {
    return fields.filter((obj: any) => !obj.hide_franchisee);
  }
  return fields;
};

// Check Association is Owners or Super Admin and Admin
export const checkUserAssociationOwnersAndAdmin = (associations: any) => {
  const userData: any = getAuthUser();
  if (
    adminSuperAdmin() ||
    associations?.owners?.find((obj: any) => Number(obj?.user_id) === Number(userData?.user_id))
  ) {
    return true;
  }
  return false;
};

// Checked Uncheck checkbox
export const checkedUncheckedValues = (defaultDBData: any, checkedData: any) => {
  const newArray = JSON.parse(JSON.stringify(defaultDBData));
  const indexCheck = defaultDBData?.findIndex(
    (obj: any) => obj?.accessor === checkedData?.accessor
  );
  newArray[indexCheck].checked = !checkedData.checked;
  return newArray;
};

// Default fucntion check checked, unchecked
const getDisableCheckPriorityValue = (dbValue: any, localCodeValue: any) => {
  let intialDisableCheckValue: any = false;
  if (typeof localCodeValue?.disableCheck === "boolean") {
    intialDisableCheckValue = localCodeValue?.disableCheck;
  } else if (typeof localCodeValue?.disableCheck === "undefined") {
    intialDisableCheckValue = dbValue?.disableCheck;
  }
  return intialDisableCheckValue;
};

export const setDefaultSelectedColumns = (defaultSelectedColumns: any, getColumns: any) => {
  let tempColum: any = [];

  defaultSelectedColumns.map((scol: any) => {
    const tempObj = JSON.parse(JSON.stringify(scol));
    const getTempColumn = getColumns.find((c: any) => c.accessor === scol.accessor);
    if (getTempColumn) {
      tempObj.Header = getTempColumn.Header;
      tempColum.push({
        ...tempObj,
        disableCheck: getDisableCheckPriorityValue(tempObj, getTempColumn),
      });
    }
    return true;
  });
  getColumns.map((col: any) => {
    const getTempColumn = tempColum.find((c: any) => c.accessor === col.accessor);
    if (!getTempColumn) {
      tempColum = insertinArray(tempColum, tempColum.length - 1, col);
    }
    return true;
  });

  return tempColum;
};

export const getMessageCountTexts = (data: any) => {
  let message = `${data?.conversation_count} messages`;
  if (data.enroll_lead && !data?.deal_locked) {
    const sentMessages =
      (data?.connect_drip_campaigns?.length &&
        data?.connect_drip_campaigns.filter((obj: any) => obj.trigger_status === "sent")?.length) ||
      0;
    const scheduledMessages = data?.connect_drip_campaigns?.length || 0;
    message = `Enrolled: ${sentMessages} sent of ${scheduledMessages} messages`;
  }
  return message;
};

export const getEnrollNextTime = (data: any) => {
  let nextTime = "";
  if (data?.enroll_lead && !data?.deal_locked) {
    const dripArray = JSON.parse(JSON.stringify(data?.connect_drip_campaigns));
    const sortedArray: any = dripArray?.length
      ? dripArray.sort((objA: any, objB: any) => objA.trigger_time - objB.trigger_time)
      : [];
    const obj: any = sortedArray.length
      ? sortedArray.find((v: any) => v.trigger_status === "pending")
      : {};
    if (obj && Object.entries(obj).length > 0) {
      nextTime = `Next Message Sending: ${moment(obj.trigger_time).format("hh:mm a")} on ${moment(
        obj.trigger_time
      ).format("MMM DD")} (GMT ${moment(obj.trigger_time).format("Z")})`;
    }
  }
  return nextTime;
};

// For lease Applicant
export const leaseApplicant = {
  ADDNEW: "Add New",
  ADDFROMDEAL: "Add From Deal",
  ADDEXISTINGPROFESSIONAL: "Add Existing Professional",
};

export const leaseApplicantValue = {
  ADDNEW: "add_new",
  ADDFROMDEAL: "add_from_deal",
  ADDEXISTINGPROFESSIONAL: "add_existing_professional",
};

// For set[0] index userData
export const sendDataToApplicants = (data: any) => {
  const sendData = {
    first_name: data?.firstname,
    last_name: data?.lastname,
    email: data?.email,
    phone: data?.phone,
    isSublet: false,
  };
  return sendData;
};

// get locations to pass for conversation
export const getLocationIdsForConversation = (locationId?: any, locationIds?: any) => {
  let allLocationIds: any = [];
  if (locationId) {
    allLocationIds.push(locationId);
  }
  if (locationIds && locationIds.length) {
    allLocationIds = allLocationIds.concat(locationIds);
  }
  return [...new Set(allLocationIds)];
};

export const isFranchisie = () => {
  const userData: any = getAuthUser();
  if (
    userData?.role === userRoles.FRANCHISEE ||
    userData?.role === userRoles.FRANCHISEE_CRM_TESTER
  ) {
    return true;
  }
  return false;
};

export const adminFranchisie = () => {
  const userData: any = getAuthUser();
  if (
    userData?.role === userRoles.ADMIN ||
    userData?.role === userRoles.SYSTEM_ADMIN ||
    isFranchisie()
  ) {
    return true;
  }
  return false;
};

export const formattedPhone = (phone: any) => {
  let tempPhone = phone?.replace(/\D+/g, "");
  if (tempPhone && tempPhone?.length > 10 && tempPhone?.charAt(0) === "1") {
    tempPhone = tempPhone?.slice(1);
  }
  return tempPhone?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

// make url name
export const makeURLName = (stringValue?: any) =>
  (stringValue || "")
    .replace(/[^a-zA-Z 0-9]+/g, "")
    .replace(/  +/g, " ")
    .replace(/\s+$/, "")
    .split(" ")
    .join("-")
    .toLowerCase();

// return name with slash
export const getUrlName = (stringValue?: any) => (stringValue || "").replace(/\//g, "-");

// Percent Changes calculation
export const percentCalculation = (
  confirmPercent: any,
  securityAmount: any,
  changeValue: any,
  members: any,
  totalConfirmedAmount: any
) => {
  const currentAmount = (securityAmount * changeValue) / 100;
  const currentPercentage = 100 - changeValue;
  const decreaseLength = members.length - 1;
  let otherMemberPercent: number = 0;
  let otherMemberAmount: number = 0;
  if (confirmPercent) {
    otherMemberPercent = 100 - (confirmPercent + changeValue);
    otherMemberAmount = securityAmount - (totalConfirmedAmount + currentAmount);
  } else {
    otherMemberPercent = currentPercentage / decreaseLength;
    otherMemberAmount = (securityAmount - currentAmount) / decreaseLength;
  }
  const dispData = {
    amountCurrent: +Number(currentAmount).toFixed(2),
    otherApplicantAmount: +Number(otherMemberAmount).toFixed(2),
    otherApplicantPercent: +Number(otherMemberPercent).toFixed(2),
  };
  return dispData;
};

export const getDisplayName = (user: any, contact: any) => {
  let tempName = "Unknown Contact";
  if (user) {
    tempName = `${user?.first_name ? user?.first_name : ""} ${
      user?.last_name ? user?.last_name : ""
    }`;
    if (!tempName && user?.login_email) {
      tempName = user?.login_email;
    }
  } else if (contact) {
    tempName = `${contact?.f_name ? contact?.f_name : ""} ${
      contact?.l_name ? contact?.l_name : ""
    }`;
    if (!tempName && contact?.email) {
      tempName = contact?.email;
    }
  }
  if (!tempName.replace(/\s/g, "").length) {
    tempName = "Unknown Contact";
  }
  return tempName;
};

export const getDateDuration = (date: any) => {
  let dispType = "";
  if (moment().isSame(date, "day")) {
    dispType = moment(date).format("h:mm a");
  } else if (moment().diff(date, "days") <= 6) {
    dispType = moment(date).fromNow();
  } else if (moment().diff(date, "days") <= 13) {
    dispType = "1 week ago";
  } else if (moment().diff(date, "days") >= 14 && moment().diff(date, "days") < 50) {
    dispType = "6 week ago";
  } else {
    dispType = moment(date).fromNow();
  }
  return dispType;
};
export const getNextPaymentDate = (selectedDate: any, weeks: number, rentDue: any) => {
  const weeksDate = addWeeks(selectedDate, weeks);
  const changeWeeksDate = moment(weeksDate).format("yyyy-MM-DD");
  const mainDate = moment(changeWeeksDate);
  const nextRentDueDate = mainDate.clone().isoWeekday(rentDue);
  if (nextRentDueDate.isBefore(mainDate)) {
    nextRentDueDate.add(1, "week");
  }

  return nextRentDueDate.format("YYYY-MM-DD");
};
export const addPlusOneInPhoneNumber = (phone: any) => {
  let phoneChange = String(phone || "")
    .replace(/[^\w\s]/gi, "")
    .replace(/[\s]/gi, "");
  if (phoneChange.length === 11) {
    if (phoneChange.startsWith("1")) {
      phoneChange = `+${phoneChange}`;
    } else {
      phoneChange = `+1${phoneChange}`;
    }
  } else if (phoneChange) {
    if (phoneChange.startsWith("1")) {
      phoneChange = `+${phoneChange}`;
    } else {
      phoneChange = `+1${phoneChange}`;
    }
  }
  return phoneChange;
};

export const removePlusOneInPhoneNumber = (phone: any) => {
  let phoneChange = String(phone || "").replace(/[\s]/gi, "");
  if (phoneChange.startsWith("+1")) {
    phoneChange = phoneChange.slice(2);
  } else if (phoneChange.startsWith("+")) {
    phoneChange = phoneChange.slice(1);
  }
  return phoneChange;
};

export const getAliasColumnName = (arrayItem: any, fields: any) =>
  arrayItem?.fields
    ?.map((y: any) => {
      if (y && Array.isArray(y) && y?.length > 1) {
        const actualColmn = fields.find((cc: any) => cc === y[0]);
        if (actualColmn) {
          return y[1];
        }
      } else if (fields.includes(y)) {
        return y;
      }
      return null;
    })
    .filter((yy: any) => yy);

export const getJoinedColumnsData = async (joinTables: any, selectedFields: any) => {
  const joinedMappedTableData = await Promise.all(
    joinTables.map((joinItem: any) => {
      const mainFields = joinItem?.fields?.filter((x: any) => selectedFields.includes(x));
      const includedFields = joinItem?.include?.map((includeItem: any) => ({
        ...includeItem,
        fields: getAliasColumnName(includeItem, selectedFields),
      }));
      return {
        ...joinItem,
        fields: mainFields,
        include: includedFields,
      };
    })
  );
  return joinedMappedTableData;
};

export const compressImage = async (file: any, dispatch: any = null) => {
  const options: any = {
    maxSizeMB: 0.15,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    onProgress(progress: any) {
      if (progress === 100 && dispatch) {
        dispatch(setLoading(false));
      }
    },
  };

  if (dispatch) {
    dispatch(setLoading(true));
  }
  const compressedImage = await imageCompression(file, options);
  return compressedImage;
};

export const getUserFullName = (user: any) => {
  let tempName = "-";
  if (user) {
    tempName = `${user?.first_name ? user?.first_name : ""} ${
      user?.last_name ? user?.last_name : ""
    }`;
    if (!tempName && user?.login_email) {
      tempName = user?.login_email;
    }
  }

  return tempName;
};
export const fileSizeInBytes = (base64: any) => {
  const base64String = base64.replaceAll("=", "");
  const bytes = base64String.length * (3 / 4);

  return bytes;
};

export const convertImageToWebp = async (files: any, type: any = "blob", dispatch: any = null) => {
  try {
    if (dispatch) {
      dispatch(setLoading(true));
    }
    const webpBlob: any = await blobToWebP(files, { quality: 0.35 });
    const file: any = new File([webpBlob], `${type}.webp`, {
      type: "image/png",
      lastModified: new Date().getTime(),
    });

    if (dispatch) {
      dispatch(setLoading(false));
    }
    return file;
  } catch (error: any) {
    dispatch(notificationFail("Image upload failed."));
  }
  return null;
};
