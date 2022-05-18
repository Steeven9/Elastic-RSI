const initialState = {
  page: 'home',
  drawer: false,
  tab: 'home',
};

const generalReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_PAGE':
      return {
        ...state,
        page: payload,
      };
    case 'SET_DRAWER':
      return {
        ...state,
        drawer: payload,
      };
    case 'SET_TAB':
      return {
        ...state,
        tab: payload,
      };
    default:
      return state;
  }
};

export default generalReducer;
