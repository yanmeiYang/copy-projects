/* eslint-disable no-param-reassign */
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
  // console.log('person is >>>>>>>>>>', person);
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

      // h_index, g_index, num_pubs, citation, activity, diversity, new_star, rising_star, sociability,
      // 'hindex', 'gindex', 'numpubs', 'citation', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'
      indices: {
        hindex: person.indices.h_index,
        gindex: person.indices.g_index,
        numpubs: person.indices.num_pubs,
        citation: person.indices.num_citation,
        newStar: person.indices.new_star,
        risingStar: person.indices.risingStar,
        activity: person.indices.activity,
        diversity: person.indices.diversity,
        sociability: person.indices.sociability,
      },

      tags: person.tags && person.tags.map(tag => tag.t),
      tags_zh: person.tags_zh && person.tags_zh.map(tag => tag.t),

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

const toNextAggregation = (aggs) => {
  console.log('bridge before >>>>>>>>>>', aggs);
  if (aggs && aggs.length > 0) {
    aggs.map((agg) => {
      agg.name = agg.type;
      agg.items = agg.item && agg.item.map((i) => {
        return {
          term: i.value,
          count: i.count,
        };
      });
      // value,count,label, item, count
      delete agg.item;
      delete agg.type;
      delete agg.label;
      return false;
    });
  }
  console.log('bridge after >>>>>>>>>>', aggs);
  return aggs;
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
};
