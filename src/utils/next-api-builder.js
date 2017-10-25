import { merge } from 'lodash';

/**
 *  Created by BoGao on 2017-10-25;
 *
 *  Note: Next API QueryBuilder
 */
class ParamError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParamError";
  }
}


// Query api-builder.
const query = (action) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }

  const api = {
    action,
    parameters: {},
    schema: {},
  };

  const chains = {
    api,
    param: (params) => {
      if (params) {
        Object.keys(params).map((key) => {
          api.parameters[key] = params[key];
          return false;
        });
      }
      return chains;
    },
    mergeParam: (params) => {
      api.parameters = merge(api.parameters, params);
      return chains;
    },
    schema: (data) => {
      api.schema = data;
      return chains;
    },
  };
  return chains;
};

// TODO alter, run.

const apiBuilder = {
  //
  // Query
  //
  query,

  // alter: () => {},
  // run: () => {},
};

// Builtin Fields.
const F = {
  action: { search: 'search' }, // available actions.
  searchType: { all: 'all', allb: 'allb' },
  fields: {
    person: {
      indices_all: ['hindex', 'gindex', 'numpubs',
        'citation', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'],
    },
  },
};

module.exports = {
  apiBuilder, F,
};

//
// // TEST
//
// const q = apiBuilder.query(F.action.search)
//   .param({ query: 'data mining', offset: 0, size: 10 })
//   .param({ searchType: F.searchType.allb })
//   .param({ aggregation: ['gender', 'h_index', 'location', 'language'] })
//   .schema({
//     person: [
//       'id', 'name', 'name_zh', 'tags', // 'tags_zh', 'tags_trans_zh'
//       {
//         profile: [
//           'position', 'affiliation',
//           // 'org', 'org_zh', 'bio', 'email', 'edu' ', phone'
//         ],
//       },
//       { indices: F.fields.person.indices_all },
//     ],
//   });
// // .filters(),
//
// q.param({
//   filters: {
//     dims: {
//       title: ['sdfsdf'],
//     },
//   },
// });
//
// q.mergeParam({ filters: { dims: { title: ['234234'] } } });
//
// console.log(q.api);
// console.log('--------------------------');
// console.log(JSON.stringify(q.api));
