/**
 *  Created by BoGao on 2017-08-23;
 */
import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import styles from './RecommendationPage.less';
import { Auth } from '../../hoc';

@connect(({ app }) => ({ app }))
@Auth
export default class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
  };

  // componentWillMount() {
  //   const query = (this.props.location && this.props.location.query
  //     && this.props.location.query.query) || 'data mining';
  //   const { type } = this.props.location.query;
  //   if (query) {
  //     // this.props.dispatch({ type: 'app/setQuery', query });
  //     this.setState({ query });
  //   }
  //   if (type) {
  //     this.setState({ mapType: type || 'baidu' });
  //   }
  //   this.dispatch({
  //     type: 'app/layout',
  //     payload: {
  //       headerSearchBox: { query, onSearch: this.onSearch },
  //       showFooter: false,
  //     },
  //   });
  // }
  //
  // componentWillUnmount() {
  //   this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  // }
  //
  // onSearch = (data) => {
  //   if (data.query) {
  //     this.setState({ query: data.query });
  //     this.props.dispatch(routerRedux.push({
  //       pathname: '/expert-map',
  //       query: { query: data.query },
  //     }));
  //     this.props.dispatch({
  //       type: 'app/setQueryInHeaderIfExist',
  //       payload: { query: data.query },
  //     });
  //   }
  // };

  render() {
    return (
      <div className={styles.content}>
        <FormattedMessage
          id="app.greeting"
          defaultMessage="Hello, {name}!"
          values={{
            name: 'Eric',
          }}
        />
      </div>
    );
  }
}
