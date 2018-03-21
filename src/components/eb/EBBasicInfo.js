import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'engine';
import { AddEBMenuItem, DeleteMenuItem, MoveEBMenuItem } from './menuitem';
import HierarchyTree from "components/hierarchy/HierarchyTree";
import { imCompare } from 'utils/compare';
import { sysconfig } from "systems";
import { Maps } from "utils/immutablejs-helpers";
import styles from './EBBasicInfo.less';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';

// @connect(({ app, expertbaseTree }) => ({ app, expertbaseTree }))
export default class EBBasicInfo extends Component {

  static propTypes = {
    eb: PropTypes.object,
  };

  static defaultProps = {};

  render() {
    // eb && console.log('eb is ', eb.toJS());
    const { eb } = this.props;
    const [name, name_zh, desc, desc_zh, created_time] =
      Maps.getAll(eb, "name", "name_zh", "desc", "desc_zh", "created_time");

    return (
      <div className={styles.ebBasicInfo}>
        {!eb && <div>Loading...</div>}
        {eb && <>
          {sysconfig.Locale === 'zh' &&
          <h1>
            {name_zh || name}
            {name_zh && name && name_zh !== name &&
            <span className={styles.subTitle}>（{name}）</span>
            }
          </h1>
          }
          {sysconfig.Locale !== 'zh' &&
          <h1>
            {name || name_zh}
            {name && name_zh && name !== name_zh &&
            <span className={styles.subTitle}>（{name_zh}）</span>
            }
          </h1>
          }
          <div className={styles.infoLine}>
            <span>创建时间：
              {created_time && <FD value={created_time} />}
            </span>
            {eb.get("creator") && <span>创建者：{eb.get("creator")}</span>}
          </div>
          <div className={styles.desc}>{desc}</div>
          <div className={styles.desc}>{desc_zh}</div>
        </>
        }
      </div>
    )
  }
}
