/**
 * Created by ranyanchuan on 2017/11/2.
 */
import React from 'react';
import { connect } from 'dva';
import { Tag, Tooltip } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

class CrossStatistics extends React.Component {

  barWidth = (hindexData) => {
    const indexList = [hindexData['1'], hindexData['2'], hindexData['3'], hindexData['4'], hindexData['5']];
    const maxIndex = Math.max.apply(null, indexList);
    const tmp = 130 / maxIndex;
    const widthList = [tmp * hindexData['1'], tmp * hindexData['2'], tmp * hindexData['3'], tmp * hindexData['4'], tmp * hindexData['5']];
    return widthList;
  }

  onTagChange = (item) => {
    const title = item.split(',');
    const param = { first: title[0], second: title[1], key: 'expert', power: 1 };
    // todo modal show
    // this.showModal(param);
  }

  render() {
    const crossInfo = this.props.statisticsInfo;
    let hIndexBarWidth = [];
    let citationBarWidth = [];
    if (crossInfo) {
      hIndexBarWidth = this.barWidth(crossInfo.hIndexDistribution);
      citationBarWidth = this.barWidth(crossInfo.citationDistribution);
    }
    return (
      <div className={styles.statistics}>
        <div>
          <div className={styles.title}>
            <i className="fa fa-bar-chart" aria-hidden="true" />
            <span>统计</span>
          </div>
          <div className={styles.contentBasic}>
            <div>
              <span>专家：</span>
              <span className={styles.num}>{crossInfo.authorSize}</span>
              <span>人</span>
            </div>
            <div>
              <span>论文：</span>
              <span className={styles.num}>{crossInfo.pubSize}</span>
              <span>篇</span>
            </div>
            <div>
              <span>华人：</span>
              <span className={styles.num}>{crossInfo.ChinaAuthorSize}</span>
              <span>人</span>
            </div>
            <div>
              <span>H-index均值：</span>
              <span className={styles.num}>{crossInfo.averageHIndex.toFixed(2)}</span>
            </div>
            <div>
              <span>Citation均值：</span>
              <span className={styles.num}>{crossInfo.averageCitation.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <i className="fa fa-area-chart" aria-hidden="true" />
            <span>H-index分布</span>
          </div>
          <div className={styles.contentHindexCition}>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>&lt;10</div>
              <div className={styles.item1}
                   style={{ width: Math.ceil(hIndexBarWidth[0]) }}>
                {crossInfo.hIndexDistribution['1']}</div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>10~20</div>
              <div className={styles.item2}
                   style={{ width: Math.ceil(hIndexBarWidth[1]) }}>
                {crossInfo.hIndexDistribution['2']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>20~40</div>
              <div className={styles.item3}
                   style={{ width: Math.ceil(hIndexBarWidth[2]) }}>
                { crossInfo.hIndexDistribution['3']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>40~60</div>
              <div className={styles.item4}
                   style={{ width: Math.ceil(hIndexBarWidth[3]) }}>
                {crossInfo.hIndexDistribution['4']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>&gt;60</div>
              <div className={styles.item5}
                   style={{ width: Math.ceil(hIndexBarWidth[4]) }}>
                {crossInfo.hIndexDistribution['5']}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.title}>
            <i className="fa fa-bar-chart" aria-hidden="true" />
            <span>citation分布</span>
          </div>
          <div className={styles.contentHindexCition}>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>&lt;1</div>
              <div className={styles.item1}
                   style={{ width: Math.ceil(citationBarWidth[0]) }}
              >{crossInfo.citationDistribution['1']}</div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>1~10</div>
              <div className={styles.item2}
                   style={{ width: Math.ceil(citationBarWidth[1]) }}>{crossInfo.citationDistribution['2']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>10~100</div>
              <div className={styles.item3}
                   style={{ width: Math.ceil(citationBarWidth[2]) }}>
                { crossInfo.citationDistribution['3']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>100~200</div>
              <div className={styles.item4}
                   style={{ width: Math.ceil(citationBarWidth[3]) }}>
                {crossInfo.citationDistribution['4']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>&gt;200</div>
              <div className={styles.item5}
                   style={{ width: Math.ceil(citationBarWidth[4]) }}>
                {crossInfo.citationDistribution['5']}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <i className="fa fa-sort-amount-desc" aria-hidden="true" />
            <span>最热交叉</span>
          </div>
          <div className={styles.content}>
            {crossInfo.hottestFive.map((item, index) => {
              return (
                <Tooltip key={index} placement="top" title={item}
                         onClick={this.onTagChange.bind(this, item)}>
                  <div href="#" className={styles.hTitle}>
                    <Tag
                      className={styles.antTag}>{index + 1}. {item.replace(',', ' & ')}</Tag>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <span alt="" className={classnames('icon', styles.titleIcon)} />
            <span>图例</span>
          </div>
          <div className={styles.contentLegend}>
            <div className={styles.legend}>
              <div className={styles.label}>学科热度：</div>
              <div className={styles.hColor1}>
                <div>低</div>
                <div>高</div>
              </div>
            </div>
            <div className={styles.legend}>
              <div className={styles.label}>学科专家：</div>
              <div className={styles.eColor}></div>
            </div>
            <div className={styles.legend}>
              <div className={styles.label}>学科论文：</div>
              <div className={styles.pColor}></div>
            </div>
            <div className={styles.legend}>
              <div className={styles.label}>正在计算：</div>
              <div className={styles.lColor}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ loading }) => ({ loading }))(CrossStatistics);

