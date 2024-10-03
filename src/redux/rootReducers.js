import { combineReducers } from "redux";
import { authApiSliceReducer } from "./Auth/AuthSlice";
import { dashboardApiSliceReducer } from "./dashboard/slice";

const rootReducers = combineReducers({
  registerApi: authApiSliceReducer,
  dashboardReducer: dashboardApiSliceReducer,
});

export default rootReducers;
