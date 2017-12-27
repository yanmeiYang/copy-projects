/**
 * Created by yangyanmei on 17/11/10.
 */
import React from 'react';
import { Link } from 'dva/router';
import { Table, Tag } from 'antd';
import { sysconfig } from 'systems';
import styles from './IndexCenterZone.less';

const { Column } = Table;

export default class IndexCenterZone extends React.PureComponent {
  render() {
    const { urlFunc, links } = this.props;
    return (
      <div className={styles.index_centerZone}>
        <Table bordered size="small" pagination={false}
               dataSource={links}>
          <Column
            dataIndex="" key="display_name"
            className={styles.aDirectory}
            render={(data) => {
              let query = '';
              if (sysconfig.Locale === 'zh') {
                query = data.name_zh || data.name;
              } else {
                query = data.name || data.name_zh;
              }
              return <Link to={urlFunc && urlFunc(query)}>{query}</Link>;
            }}
          />
          <Column
            dataIndex="child" key="position"
            className={styles.secondaryDirectory}
            render={(child) => {
              return child.map((item) => {
                let query = '';
                if (sysconfig.Locale === 'zh') {
                  query = item.name_zh || item.name;
                } else {
                  query = item.name || item.name_zh;
                }
                return (
                  <Link to={urlFunc && urlFunc(query)}
                        key={`${item.name}#${item.name_zh}`}>
                    <Tag>{query}</Tag>
                  </Link>
                );
              });
            }} />
        </Table>
      </div>
    );
  }
}
