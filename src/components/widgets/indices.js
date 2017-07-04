/**
 *  Created by BoGao on 2017-07-4;
 */
import React from 'react';
import { Tooltip, Tag } from 'antd';
import styles from './indices.less';

/**
 * @param indices - indices node from person.
 * showItems - TODO use this to config which indices to show.
 */
const Indices = ({ indices, showItems }) => {
  if (!indices) return <span>[][][][][][][][][]</span>;
  return (
    <div className="score-line">
      <Tooltip placement="top" title="CCF活动贡献（C）">
        <span className="score blue">
          <span className="l">C</span>
          <span className="r">{indices.num_citation}</span>
        </span>
      </Tooltip>
      <Tooltip placement="top" title="学术成就（H）">
        <span className="score gray">
          <span className="l">H</span>
          <span className="r">{indices.h_index}</span>
        </span>
      </Tooltip>
      <Tooltip placement="top" title="学术活跃度（A）">
        <span className="score pink">
          <span className="l">A</span>
          <span className="r">{indices.activity.toFixed(2)}</span>
        </span>
      </Tooltip>
    </div>
  );
}

export default Indices;
