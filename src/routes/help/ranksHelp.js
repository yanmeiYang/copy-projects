/**
 * Created by yangyanmei on 17/8/14.
 */
import React from 'react';
import { Menu } from 'antd';
import styles from './ranksHelp.less';

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
      <div>
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
          <Menu.Item key="longevity">
            <a href="#longevity">Longevity</a>
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
          <Menu.Item key="sociability">
            <a href="#sociability">Sociability</a>
          </Menu.Item>
          <Menu.Item key="uptrend">
            <a href="#uptrend">Uptrend</a>
          </Menu.Item>
          <Menu.Item key="new-star">
            <a href="#new-star">New star</a>
          </Menu.Item>
        </Menu>
        <div style={{ marginTop: '30px', maxWidth: '1128px' }} className="content-inner">
          <h2 className={styles.ranksTitle}><a name="citation">#citation</a></h2>
          <div className={styles.ranksContent}>
            <p>The number of citations of all publications by an expert.</p>
          </div>
          <h2 className={styles.ranksTitle}><a href="publication">#publication</a></h2>
          <div className={styles.ranksContent}>
            <p>The number of all publications by an expert.</p>
          </div>
          <h2 className={styles.ranksTitle}><a name="h-index">h-index</a></h2>
          <div className={styles.ranksContent}>
            <p>An expert has index h if h of his or her N papers have at least h citations
              each, and the other (N − h) papers have at most h citations each.</p>
          </div>
          <h2 className={styles.ranksTitle}><a name="longevity">Longevity</a></h2>
          <div className={styles.ranksContent}>
            <p>Longevity reflects the length of one author’s academic life. We consider the
              year when one author published his/her first paper as the beginning year of his/her
              academic life and the last paper as the end year. Then longevity can be defined
              as:</p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image001.gif" alt="longevity" style={{ height: '21px' }} />
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="impact-factor">Impact Factor</a></h2>
          <div className={styles.ranksContent}>
            <p> Basically, the score reflects the importance of a publication venue and is
              calculated by http://en.wikipedia.org/wiki/Impact_factor. In Arnetminer, for
              evaluating a paper published at a venue, we further consider the paper length.
              Specifically, if the paper length &lt; 3 pages, then we take 1/5 of impact factor of
              the publication venue; if the 3&lt;= length &lt;5 pages, we take 1/3 of the factor
              of
              the publication venue. Formally, the new score can be defined as follow:</p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image002.gif" alt="impact factor"
                   style={{ height: '62px' }} />
            </p>
            <p> In the definition, G is a group of papers. IC (P) means the impact of conference
              in
              which the paper published. Weight(P) equals to 1/5 if the paper length&lt;3, while
              weight(P) equals to 1/3 if the 3&lt;= length &lt;5.
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="activity">Activity</a></h2>
          <div className={styles.ranksContent}>
            <p>
              People's activityis simply defined based on one's papers published in the last
              years.
              We consider the importance of each paper and thus define the activity score as:
            </p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image003.gif" alt="activity" style={{ height: '62px' }} />
            </p>
            <p>
              In the definition, in the year n (n belong to recent N years), G is a group of
              papers
              published by author A in the year n. Weight(n) = α this year – n. We tentatively set
              the values for N and α. Specifically, we set N = 4 and α = 0.75, if the
              current month is in the first half year (month &lt; July); and set N = 3 and α =
              0.85
              if the current month is in the second half year.
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="diversity">Diversity</a></h2>
          <div className={styles.ranksContent}>
            <p>
              Generally, an expert's research may include several different research fields.
              Diversity is defined to quantitatively reflect the degree. In particular, we first
              use
              the author-conference-topic model author-conference-topic model (Tang, et al.
              2008) to obtain the research fields for each expert. Then we automatically assign
              his
              papers to each topic. We calculate the topic distribution based on the assignment
              results. Given expert A, the research topic distribution&nbsp;
              <img style={{ height: '21px', width: '35px', verticalAlign: 'middle' }} alt=""
                   src="/helpImg/ranks/image004.gif" />
              &nbsp;is defined as
            </p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image005.gif" alt="diversity"
                   style={{ width: '257px', height: '42px' }} />
            </p>
            <p>
              The author diversity is then defined as the entropy of this distribution:
            </p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image006.gif" alt=""
                   style={{ height: '62px', width: '314px' }} />
            </p>
          </div>
          <h2 className={styles.ranksTitle}><a name="sociability">Sociability</a></h2>
          <div className={styles.ranksContent}>
            <p>The score of sociability is basically defined based on how many coauthors an expert
              has. We define the score as :</p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image007.gif" alt="activity" style={{ height: '62px' }} />
            </p>
            <p>where #copapercdenotes the number of papers coauthored between the expert and the
              coauthor c.In the next step, we will further consider the location, organization,
              nationality information, and research fields.</p>
          </div>
          <h2 className={styles.ranksTitle}><a name="uptrend">Uptrend</a></h2>
          <div className={styles.ranksContent}>
            <p>Nothing can catch people's eyes more than a rising star. We useuptrend to define
              therising degreeof a researcher. The information of each author’s paper including
              the
              published date and conference's impact factor. We use Least Squares Method to fit a
              curve from published papers in recent N years. Then we use the curve to predict
              one's
              score in the next year, which is defined as the score of Uptrend, formally</p>
            <p className={styles.ranksContentImg}>
              <img src="/helpImg/ranks/image008.gif" alt="activity" />
              <br />
              <br />
              <img src="/helpImg/ranks/image009.gif" alt="activity"
                   style={{ width: '509px', height: '21' }} />
            </p>
            <p>In this definition,&nbsp;
              <img src="/helpImg/ranks/image010.gif" alt=""
                   style={{ width: '153px', height: '21px' }} />
              &nbsp;. N = 3. This year is not included if we calculate the value in the first half
              year, while this year is included and&nbsp;
              <img src="/helpImg/ranks/image011.gif" alt=""
                   style={{ width: '172px', height: '42px' }} />
              &nbsp;if we calculate the value in the second half year.
            </p>
            <p>For&nbsp;
              <a href="http://arnetminer.org/topicBrowser.do">all the 200 topics</a>
              , we will calculate an author’s uptrend in each topic.
            </p>
          </div>
          <h2 className={styles.ranksTitle}>
            <a name="new-star">New star</a></h2>
          <div className={styles.ranksContent}>
            <p>New star has a short academic longevity (&lt;=5 years). The score is based on
              <a href="#b309">activity</a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default RanksHelp;
