/**
 *  Created by BoGao on 2017-07-17;
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Tag } from 'antd';
import styles from './RightInfoZonePerson.less';
import { sysconfig } from '../../systems';
import { Indices } from '../../components/widgets';
import * as profileUtils from '../../utils/profile_utils';


class RightInfoZonePerson extends React.PureComponent {

  componentDidMount() {
  }

  render() {
    const person = this.props.person;
    if (!person) {
      return <div />;
    }

    // used in person popup info
    const url = profileUtils.getAvatar(person.avatar, person.id, 50);
    const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
    const pos = profileUtils.displayPositionFirst(person.pos);
    const aff = profileUtils.displayAff(person);

    // used in person right info zone.
    const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
    if (sysconfig.PersonList_PersonLink_NewTab) {
      personLinkParams.target = '_blank';
    }
    const tags = profileUtils.findTopNTags(person, 8);

    return (
      <div className="rizPersonInfo">
        {name &&
        <div className="name bg">
          <h2 className="section_header">
            <a {...personLinkParams}>{person.name} </a><br />
            <a {...personLinkParams} className="zh">{person.name_zh} </a>
          </h2>
        </div>
        }

        <div className="img"><img src={url} alt="IMG" /></div>

        <div className="info bg">
          {pos && <span><i className="fa fa-briefcase fa-fw" />{pos}</span>}
          {aff && <span><i className="fa fa-institution fa-fw" />{aff}</span>}
        </div>

        <div className="info indicesInfo bg">
          <Indices
            indices={person.indices}
            activity_indices={person.activity_indices}
            showIndices={sysconfig.PersonList_ShowIndices}
          />
        </div>

        <div className="info bg">
          <h4><i className="fa fa-area-chart fa-fw" />研究兴趣:</h4>
          <div className={styles.tagWrap}>
            {
              tags.map((tag) => {
                return (
                  <Link to={`/${sysconfig.SearchPagePrefix}/${tag.t}/0/30`}
                        key={Math.random()}>
                    <Tag className="tag">{tag.t}</Tag>
                  </Link>
                );
              })
            }
          </div>
        </div>

      </div>
    );
  }
}

export default connect()(RightInfoZonePerson);