import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { getAuthUser } from "helper/services";

interface InitialState {
  checkUser: any;
  loading: boolean;
  userData: any;
  thankYou: any;
  tableLoader: boolean;
  notifications: any;
  notificationUnread: any;
  dealDetailId: any;
}

const initialState: InitialState = {
  checkUser: null,
  loading: false,
  userData: getAuthUser(),
  thankYou: null,
  tableLoader: false,
  notifications: null,
  notificationUnread: null,
  dealDetailId: null,
};

const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    checkUser: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      checkUser: action.payload,
    }),
    setLoading: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      loading: action.payload,
    }),
    getLoginUser: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      userData: action.payload,
    }),
    setThankYou: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      thankYou: action.payload,
    }),
    setTableLoader: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      tableLoader: action.payload,
    }),
    setNotifications: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      notifications: action.payload,
    }),
    setNotificationUnread: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      notificationUnread: action.payload,
    }),
    setDealDetailId: (state: Draft<InitialState>, action: PayloadAction<any>) => ({
      ...state,
      dealDetailId: action.payload,
    }),
  },
});

export const {
  checkUser,
  setLoading,
  getLoginUser,
  setThankYou,
  setTableLoader,
  setNotifications,
  setNotificationUnread,
  setDealDetailId,
} = authSlice.actions;

export default authSlice.reducer;
