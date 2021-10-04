import * as _ from "../actions/action-types";
import { getIsNavExpanded } from "../../utils/functions";

const initialState = {
  isLoading: false,
  isNavExpanded: getIsNavExpanded(),
  selectedNav: "Home",
  isConnected: false,
};

const globalReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case _.SET_IS_LOADING:
      return { ...state, isLoading: payload };

    case _.SET_IS_NAV_EXPANDED:
      localStorage.setItem("isNavExpanded", !state.isNavExpanded);
      return { ...state, isNavExpanded: !state.isNavExpanded };

    case _.SET_SELECTED_NAV:
      return { ...state, selectedNav: payload };

    case _.SET_IS_CONNECTED:
      return { ...state, isConnected: payload }
      
    default:
      return state;
  }
};

export default globalReducer;
