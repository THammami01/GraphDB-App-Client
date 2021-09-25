import * as _ from "../actions/action-types";
import { getSaveIsNavExpanded } from "../../utils/functions";

const initialState = {
  isLoading: false,
  isNavExpanded: getSaveIsNavExpanded(),
  selectedNav: "Home",
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

    default:
      return state;
  }
};

export default globalReducer;
