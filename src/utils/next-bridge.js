/* eslint-disable no-param-reassign,camelcase */
/**
 *  Created by BoGao on 2017-08-14;
 *
 *  Note: This util is disabled in production mode.
 */
import * as profileUtils from 'utils/profile-utils';

const nextBridge = '';

const toNextPersons = (persons) => {
  if (persons) {
    return persons.map(person => toNextPerson(person));
  }
};

const toNextPerson = (person) => {
  if (person) {
    return {
      id: person.id,
      name: person.name,
      name_zh: person.name_zh,
      avatar: person.avatar,

      profile: {
        position: profileUtils.displayPosition(person.pos), // TODO 有pos_zh么？
        affiliation: profileUtils.displayAff(person),
        affiliation_zh: profileUtils.displayAff(person), // TODO
        homepage: person.homepage,
        org: '',
        org_zh: '',
        bio: person.contact && person.contact.bio,
        email: person.contact && person.contact.email,
        edu: person.contact && person.contact.edu,
        phone: '', // TODO phone
      },

      indices: toNextIndices(person.indices, person.activity_indices),

      tags: person.tags && person.tags.map(tag => tag.t),
      tags_zh: person.tags_zh && person.tags_zh.map(tag => tag.t),
      num_viewed: person.num_viewed,

      // -

      score: person.score,

      phone: person.contact && person.contact.phone,
      email: profileUtils.displayEmailSrc(person),
      activity_indices: person.activity_indices, // TODO ccf 的麻烦

      labels: '', // TODO 旧数据没有。

      // additional old data.
      pin: person.pin,
      locks: person.locks,
      attr: person.attr,

    };
  }
  return null;
};

const toNextIndices = (indices, activity_indices) => {
  return {
    hindex: indices.h_index,
    gindex: indices.g_index,
    pubs: indices.num_pubs, // pubs, old numpubs
    citations: indices.num_citation, // citations, old citation
    newStar: indices.new_star,
    risingStar: indices.risingStar,
    activity: indices.activity,
    diversity: indices.diversity,
    sociability: indices.sociability,
    activityRankingContrib: activity_indices ? activity_indices.contrib : '',
  };
};

/*
   TODO Add old and new format.
   NEW request format: ['gender', 'h_index', 'location', 'lang'];
   OLD request format: in-api, /agg.
   NEW response format:
     TODO...
   OLD response format:
   {
     "aggs": [
    { "type": "h_index", "label": "H-Index",
      "item": [{
          "value": "<10",
          "count": 782,
          "label": "<10"
      }]
    },
    { "type": "gender", "label": "Gender", "items":...}
    { "type": "language", "label": "Language", "items":...}
    { "type": "nationality", "label": "Location", "items":...}


 */
const aggregationKeyMap = {
  language: 'lang',
  nationality: 'nation',
};
const aggregationItemKeyMap = {
  male: 'Male',
  female: 'Female',
};
const toNextAggregation = (aggs) => {
  // console.log('bridge before >>>>>>>>>>', aggs);
  const newAggs = aggs && aggs.map((agg) => {
    const newAgg = {};
    const mappedName = aggregationKeyMap[agg.type];
    newAgg.name = mappedName || agg.type;
    newAgg.items = agg.item && agg.item.map((item) => {
      const mappedKey = aggregationItemKeyMap[item.value];
      return {
        term: mappedKey || item.value,
        count: item.count,
      };
    });
    return newAgg;
  });
  // console.log('bridge after >>>>>>>>>>', newAggs);
  return newAggs;
};

const ccfLabelMap = {
  '592f6d219ed5dbf59c1b76d4': '高级会员',
  '58ddbc229ed5db001ceac2a4': '杰出会员',
  '592f8af69ed5db8bb68d713b': '会士',
  '5949c2f99ed5dbc2147fd854': '会员',
};

const toNextCCFLabelFromEBID = (ebid) => {
  return `CCF_MEMBER_${ccfLabelMap[ebid]}`;
};

module.exports = {
  toNextPersons,
  toNextAggregation,
  toNextCCFLabelFromEBID,
  toNextIndices,
};
