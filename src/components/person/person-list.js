/**
 *  Created by BoGao on 2017-06-15;
 */
import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { Tooltip, Tag } from 'antd';
import styles from './person-list.less';
import * as profileUtils from '../../utils/profile_utils';
import * as personService from '../../services/person';
import * as pubService from '../../services/publication';

/**
 * @param param
 *
 */
class PersonList extends React.Component {
  state = {};

  render() {
    const pubs = this.props.pubs;
    const MaxAuthorNumber = 10;

    return (

      <div className={styles.personList}>
        {
          this.props.persons.map((person) => {
            const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
            const pos = profileUtils.displayPositionFirst(person.pos);
            const aff = profileUtils.displayAff(person);
            const phone = person.contact && person.contact.phone;
            const email = profileUtils.displayEmailSrc(person);
            const homepage = person.contact && person.contact.homepage;
            const indices = person.indices;

            const tags = findTopNTags(person, 8);

            return (
              <div key={person.id} className="item">
                <div className="avatar_zone">
                  <img
                    src={profileUtils.getAvatar(person.avatar, '', 90)}
                    className="avatar"
                    alt={name}
                    title={name}
                  />
                </div>

                <div className="info_zone">

                  <div>
                    {name &&
                    <div className="title">
                      <h2>
                        <Link to={`/person/${person.id}`}>
                          {name}
                        </Link>
                        { false && <span className="rank">会士</span>}
                        <div className="spliter" />
                      </h2>
                    </div>}
                  </div>
                  <div className="zone">
                    <div className="contact_zone">
                      {indices &&
                      <div className="score-line">
                        <Tooltip placement="top" title="CCF活动贡献（C）">
                          <span className="score blue">
                            <span className="l">C</span>
                            <span className="r">{indices.num_citation}</span>
                          </span>
                        </Tooltip>
                        <Tooltip placement="top" title="学术成就（H）">
                          <span className="score gray">
                            <span className="l">H</span>
                            <span className="r">{indices.h_index}</span>
                          </span>
                        </Tooltip>
                        <Tooltip placement="top" title="学术活跃度（A）">
                          <span className="score pink">
                            <span className="l">A</span>
                            <span className="r">{indices.activity.toFixed(2)}</span>
                          </span>
                        </Tooltip>
                      </div>
                      }

                      {pos && <span><i className="fa fa-briefcase fa-fw" /> {pos}</span>}
                      {aff && <span><i className="fa fa-institution fa-fw" /> {aff}</span>}

                      {phone &&
                      <span style={{ minWidth: '158px' }}>
                        <i className="fa fa-phone fa-fw" /> {phone}
                      </span>}
                      {email &&
                      <span className="email"><i className="fa fa-envelope fa-fw" />
                        <img
                          src={`https://api.aminer.org/api/${email}`}
                          alt="email"
                          style={{ verticalAlign: 'middle' }}
                        />
                      </span>
                      }
                    </div>

                    {tags &&
                    <div className="tag_zone">
                      <div>
                        <h4><i className="fa fa-area-chart fa-fw" />研究兴趣:</h4>
                        <div className={styles.tagWrap}>
                          {
                            tags.map((tag) => {
                              return (
                                <Link to={`/search/${tag.t}/0/30`} key={Math.random()}>
                                  <Tag className={styles.tag}>{tag.t}</Tag>
                                </Link>);
                            })
                          }
                        </div>
                      </div>
                    </div>
                    }

                  </div>
                </div>

              </div>
            );
          })
        }
      </div>
    );

    // console.log("persons is ", this.props.persons);
  }
}

function findTopNTags(person, n) {
  console.log(person.tags, person.tags_zh);
  return person.tags_zh;
  //   if (person.tags_zh || )
  // /* Find top 8 tags */
  // if(person.tags_zh && person.tags_zh.length>0){
  //
  // }
}
export default PersonList;
