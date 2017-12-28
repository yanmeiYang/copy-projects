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
    const { USA, China, OtherNation, authorsCount, EmptyNation, NationBoost } = info;

    const tAuthorsCount = Number(authorsCount) - Number(EmptyNation.authorsCount);
    let aBoost = 1;
    if (tAuthorsCount) {
      aBoost = Number(EmptyNation.authorsCount) / tAuthorsCount;
    }
    const cAuthors = (China.authorsCount * aBoost).toFixed(0);
    const uAuthors = (USA.authorsCount * aBoost).toFixed(0);
    const oAuthors = Number(authorsCount) - (Number(cAuthors) + Number(uAuthors));
    const comPer = { title, num: [cAuthors, uAuthors, oAuthors] };
    let cPubs = China.pubsCount;
    let uPubs = USA.pubsCount;
    let oPubs = OtherNation.pubsCount;

    let cCit = China.heat;
    let uCit = USA.heat;
    let oCit = OtherNation.heat;

    if (NationBoost) {
      cPubs = China.pubsCount.toFixed(0);
      uPubs = USA.pubsCount.toFixed(0);
      oPubs = (OtherNation.pubsCount).toFixed(0);
      cCit = (China.heat * NationBoost).toFixed(0);
      uCit = (USA.heat * NationBoost).toFixed(0);
      oCit = (OtherNation.heat * NationBoost).toFixed(0);
    }
    const comPub = { title, num: [cPubs, uPubs, oPubs] };
    const comCit = { title, num: [cCit, uCit, oCit] };
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
                <Tooltip key={index} placement="top" title={item._1}>
                  <div>
                    <a href="javascript:void(0)" className={styles.tooltip}>
                      <Tag key={index} className={styles.antTag}>
                        {item._1.length > 110 ? `${item._1.slice(0, 120)}...` : item._1}
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

