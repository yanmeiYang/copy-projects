/* eslint-disable camelcase */
/**
 *  Created by BoGao on 2017-07-4;
 */
import React from 'react';
import { Tooltip, Tag } from 'antd';
import { classnames } from 'utils/index';
import styles from './indices.less';

const indicesConfig = {
  // relevance: { key: 'relevance', letter: 'R', tooltip: '搜索相关度（R）', color: 'blue' },
  h_index: {
    key: 'hindex',
    letter: 'H',
    tooltip: '学术成就H-index（H）',
    color: 'h_index',
    render: (indices) => {
      return indices.hindex || indices.h_index;
    },
  },
  activity: {
    key: 'activity',
    letter: 'A',
    tooltip: '学术活跃度（A）',
    color: 'activity',
    render: (indices) => {
      return indices.activity && indices.activity.toFixed(2);
    },
  },
  rising_star: { // Actually this is newStar.
    key: 'newStar',
    letter: 'S',
    tooltip: '领域新星（S）',
    color: 'new_star',
    render: (indices) => {
      return (indices.newStar && indices.newStar.toFixed(2)) || 0;
    },
  },
  citations: {
    key: 'citations',
    letter: 'c',
    tooltip: '引用数（c）',
    color: 'num_citation',
  },
  num_pubs: {
    key: 'pubs',
    letter: 'P',
    tooltip: '论文数（P）',
    color: 'num_pubs',
  },
  activityRankingContrib: {// special for ccf.
    key: 'activity-ranking-contrib',
    letter: 'C',
    color: 'blue',
    tooltip: 'CCF活动贡献（C）',
    render: (activity, activity_indices) => {
      if (activity.activityRankingContrib || activity.activityRankingContrib === 0) {
        return activity.activityRankingContrib;
      } else {
        return activity_indices && activity_indices.contrib && activity_indices.contrib.toFixed(2);
      }
    },
  },
};

const defaultIndices = ['activity-ranking-contrib', 'h_index', 'activity', 'rising_star', 'citations', 'num_pubs'];

/**
 * @param indices - indices node from person.
 * showItems - TODO use this to config which indices to show.
 */
const Indices = ({ indices, activity_indices, showIndices }) => {
  if (!indices) return false;
  let indicesKeys = defaultIndices;
  if (showIndices && showIndices.length > 0) {
    indicesKeys = showIndices;
  }

  return (
    <div className={styles.scoreLine}>
      {indicesKeys && indicesKeys.length > 0 &&
      indicesKeys.map((key) => {
        const ic = indicesConfig[key];
        if (!ic) {
          return '';
        }
        return (
          <Tooltip key={ic.key} placement="top" title={ic.tooltip}>
            <span className={classnames(styles.score, styles[ic.color])}>
              <span className={styles.l}>{ic.letter}</span>
              <span className={styles.r}>
                {ic.render ? ic.render(indices, activity_indices) : indices[ic.key]}
              </span>
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default Indices;
