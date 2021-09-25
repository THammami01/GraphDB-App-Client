import { combineReducers } from "redux";
import globalReducer from "./global.reducer";

export default combineReducers({
  global: globalReducer,
});
