/**
 * Created by ranyanchuan on 2017/11/2.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Tag, Tooltip } from 'antd';
import { compare } from 'utils';
import styles from './index.less';

class CrossStatistics extends React.Component {
  barWidth = (hindexData) => {
    const indexList = [hindexData['0'] || 0, hindexData['1'] || 0, hindexData['2'] || 0, hindexData['3'] || 0, hindexData['4'] || 0];
    const maxIndex = Math.max.apply(null, indexList);
    const tmp = 130 / maxIndex;
    const widthList = [tmp * hindexData['0'] || 0, tmp * hindexData['1'] || 0, tmp * hindexData['2'] || 0, tmp * hindexData['3'] || 0, tmp * hindexData['4'] || 0];
    return widthList;
  }

  onTagChange = (item) => {
    const title = item.split('&');
    const param = { first: title[0].trim(), second: title[1].trim(), key: 'expert', heat: 1 };
    // todo modal show
    this.props.showModal(param);
  }

  getTop = (infoList, nodeData) => {
    const info = [];
    infoList.map((item, index) => {
      info.push({ id: index, heat: item.heat });
      return true;
    });
    const info5 = info.sort(this.compare('heat')).slice(0, 5);
    const top5 = [];
    info5.map((item) => {
      const key = nodeData[item.id]._1 + ' & ' + nodeData[item.id]._2;
      top5.push(key);
      return true;
    });
    return top5;
  }


  compare = (prop) => {
    return (obj1, obj2) => {
      const val1 = obj1[prop];
      const val2 = obj2[prop];
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    };
  }

  render() {
    const { cross, nodeData } = this.props;
    const { data, detail } = cross;
    const { authors, pubs } = detail;
    let hIndexBarWidth = [];
    let citationBarWidth = [];
    if (detail) {
      hIndexBarWidth = this.barWidth(authors.distribute);
      citationBarWidth = this.barWidth(pubs.distribute);
    }
    let top5 = [];
    if (data) {
      top5 = this.getTop(data, nodeData);
    }
    let boost = detail.authorsCount - detail.EmptyNation.authorsCount;
    if (boost) {
      boost = detail.EmptyNation.authorsCount / boost;
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
              <span className={styles.num}>{detail.authorsCount}</span>
              <span>人</span>
            </div>
            <div>
              <span>论文：</span>
              <span className={styles.num}>{detail.pubsCount}</span>
              <span>篇</span>
            </div>
            <div>
              <span>华人：</span>
              <span className={styles.num}>{(detail.China.authorsCount * boost).toFixed(0)}</span>
              <span>人</span>
            </div>
            <div>
              <span>H-index均值：</span>
              <span className={styles.num}>{detail.averageHIndex.toFixed(2)}</span>
            </div>
            <div>
              <span>Citation均值：</span>
              <span className={styles.num}>{detail.averageCitation.toFixed(2)}</span>
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
                {authors.distribute['0']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>10~20</div>
              <div className={styles.item2}
                   style={{ width: Math.ceil(hIndexBarWidth[1]) }}>
                {authors.distribute['1']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>20~40</div>
              <div className={styles.item3}
                   style={{ width: Math.ceil(hIndexBarWidth[2]) }}>
                { authors.distribute['2']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>40~60</div>
              <div className={styles.item4}
                   style={{ width: Math.ceil(hIndexBarWidth[3]) }}>
                {authors.distribute['3']}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>&gt;60</div>
              <div className={styles.item5}
                   style={{ width: Math.ceil(hIndexBarWidth[4]) }}>
                {authors.distribute['4']}
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
              <div className={styles.itemAxias}>0</div>
              <div className={styles.item1}
                   style={{ width: Math.ceil(citationBarWidth[0]) }}
              >{pubs.distribute['0']}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>1~10</div>
              <div className={styles.item2}
                   style={{ width: Math.ceil(citationBarWidth[1]) }}>{pubs.distribute['1']}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>10~100</div>
              <div className={styles.item3}
                   style={{ width: Math.ceil(citationBarWidth[2]) }}>
                { pubs.distribute['2']}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>100~200</div>
              <div className={styles.item4}
                   style={{ width: Math.ceil(citationBarWidth[3]) }}>
                {pubs.distribute['3']}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>&gt;200</div>
              <div className={styles.item5}
                   style={{ width: Math.ceil(citationBarWidth[4]) }}>
                {pubs.distribute['4']}
              </div>
            </div>
          </div>
        </div>
        { top5 && top5.length > 0 &&
        <div className={styles.item}>
          <div className={styles.title}>
            <i className="fa fa-sort-amount-desc" aria-hidden="true" />
            <span>最热交叉</span>
          </div>
          <div className={styles.content}>
            {top5.map((item, index) => {
              return (
                <div key={index} className={styles.tooltip}
                     onClick={this.onTagChange.bind(this, item)}>
                  <Tooltip placement="top" title={item}>
                    <a href="javascript:void(0)">
                      <Tag key={index} className={styles.antTag}>
                        {index + 1}. {item}
                      </Tag>
                    </a>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
        }

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
              <div className={styles.eColor} />
            </div>
            <div className={styles.legend}>
              <div className={styles.label}>学科论文：</div>
              <div className={styles.pColor} />
            </div>
            <div className={styles.legend}>
              <div className={styles.label}>正在分析：</div>
              <div className={styles.lColor} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ loading }) => ({ loading }))(CrossStatistics);

