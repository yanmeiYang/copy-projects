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
    const title = ['中国', '美国', '其他'];
    const { USA, China, OtherNation } = info;
    const comPer = {
      title,
      num: [China.authorsCount, USA.authorsCount, OtherNation.authorsCount],
    };
    const comPub = { title, num: [China.pubsCount, USA.pubsCount, OtherNation.pubsCount] };
    const comCit = {
      title,
      num: [China.heat.toFixed(0), USA.heat.toFixed(0), OtherNation.heat.toFixed(0)],
    };

    return (
      <div className={styles.modalContent}>
        <div>
          <h4>中美研究人员对比</h4>
          <BarChart id="expert" compareVal={comPer} />
        </div>
        <div>
          <h4>中美研究论文对比</h4>
          <BarChart id="pub" compareVal={comPub} />
        </div>
        <div>
          <h4>中美论文影响对比</h4>
          <BarChart id="citation" compareVal={comCit} />
        </div>
        { info.nations.length > 0 &&
        <div>
          <h4>全球前10个国家</h4>
          <div>
            {info.nations.slice(0, 10).map((item, index) => {
              return (
                <Tooltip key={index} placement="top" title={item._1}>
                  <a href="#">
                    <Tag className={styles.antTag}>{item._1}</Tag>
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
            {info.orgs.slice(0, 20).map((item, index) => {
              return (
                <Tooltip key={index} placement="top" title={item._1} >
                  <a href="#" className={styles.tooltip}>
                    <Tag key={index} className={styles.antTag}>
                      {item._1.length > 110 ? `${item._1.slice(0, 110)}...` : item._1}
                    </Tag>
                  </a>
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

