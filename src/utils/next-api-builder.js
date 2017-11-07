import { mergeWith, isArray } from 'lodash';

/**
 *  Created by BoGao on 2017-10-25;
 *
 *  Note: Next API QueryBuilder
 */
class ParamError extends Error {
  constructor(message) {
    super();
    this.name = 'ParamError';
  }
}

function apiMerge(obj, source) {
  mergeWith(obj, source, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
}

// Query api-builder.
const query = (action, eventName) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }

  const api = {
    action,
    eventName,
  };

  const chains = {
    api,
    param: (params, config) => {
      if (!config || config.when) {
        if (params) {
          if (!api.parameters) {
            api.parameters = {};
          }
          Object.keys(params).map((key) => {
            api.parameters[key] = params[key];
            return false;
          });
        }
      }
      return chains;
    },
    addParam: (params) => {
      if (!api.parameters) {
        api.parameters = {};
      }
      apiMerge(api.parameters, params);
      return chains;
    },
    schema: (schema, config) => {
      if (!config || config.when) {
        if (!api.schema) {
          api.schema = {};
        }
        api.schema = schema;
      }
      return chains;
    },
    addSchema: (schema) => {
      if (!api.schema) {
        api.schema = {};
      }
      apiMerge(api.schema, schema);
      return chains;
    },
  };
  return chains;
};

// Alter api-builder.
const alter = (action) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }

  const api = {
    action,
  };

  const chains = {
    api,
    param: (params, config) => {
      if (!config || config.when) {
        if (params) {
          if (!api.parameters) {
            api.parameters = {};
          }
          Object.keys(params).map((key) => {
            api.parameters[key] = params[key];
            return false;
          });
        }
      }
      return chains;
    },
    addParam: (params) => {
      if (!api.parameters) {
        api.parameters = {};
      }
      apiMerge(api.parameters, params);
      return chains;
    },
    schema: (schema, config) => {
      if (!config || config.when) {
        if (!api.schema) {
          api.schema = {};
        }
        api.schema = schema;
      }
      return chains;
    },
    addSchema: (schema) => {
      if (!api.schema) {
        api.schema = {};
      }
      apiMerge(api.schema, schema);
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

  alter,

  // alter: () => {},
  // run: () => {},
};

// Builtin Fields.
const F = {
  Type: { Query: 'query', Alter: 'alter' },

  // query related
  queries: { search: 'search' }, // query actions.
  searchType: { all: 'all', allb: 'allb' },
  fields: {
    person: {
      indices_all: ['hindex', 'gindex', 'numpubs',
        'citation', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'],
    },
  },

  // alter related
  alters: { alter: 'alter' }, // alter actions.
  alterop: { upsert: 'upsert', update: 'update', delete: 'delete' }, // alter operations

  Entities: { Person: 'person', Publication: 'pub', Venue: 'venue' },
};

// functions
const applyPlugin = (nextapi, pluginConfig) => {
  if (!nextapi || !pluginConfig) {
    return false;
  }
  nextapi.addParam(pluginConfig.parameters);
  nextapi.addSchema(pluginConfig.schema);
  // TODO ... merge filters, sorts, havings, etc...
  return nextapi;
};

module.exports = {
  apiBuilder, F, applyPlugin,
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
