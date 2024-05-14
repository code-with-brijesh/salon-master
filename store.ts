import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import rolesAndMenusReducer from "./slices/rolesAndMenusSlice";
import connectUsersReducer from "./slices/connectUsersSlice";
import solaWebSiteSlice from "./slices/solaWebSiteSlice";
import dealSlice from "./slices/dealSlice";
import leaseSlice from "./slices/leaseSlice";
import partnerInquiriesSlice from "./slices/partnerInquiriesSlice";
import mobileAppSlice from "./slices/mobileAppSlice";
import bookNowBookingSlice from "./slices/bookNowBokingSlice";
import systemAdminSlice from "./slices/systemAdminSlice";
import locationSlice from "./slices/locationSlice";
import rockbotSlice from "./slices/rockbotSlice";
import franchiseeWebsiteSlice from "./slices/franchiseeWebSiteSlice";
import solaProSlice from "./slices/solaProSlice";
import downloadCenterSlice from "./slices/downloadCenter";
import associationSlice from "./slices/associationSlice";
import docusignSlice from "./slices/docusignSlice";
import repairMaintenanceSlice from "./slices/repairMaintenanceSlice";
import repairMaintenanceTicketSlice from "./slices/repairMaintenanceTicketSlice";
import repairMaintenanceNotesSlice from "./slices/repairMaintenanceNotesSlice";
import dealImportSlice from "./slices/deal-import-slice";

const rootReducer = combineReducers({
  authReducer,
  notificationReducer,
  rolesAndMenusReducer,
  connectUsersReducer,
  solaWebSiteSlice,
  dealSlice,
  leaseSlice,
  partnerInquiriesSlice,
  mobileAppSlice,
  bookNowBookingSlice,
  systemAdminSlice,
  locationSlice,
  rockbotSlice,
  franchiseeWebsiteSlice,
  solaProSlice,
  downloadCenterSlice,
  associationSlice,
  docusignSlice,
  repairMaintenanceSlice,
  repairMaintenanceTicketSlice,
  repairMaintenanceNotesSlice,
  dealImportSlice,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
