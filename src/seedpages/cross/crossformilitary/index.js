/**
 * Created by ranyanchuan on 2017/10/18.
 */
import React from 'react';
import { routerRedux, Link, connect } from 'engine';
import { Button, Tag } from 'antd';
import { Auth } from 'hoc';
import { sysconfig } from 'systems';
import { Layout } from 'components/layout';
import { applyTheme } from 'themes';
import styles from './index.less';

const tc = applyTheme(styles);
const keymap = [
  { id: '5a65ac939ed5db8fa44d40b3', name: 'geospatial intelligence & Saddam Hussein' },
  { id: '5a65ac3a9ed5db8fa44d3bed', name: 'world war & military deception' },
  { id: '5a65aa289ed5db8fa44d29da', name: 'national security & electronic warfare' },
  { id: '5a65a9cb9ed5db8fa44d2744', name: 'command and control & counter insurgency' },
  { id: '5a65a6799ed5db8fa44d1508', name: 'North Korea & al qaeda' },
  { id: '5a65a6279ed5db8fa44d1303', name: 'chemical weapon & weapon of mass destruction' },
  { id: '5a67052a9ed5db8fa452456c', name: 'organized crime & al qaeda' },
  { id: '5a6704fc9ed5db8fa4524551', name: 'conflict resolution & geospatial intelligence' },
  { id: '5a6704da9ed5db8fa452452a', name: 'Arab Spring & counter insurgency' },
  { id: '5a6704a89ed5db8fa4524506', name: 'al qaeda & electronic warfare' },
  { id: '5a6704939ed5db8fa45244f7', name: 'chemical weapon & north korea' },
  { id: '5a6704679ed5db8fa45244b8', name: 'military deception & unmanned aerial vehicle' },
  { id: '5a6704219ed5db8fa4524497', name: 'war on terror & computer simulation' },
];

@connect(({ app, loading, crossHeat }) => ({
  app,
  loading,
  crossHeat,
}))
@Auth
export default class CrossForMilitary extends React.Component {
  goCreate = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
    }));
  };
  goProject = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/taskList',
    }));
  };

  render() {
    return (
      <Layout searchZone={[]} contentClass={tc(['crossIndex'])}
              showNavigator={sysconfig.Cross_HasNavigator}>
        <div className={styles.crossformilitary}>
          <div className={styles.group}>
            <Button onClick={this.goCreate}>挖掘热点</Button>
            <Button onClick={this.goProject}>我的项目</Button>
          </div>
          <div className={styles.keywordBox}>
            {keymap && keymap.map((keyword) => {
              return (
                <Link to={`/cross/heat/${keyword.id}`} key={keyword.id}>
                  <Tag key={keyword.id}
                       className={styles.tags}>{keyword.name}
                  </Tag>
                </Link>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }
}

