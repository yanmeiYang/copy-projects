import React from 'react';
import { connect } from 'dva';
import { Icon, Modal } from 'antd';
import { Link, routerRedux } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
// import { FormattedDate as FD } from 'react-intl';
import styles from './ExpertList.less';

class ExpertList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.orgs === this.props.orgs) {
      return false;
    }
    return true;
  }

  showExpertDetailInfo = (org) => {
    const id = org.id;
    this.setState({ profile: org });
    this.props.dispatch(routerRedux.push({ pathname: `/profile-info/${id}` }));
  };

  render() {
    const orgs = this.props.orgs;
    return (
      <div>
        <div className={styles.orgs}>
          <div className={styles.box}>
            {
              orgs && orgs.map((org) => {
                return (
                  <a href="https://aminer.org/">
                  <div key={org.id} className={styles.org} >
                    {/*<div key={org.id} className={styles.org} onClick={this.showExpertDetailInfo.bind(this,org)}>*/}
                    <div className={styles.titleArea}>
                      <h2 className={styles.title}>
                        {org.avatar ? <img width="94%" height="150"
                                           src={org.avatar} alt="0" className={styles.img} />
                          : <img width="94%" height="150"
                                src="/images/blank_avatar.jpg" alt="no avatar" className={styles.img} /> }
                      </h2>
                      {/*<Icon type="close" className={styles.closeModal}></Icon>*/}
                    </div>
                    <div className={styles.user}>
                      {org.name}{
                      org.name_zh ? <span>({org.name_zh})</span> : ''
                    }
                    </div>
                    <div className={styles.info}>
                      <div className={styles.desc}> {org.aff.desc}</div>
                    </div>
                  </div>
                  </a>
                );
              })
            }
          </div>
        </div>
      </div>

    );
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(ExpertList);

