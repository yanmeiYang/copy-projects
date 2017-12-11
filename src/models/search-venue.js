/**
 * Created by yangyanmei on 17/11/10.
 */
import * as venueService from 'services/venue';

export default {

  namespace: 'searchVenue',

  state: {
    venues: null,
  },

  subscriptions: {
    setup() {
    },
  },

  effects: {
    * getVenuesByQuery({ payload }, { call, put }) {
      try {
        const { query } = payload;
        const { data } = yield call(venueService.getSearchVenue, query, 0, 100);
        console.log('searvice >>>>>>>>>> TODO bad code', data);
        yield put({ type: 'getVenuesByQuerySuccess', payload: { data } });
      } catch (err) {
        console.error(err);
      }
    },

  },

  reducers: {
    getVenuesByQuerySuccess(state, { payload: { data } }) {
      console.log('>>>>>>>>>>> reducers >>>>>>>>>>', data);
      return { ...state, venues: data.data.slice(0, 8) };
    },
  },
};
