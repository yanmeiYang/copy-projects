/**
 * Created by ranyanchuan on 2017/11/2.
 */
import React from 'react';
import { connect } from 'dva';
import { Tag, Tooltip } from 'antd';
import BarChart from '../bar-chart/index';
import styles from './index.less';

class CrossContrast extends React.Component {
  render() {
    const info = this.props.compareData;
    const { contrast } = info;
    return (
      <div className={styles.modalContent}>
        <div>
          <h4>中美研究人员对比</h4>
          <BarChart id="expert" compareVal={contrast.comPer} />
        </div>
        <div>
          <h4>中美研究论文对比</h4>
          <BarChart id="pub" compareVal={contrast.comPub} />
        </div>
        <div>
          <h4>中美论文影响对比</h4>
          <BarChart id="citation" compareVal={contrast.comCit} />
        </div>
        { info.nations.length > 0 &&
        <div>
          <h4>全球前10个国家</h4>
          <div>
            {info.nations.slice(0, 10).map((nitem, index) => {
              return (
                <Tooltip key={index.toString()} placement="top" title={`${nitem._1}`}>
                  <a href="#">
                    <Tag className={styles.antTag}>{`${nitem._1}`}</Tag>
                  </a>
                </Tooltip>
              );
            })}
          </div>
        </div>
        }
        { info.orgs.length > 0 &&
        <div>
          <h4>全球前20个机构</h4>
          <div>
            {info.orgs.slice(0, 20).map((oitem, oindex) => {
              return (
                <Tooltip key={oindex.toString()} placement="top" title={oitem._1}>
                  <div>
                    <a href="#" className={styles.tooltip}>
                      <Tag key={oindex.toString()} className={styles.antTag}>
                        {oitem._1.length > 110 ? `${oitem._1.slice(0, 120)}...` : oitem._1}
                      </Tag>
                    </a>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
        }
      </div>
    );
  }
}
export default connect(({ loading }) => ({ loading }))(CrossContrast);

