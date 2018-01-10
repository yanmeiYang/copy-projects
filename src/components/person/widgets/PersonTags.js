/**
 *  Created by BoGao on 2017-10-25;
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import { Link } from 'engine';
import * as personService from 'services/person';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import styles from './PersonTags.less';

export default class PersonTags extends PureComponent {
  constructor(props) {
    super(props);
    // TODO 临时措施，国际化Interest应该从server端入手。
    personService.getInterestsI18N((result) => {
      this.interestsI18n = result;
    });
    this.persons = this.props.persons;
  }

  static propTypes = {
    // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string, // NOTE: 一般来说每个稍微复杂点的Component都应该有一个className.
    tags: PropTypes.array,
    tagsTranslated: PropTypes.array,
    tagsLinkFuncs: PropTypes.func,
    hideBorder: PropTypes.bool,
  };

  render() {
    const { tags, tagsTranslated, tagsLinkFuncs, hideBorder } = this.props;
    if (!tags || tags.length === 0) {
      return null;
    }
    return (
      <div className={classnames(styles.personTags, { [styles.hideBorder]: hideBorder })}>
        <h4><i className="fa fa-area-chart fa-fw" /> 研究兴趣:</h4>
        <div className={styles.tagWrap}>
          {tags.slice(0, 8).map((item, idx) => {
            if (item === null || item === 'Null') {
              return false;
            }
            const key = `${item}_${idx}`;
            let tooltipTag = '';
            if (sysconfig.Locale === 'zh') { // need translate.
              if (tagsTranslated && tagsTranslated.length > idx) {
                tooltipTag = tagsTranslated[idx];
              } else {
                const translatedTag = personService.returnKeyByLanguage(this.interestsI18n, item);
                tooltipTag = translatedTag.zh || item;
              }
            }

            return (
              <Tooltip key={key} placement="top" title={tooltipTag}>
                <Tag className={styles.tag}>
                  {tagsLinkFuncs ?
                    <a href="" onClick={tagsLinkFuncs.bind(this, { query: item })}>{item}</a>
                    :
                    <Link
                      to={`/${sysconfig.SearchPagePrefix}/${item}/0/${sysconfig.MainListSize}`}>
                      {item}
                    </Link>
                  }
                </Tag>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }
}

