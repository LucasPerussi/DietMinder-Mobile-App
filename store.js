import { createStore } from 'redux';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;