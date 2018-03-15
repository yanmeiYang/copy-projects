import queryString from "query-string";

const debug = require('debug')('aminer:engine:helper');

const getSearchParams = (props) => {
  if (!props) {
    debug('helper: props is not available.')
  }
  const { location } = props;
  return queryString.parse(location.search);
};

const getMatchParams = (props) => {
  if (!props) {
    debug('helper: props is not available.')
  }
};

export default {
  getSearchParams, getMatchParams
};

export {}
