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
    const comPer = {
      title,
      num: [info.ChinaAuthorSize, info.USAAuthorSize, info.otherAuthorSize],
    };
    const comPub = { title, num: [info.ChinaPubSize, info.USAPubSize, info.otherPubSize] };
    const comCit = { title, num: [info.ChinaCitationCount, info.USACitationCount, 0] };

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
        { info.nationCitationList.length > 0 &&
        <div>
          <h4>全球前10个国家</h4>
          <div>
            {info.nationCitationList.slice(0, 10).map((item, index) => {
              return (
                <Tooltip key={index} placement="top" title={item.nation}>
                  <a href="#">
                    <Tag className={styles.antTag}>{item.nation}</Tag>
                  </a>
                </Tooltip>
              );
            })}
          </div>
        </div>
        }
        { info.orgCitationList.length > 0 &&
        <div>
          <h4>全球前20个机构</h4>
          <div>
            {info.orgCitationList.slice(0, 20).map((item, index) => {
              return (
                <Tooltip key={index} placement="top" title={item.org}>
                  <a href="#">
                    <Tag key={index} className={styles.antTag}>
                      {item.org.length > 110 ? `${item.org.slice(0, 110)}...` : item.org}
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

