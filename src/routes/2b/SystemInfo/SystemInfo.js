import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { RequireGod } from 'hoc';
import { getDefaultSystemConfigs, CurrentSystemConfig } from 'systems';
import { system } from 'utils';
import styles from './SystemInfo.less';

// TODO @xiaobei 在第一行添加一个按钮，Clear Saved System, 意思是清空已经保存的system. 使用配置文件中的system.
@connect(({ app }) => ({ app }))
@RequireGod
export default class SystemInfo extends PureComponent {
  onChangeSystem = (sys) => {
    const { user } = this.props.app;
    console.log('on change sys', sys);
    system.saveSystem(sys, user);
    window.location.reload();
  };

  render() {
    const sysconfigs = system.AvailableSystems.map((sys) => {
      const conf = getDefaultSystemConfigs(sys, sys);
      const currentSystem = CurrentSystemConfig[sys];
      Object.keys(currentSystem).map((key) => {
        conf[key] = currentSystem[key];
        return null;
      });
      return conf;
    });

    const columns = [
      {
        title: 'logo',
        dataIndex: 'logo',
        key: 'logo',
        render: src => (
          <img src={`/sys/${src}/favicon.ico`}
               className={styles.logo}
          />
        ),
      },
      {
        title: 'systems',
        dataIndex: 'systems',
        key: 'systems',
        render: sys => (
          <Button onClick={this.onChangeSystem.bind(this, sys)}>{sys}</Button>
        ),
      },
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'language',
        dataIndex: 'language',
        key: 'language',
      },
      {
        title: 'showRegister',
        dataIndex: 'showRegister',
        key: 'showRegister',
        render: value => value ? '是' : '否',
      },
      {
        title: 'link',
        dataIndex: 'link',
        key: 'link',
      },
    ];

    const data = sysconfigs.map((conf) => {
      return {
        key: conf.SYSTEM,
        logo: conf.SYSTEM,
        systems: conf.SYSTEM,
        name: conf.PageTitle,
        language: conf.Locale,
        showRegister: conf.ShowRegisteredRole,
      };
    });

    return (
      <div className={styles.SystemInfo}>
        <Table columns={columns} dataSource={data} size="small" pagination={false} />
      </div>
    );
  }
}

