import React from 'react';
import { connect } from 'dva';
import { Icon, Modal } from 'antd';
import { Link, routerRedux } from 'dva/router';
import { FormattedDate as FD } from 'react-intl';
import styles from './ExpertShow.less';

class ExpertShow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    queryId: '',
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.orgs === this.props.orgs) {
      return false;
    }
    return true;
  }

  getExpertList = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/expert-base-list/${id}`,
    }));
    this.setState({ queryId: id });
    this.props.dispatch({
      type: 'expertBase/getExpertDetailList',
      payload: { id, offset: 0, size: 30 },
    });
  };
  deleteExpertBase = (key) => {
    const props = this.props;
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        props.dispatch({
          type: 'expertBase/deleteExpert',
          payload: { key },
        });
      },
      onCancel() {
      },
    });
    // this.props.dispatch(routerRedux.push({ pathname: '/expert-base' }));
  };

  render() {
    const { orgs } = this.props;
    return (
      <div>
        <div className={styles.orgs}>
          <div className={styles.box}>
            {
              orgs && orgs.map((org) => {
                return (
                  <div key={org.id} className={styles.org} onClick={this.getExpertList.bind(this, org.id)}>
                    <div className={styles.titleArea}>
                      <h2 className={styles.title}>
                        <Link to={`/rcd/projects/${org.id}`}>{org.title}</Link>
                      </h2>
                      <Icon type="close" className={styles.closeModal}
                            onClick={this.deleteExpertBase.bind(this, org.id)}></Icon>
                    </div>
                    <div className={styles.desc}></div>
                    <div className={styles.info}>
                      <div className={styles.user}>
                        <Icon type="user"/>{org.creator_name}
                      </div>
                      <div className={styles.time}>
                        <FD value={org.last_updated}/>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

    );
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(ExpertShow);

