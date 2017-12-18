import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { system } from 'core';
import { RequireGod } from 'hoc';
import { getAllSystemConfigs } from 'systems';
import styles from './SystemInfo.less';

// TODO @xiaobei 在第一行添加一个按钮，Clear Saved System, 意思是清空已经保存的system. 使用配置文件中的system.
@connect(({ app }) => ({ app: { user: app.user, roles: app.roles } }))
@RequireGod
export default class SystemInfo extends PureComponent {
  onChangeSystem = (sys) => {
    const { user } = this.props.app;
    system.saveSystem(sys, user);
    window.location.reload();
  };

  render() {
    const allSystemConfigs = getAllSystemConfigs();

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

    const data = allSystemConfigs.map((conf) => {
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

