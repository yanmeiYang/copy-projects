export default {
  namespace: 'countModel',
  state: {
    number: 0,
  },
  reducers: {
    increase(state) {
      return { ...state, number: state.number + 1 };
    },
    decrease(state) {
      return { ...state, number: state.number - 1 };
    },
  },
};
