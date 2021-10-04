import * as _ from "./action-types";

export const setIsLoading = (payload) => {
  return {
    type: _.SET_IS_LOADING,
    payload
  };
};

export const setSelectedNav = (payload) => {
  return {
    type: _.SET_SELECTED_NAV,
    payload,
  };
};

export const setIsNavExpanded = (payload) => {
  return {
    type: _.SET_IS_NAV_EXPANDED,
    payload,
  };
};

export const setIsConnected = (payload) => {
  return {
    type: _.SET_IS_CONNECTED,
    payload,
  };
};
