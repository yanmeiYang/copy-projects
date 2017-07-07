/**
 *  Created by BoGao on 2017-07-4;
 */
import React from 'react';
import { Tooltip, Tag } from 'antd';
import styles from './indices.less';

const indicesConfig = {
  // relevance: { key: 'relevance', letter: 'R', tooltip: '搜索相关度（R）', color: 'blue' },
  h_index: {
    key: 'h_index',
    letter: 'H',
    tooltip: '学术成就H-index（H）',
    color: 'gray',
  },
  activity: {
    key: 'activity',
    letter: 'A',
    tooltip: '学术活跃度（A）',
    color: 'pink',
    render: (indices) => {
      return indices.activity.toFixed(2);
    },
  },
  rising_star: {
    key: 'new_star',
    letter: 'S',
    tooltip: '领域新星（S）',
    color: 'gray',
    render: (indices) => {
      return indices.new_star.toFixed(2);
    },
  },
  citation: {
    key: 'num_citation',
    letter: 'c',
    tooltip: '引用数（c）',
    color: 'blue',
  },
  num_pubs: {
    key: 'num_pubs',
    letter: 'P',
    tooltip: '论文数（P）',
    color: 'gray',
  },
  activityRankingContrib: {// special for ccf.
    key: 'activity-ranking-contrib',
    letter: 'C',
    color: 'blue',
    tooltip: 'CCF活动贡献（C）',
    render: (activity, activity_indices) => {
      return activity_indices.contrib.toFixed(2);
    },
  },
};

const defaultIndices = ['activity-ranking-contrib', 'h_index', 'activity', 'rising_star', 'citation', 'num_pubs'];

/**
 * @param indices - indices node from person.
 * showItems - TODO use this to config which indices to show.
 */
const Indices = ({ indices, activity_indices, showIndices }) => {
  if (!indices) return <span>[][][][][][][][][]</span>;
  let indicesKeys = defaultIndices;
  if (showIndices && showIndices.length > 0) {
    indicesKeys = showIndices;
  }

  return (
    <div className="score-line">
      {indicesKeys && indicesKeys.length > 0 &&
      indicesKeys.map((key) => {
        const ic = indicesConfig[key];
        if (!ic) {
          return '';
        }
        return (
          <Tooltip key={ic.key} placement="top" title={ic.tooltip}>
            <span className={`score ${ic.color}`}>
              <span className="l">{ic.letter}</span>
              <span className="r">
                {ic.render ? ic.render(indices, activity_indices) : indices[ic.key]}
              </span>
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default Indices;
