/**
 *  Created by NanGu on 2017-10-17;
 *  aminer在使用这个页面
 */
import React from 'react';
import { Link } from 'dva/router';
import { Icon, Tabs, Spin, Button } from 'antd';
import * as personService from 'services/person';
import AminerPublications from 'routes/person/aminer-publications';
import styles from './Tabzone.less';
import Information from './PersonInfo';
import Education from './PersonEducation';
import Experience from './PersonExperience';
import Skills from './PersonSkills'
import Bio from './PersonBio';
import AcmCitations from './ACM_Citations';

const { TabPane } = Tabs;

const panes = [
  { title: 'Overview', key: '0' },
  { title: 'Papers', key: '1' },
  { title: 'Lectures', key: '2' },
  { title: 'Claim Achievement', key: '3' },
  { title: 'Merge', key: '4' },
  { title: 'Upload', key: '5' },
];

class TabZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  callback = (key) => {
    console.log(key);
    this.setState({ selected: key });
  };


  render() {
    const { selected } = this.state;
    const { profile, publications, skillsUp, skillsDown, skillsModal } = this.props;
    const totalPubs = profile.indices && profile.indices.num_pubs;
    const TabContent = [{
      key: '1',
      content: <div className={styles.content_zone}>
        <div className={styles.left_region}>
          <div><Information profile={profile} /></div>
          <div style={{ marginTop: 20 }} />
          <div><AcmCitations profile={profile} /></div>
          <div style={{ marginTop: 20 }} />
          <div><Education profile={profile} /></div>
          <div style={{ marginTop: 20 }} />
          <div><Experience /></div>
        </div>
        <div className={styles.right_region}>
          <div><Skills profile={profile} /></div>
          <div style={{ marginTop: 20 }} />
          <div><Bio profile={profile} /></div>
        </div>
      </div>
    },
      {
        key: '2',
        content: <AminerPublications personId={profile.id} totalPubs={totalPubs} />,
      },
      {
        key: '3',
        content: <div><p>hi</p></div>,
      },
      {
        key: '4',
        content: <div><p>hi</p></div>,
      },
      {
        key: '5',
        content: <div><p>hi</p></div>,
      },
      {
        key: '6',
        content: <div><p>hi</p></div>,
      },
    ];
    return (
      <div className={styles.tab_zone}>
        <div>
          <Tabs tabPosition="left"
                defaultActiveKey="0"
                onChange={this.callback}>
            {panes.map((item) => {
              return <TabPane tab={item.title} key={item.key} />;
            })}
          </Tabs>
        </div>
        <div className={styles.content_zone}>
          <div>{TabContent[selected].content}</div>
        </div>
      </div>
    );
  }
}

export default TabZone;
