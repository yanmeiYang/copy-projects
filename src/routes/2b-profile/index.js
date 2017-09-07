/**
 * Created by yangyanmei on 17/8/21.
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Modal, Button, Input } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const Search = Input.Search;
const { Column } = Table;

class TobProfile extends React.Component {
  state = {
    flag: '',
  };

  onDeleteItem = (record) => {
    const key = record.id;
    const props = this.props;
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        props.dispatch({
          type: 'tobProfile/deleteProfileById',
          payload: { key },
          // payload: { src: '', key },
        });
      },
      onCancel() {
      },
    });
  };
  addProfile = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/addition' }));
  };
  editProfile = (record) => {
    this.props.dispatch(routerRedux.push({ pathname: '/addition', query: { id: record.id } }));
  };
  handleOk = () => {
    this.props.dispatch({
      type: 'tobProfile/deleteItemById',
      payload: {},
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };
  searchByName = (values) => {
    if (values) {
      this.props.dispatch({
        type: 'tobProfile/search',
        payload: { name: values },
        // payload: { src: '', name: values },
      });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/tobprofile',
      }));
    }
  };

  render() {
    const { results } = this.props.tobProfile;
    const localeText = { emptyText: '数据正在加载' };
    const values = '';
    return (
      <div>
        <Button icon="plus" className={styles.buttonArea} onClick={this.addProfile}>Add</Button>
        <Search placeholder="input name" className={styles.searchArea} onSearch={this.searchByName.bind(values)}/>
        <Table dataSource={results.data} locale={localeText} className={styles.tableArea}>
          <Column title="Name"
                  dataIndex="name"
                  key="name"
          />
          <Column width="10%"
                  title="Name_zh"
                  dataIndex="name_zh"
                  key="name_zh"
          />
          <Column
            title="SID"
            dataIndex="sid"
            key="sid"
          />
          <Column
            title="Email"
            dataIndex="email"
            key="email"
          />
          <Column title="Affiliation"
                  dataIndex="aff"
                  key="aff"
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
             <span/>
          <a onClick={this.onDeleteItem.bind(this, record)}>Delete</a>
          <span className="ant-divider"/>
               <a onClick={this.editProfile.bind(this, record)}>Edit</a>
        </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default connect(({ tobProfile }) => ({ tobProfile }))(TobProfile);

