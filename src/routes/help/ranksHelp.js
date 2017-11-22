/**
 * Created by yangyanmei on 17/8/14.
 */
import React from 'react';
import { Menu } from 'antd';
import { Layout } from 'routes';
import { theme, applyTheme } from 'themes';
import styles from './ranksHelp.less';

const tc = applyTheme(styles);
class RanksHelp extends React.Component {
  state = {
    current: 'citation',
  };
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Layout searchZone={[]} contentClass={tc(['ranksHelp'])} showNavigator={false}>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          style={{ marginTop: '-24px' }}
        >
          <Menu.Item key="citation">
            <a href="#citation">#citation</a>
          </Menu.Item>
          <Menu.Item key="publication">
            <a href="#publication">#publication</a>
          </Menu.Item>
          <Menu.Item key="h-index">
            <a href="#h-index">h-index</a>
          </Menu.Item>
          <Menu.Item key="impact-factor">
            <a href="#impact-factor">Impact Factor</a>
          </Menu.Item>
          <Menu.Item key="activity">
            <a href="#activity">Activity</a>
          </Menu.Item>
          <Menu.Item key="diversity">
            <a href="#diversity">Diversity</a>
          </Menu.Item>
          <Menu.Item key="uptrend">
            <a href="#uptrend">Uptrend</a>
          </Menu.Item>
          <Menu.Item key="new-star">
            <a href="#new-star">New star</a>
          </Menu.Item>
          <Menu.Item key="search-rank">
            <a href="#search-rank">专家搜索排序</a>
          </Menu.Item>
          <Menu.Item key="topic-trend">
            <a href="#topic-trend">技术趋势预测</a>
          </Menu.Item>
        </Menu>
        <div style={{ marginTop: '30px', maxWidth: '1128px' }} className="content-inner">
          <h2 className={styles.ranksTitle}><a name="citation">#citation</a></h2>
          <div className={styles.ranksContent}>
            <p>专家对所有出版物的引用次数。</p>
          </div>
          <h2 className={styles.ranksTitle}><a href="publication">#publication</a></h2>
          <div className={styles.ranksContent}>
            <p>专家的所有出版物的数量。</p>
          </div>
          <h2 className={styles.ranksTitle}><a name="h-index">h-index</a></h2>
          <div className={styles.ranksContent}>
            <p>一名科学家的h指数是指其发表的所有论文中有h篇每篇至少被引h次、其余论文每篇被引均小于或等于h次。</p>
          </div>
          <h2 className={styles.ranksTitle}><a name="impact-factor">Impact Factor</a></h2>
          <div className={styles.ranksContent}>
            <p> Impact Factor反映了论文在期刊中的重要性（参照http://en.wikipedia.org/wiki/Impact_factor）。
              为了更好的评估一篇论文，在AMiner中我们进一步考虑了论文的长度。具体来说，如果论文的篇幅 &lt; 3，那么
              我们认为这篇论文在期刊中的impact factor为1/5；如果 3 &lt;=论文的篇幅 &lt; 5，那么我们认为这篇论文
              在期刊中的impact factor为1/3。定义公式如下：</p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image002.gif" alt="impact factor"
                   style={{ height: '62px' }} />
            </p>
            <p> G是一组论文。IC（P）是指论文发表会议的影响。如果篇幅长度&lt; 3，权重（P）等于1/5，如果3&lt;=篇幅长度&lt;5，权重（P）等于1/3。
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="activity">Activity</a></h2>
          <div className={styles.ranksContent}>
            <p>
              学者的activity是根据过去几年发表的论文定义的。我们考虑了每篇论文的重要性，从而将活动定义为：
            </p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image003.gif" alt="activity" style={{ height: '62px' }} />
            </p>
            <p>
              在公式中，n代表最近n年，G是作者A在第n年发表的一组论文。Weight(n)=a-n。N和a的定义如下：如果当前月份是上半年（1-6月），
              我们设N=4，a=0.75。如果当前月份是下半年（7-12月），则设N=3，a=0.85。
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="diversity">Diversity</a></h2>
          <div className={styles.ranksContent}>
            <p>
              G一般来说，专家的研究可以包括几个不同的领域。我们将Diversity定义为定量反应程度。我们通过作者参加会议主题为模型来获取每位
              专家的研究领域。然后我们将他的论文分配给每个主题。我们根据分配结果计算主题分布。给予专家A研究主题分布&nbsp;
              <img style={{ height: '21px', width: '35px', verticalAlign: 'middle' }} alt=""
                   src="/helpImg/ranks/image004.gif" />
              &nbsp;定义为：
            </p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image005.gif" alt="diversity"
                   style={{ width: '257px', height: '42px' }} />
            </p>
            <p>
              作者diversity被定义为这种分布的熵：
            </p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image006.gif" alt=""
                   style={{ height: '62px', width: '314px' }} />
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="uptrend">Uptrend</a></h2>
          <div className={styles.ranksContent}>
            <p>没有什么比rising star更吸引人了。我们用uptrend来定义研究者的理论程度。作者每篇论文的信息，包括公布的日期和会议的影响因子。
              我们使用最小二乘法来拟合最近N年发表论文的曲线。然后我们用曲线来预测下一年的得分，这个比例被定义为uptrend的得分公式：</p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image008.gif" alt="activity" />
              <br />
              <br />
              <img src="/helpImg/ranks/image009.gif" alt="activity"
                   style={{ width: '509px', height: '21px' }} />
            </p>
            <p>在定义中，&nbsp;
              <img src="/helpImg/ranks/image010.gif" alt=""
                   style={{ width: '153px', height: '21px' }} />
              &nbsp;. N = 3. 计算上半年分值时包含今年&nbsp;
              <img src="/helpImg/ranks/image011.gif" alt=""
                   style={{ width: '172px', height: '42px' }} />
              &nbsp;，而下半年时不包括今年。
            </p>
          </div>
          <h2 className={styles.ranksTitle}>
            <a name="new-star">New star</a></h2>
          <div className={styles.ranksContent}>
            <p>第一篇论文发表年份之今年 &lt;=5的，我们称之为New star，得分基于&nbsp;
              <a href="#activity">activity</a>。
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="search-rank">专家搜索排序</a></h2>
          <div className={styles.ranksContent}>
            <p>目前排序基于作者在该领域相关论文citation的加权和
              <br /><br />
              例如data mining,<br />
              先搜索data mining相关论文，将论文按照重要度（citation）分级，如0~10, 10~100, 100~300, ...
              为每类分级赋予权重W，如citation为0~10的论文权重为1，10~100权重为2，100~300权重为4
              将作者在data mining领域相关论文按照相似度(tfidf)和重要度权重进行加权
              Score(person) = \sum_&#x7b;pub of person&#x7d; TFIDF(pub) * W(pub)
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="topic-trend">技术趋势预测</a></h2>
          <div className={styles.ranksContent}>
            <p>近期热度，全局热度和技术源头分别是按近五年，全部，和前一半年份的热度对相关领域排序；选出前12个换成sorted stream graph
              <br /><br />
              例如machine learning里近期热度是neural network最高，全局热度里svm还算比较高，而技术源头可以看出machine
              learning主要由ai，pattern recognition, inductive inference等技术发展而来
              <br /><br />
              趋势图中节点按每年的热度（支流宽度）排序，热度越高顺序越靠上。
              <br /><br />
              关键人物根据以下条件选出：
              <br />
              1、该领域的第一篇炉温；
              <br />
              2、该领域按照时间正规化后citation排序的前K篇论文，Citation按时间normalize的方法是 normalized_citation =
              citation - 100 * log_2(current_year - pub_year + 1)
            </p>
          </div>
        </div>
      </Layout>
    );
  }
}

export default RanksHelp;
