/**
 * Created by BoGao on 2018-08-13.
 */
export default {
  namespace: 'auth',

  state: {
    loading: false,
    errorMessage: '',
  },

  subscriptions: {},
  effects: {},

  reducers: {
    setMessage(state, { payload: { message } }) {
      return { ...state, errorMessage: message };
    },

    loginError(state, data) {
      return { ...state, errorMessage: data.data, loading: false };
    },

    showLoading(state) {
      return { ...state, loading: true };
    },

    hideLoading(state) {
      return { ...state, loading: false };
    },
  },
};
