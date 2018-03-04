/**
 * Created by ranyanchuan on 2017/11/2.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Tag, Tooltip } from 'antd';
import styles from './index.less';

class CrossStatistics extends React.Component {
  barWidth = (hindexData) => {
    const indexList = [hindexData['0'] || 0, hindexData['1'] || 0, hindexData['2'] || 0, hindexData['3'] || 0, hindexData['4'] || 0];
    const maxIndex = Math.max.apply(null, indexList);
    const tmp = 130 / maxIndex;
    const widthList = [tmp * hindexData['0'] || 0, tmp * hindexData['1'] || 0, tmp * hindexData['2'] || 0, tmp * hindexData['3'] || 0, tmp * hindexData['4'] || 0];
    return widthList;
  }

  onTagChange = (item, result) => {
    const title = item.split('&');
    if (result.authors !== '#') {
      const crossingFields = [{ _1: title[1].trim(), _2: title[0].trim() }];
      this.props.getModalContent('history', crossingFields);
    }
  }

  render() {
    const { cross } = this.props;
    console.log(cross);
    const { detail, top,result } = cross;

    let hIndexBarWidth = [0, 0, 0, 0, 0];
    let citationBarWidth = [0, 0, 0, 0, 0];
    if (detail) {
      const { authors, pubs } = detail;
      hIndexBarWidth = this.barWidth(authors.distribute);
      citationBarWidth = this.barWidth(pubs.distribute);
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
              <span className={styles.num}>{result.authors || '#'}</span>
              <span>人</span>
            </div>
            <div>
              <span>论文：</span>
              <span className={styles.num}>{result.pubs}</span>
              <span>篇</span>
            </div>
            <div>
              <span>华人：</span>
              <span className={styles.num}>{result.ChinaAuthors}</span>
              <span>人</span>
            </div>
            <div>
              <span>H-index均值：</span>
              <span className={styles.num}>{result.aHIndex}</span>
            </div>
            <div>
              <span>Citation均值：</span>
              <span className={styles.num}>{result.aCitation}</span>
            </div>
          </div>
          <div className={styles.noData}></div>
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
                {result.autDis0}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>10~20</div>
              <div className={styles.item2}
                   style={{ width: Math.ceil(hIndexBarWidth[1]) }}>
                {result.autDis1}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>20~40</div>
              <div className={styles.item3}
                   style={{ width: Math.ceil(hIndexBarWidth[2]) }}>
                { result.autDis2}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>40~60</div>
              <div className={styles.item4}
                   style={{ width: Math.ceil(hIndexBarWidth[3]) }}>
                {result.autDis3}
              </div>
            </div>
            <div className={styles.hBar}>
              <div className={styles.itemAxias}>&gt;60</div>
              <div className={styles.item5}
                   style={{ width: Math.ceil(hIndexBarWidth[4]) }}>
                {result.autDis4}
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
              >{result.pubDis0}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>1~10</div>
              <div className={styles.item2}
                   style={{ width: Math.ceil(citationBarWidth[1]) }}>{result.pubDis1}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>10~100</div>
              <div className={styles.item3}
                   style={{ width: Math.ceil(citationBarWidth[2]) }}>
                { result.pubDis2}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>100~200</div>
              <div className={styles.item4}
                   style={{ width: Math.ceil(citationBarWidth[3]) }}>
                {result.pubDis3}
              </div>
            </div>
            <div className={styles.cBar}>
              <div className={styles.itemAxias}>&gt;200</div>
              <div className={styles.item5}
                   style={{ width: Math.ceil(citationBarWidth[4]) }}>
                {result.pubDis4}
              </div>
            </div>
          </div>
        </div>
        { top && top.length > 0 &&
        <div className={styles.item}>
          <div className={styles.title}>
            <i className="fa fa-sort-amount-desc" aria-hidden="true" />
            <span>最热交叉</span>
          </div>
          <div className={styles.content}>
            {top.slice(0, 5).map((item, index) => {
              return (
                <div key={index.toString()} className={styles.tooltip}
                     onClick={this.onTagChange.bind(this, item, result)}>
                  <Tooltip placement="top" title={item}>
                    <a href="javascript:void(0)">
                      <Tag key={index.toString()} className={styles.antTag}>
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

