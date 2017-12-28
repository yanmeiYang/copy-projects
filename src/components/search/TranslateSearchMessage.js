import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tag, Tabs } from 'antd';
import classnames from 'classnames';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { compare } from 'utils/compare';
import { hole } from 'core';
import styles from './TranslateSearchMessage.less';

@connect()
export default class TranslateSearchMessage extends PureComponent {

  static propTypes = {
    query: PropTypes.string,
    useTranslateSearch: PropTypes.bool,
    translatedLanguage: PropTypes.number,
    translatedText: PropTypes.string,
    doTranslateSearch: PropTypes.func,
  };

  onOrderChange = (e) => {
    if (this.props.onOrderChange) {
      this.props.onOrderChange(e);
      console.log('=====', e);
    }
  };

  doTranslateSearch = (useTranslate) => {
    const { doTranslateSearch } = this.props;
    if (doTranslateSearch) {
      doTranslateSearch(useTranslate);
      console.log('====', useTranslate);
    }
  };

  render() {
    const { query, useTranslateSearch, translatedLanguage, translatedText } = this.props;

    return (
      <div className={styles.translateSearchMessage}>
        <div className={styles.debug} style={{ display: 'none' }}>
          [useTranslateSearch : {useTranslateSearch ? 'true' : 'false'},
          translatedLanguage : {translatedLanguage},
          translatedText : {translatedText},]
        </div>

        {useTranslateSearch && translatedText &&
        <div className={styles.line}>
          <div className={styles.transIcon} />
          <FM defaultMessage="We also search '{enQuery}' for you."
              id="search.translateSearchMessage.1"
              values={{ enQuery: translatedText }}
          />&nbsp;
          <a onClick={this.doTranslateSearch.bind(this, false)}>
            <FM defaultMessage="Search '{cnQuery}' only."
                id="search.translateSearchMessage.2"
                values={{ cnQuery: query }} />
          </a>
        </div>
        }

        {!useTranslateSearch && translatedText &&
        <div className={styles.line}>
          <div className={styles.transIcon} />
          <a onClick={this.doTranslateSearch.bind(this, true)}>
            <FM defaultMessage="You can also search with both '{enQuery}' and '{cnQuery}'."
                id="search.translateSearchMessage.reverse"
                values={{ enQuery: translatedText, cnQuery: query }}
            />
          </a>
        </div>
        }
      </div>
    );
  }
}

