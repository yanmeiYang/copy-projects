/**
 * Created by lizongbao on 2017/11/7.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import SearchBar from './SearchBar.js';

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = { homepageURL: this.props.homepageURL };
  }

  handleSearch(url) {
    this.setState({ homepageURL: url });
    //alert(url);
  }
  render() {
    let below;
    if (this.state.homepageURL !== '') {
      below = <iframe className={styles.home} src={this.state.homepageURL} title="homepage" />;
    } else {
      below = <p />;
    }
    return (
      <div className={styles.page}>
        <div className={styles.title}>
          <h2 className={styles.heading}>
            <i className="fa fa-globe" />
            <span className={styles.content}>Homepage</span>
          </h2>
          <SearchBar homepageURL={this.props.homepageURL}
                     handleSearch={value => this.handleSearch(value)} className={styles.bar} />
        </div>
        {below}
      </div>
    );
  }
}
