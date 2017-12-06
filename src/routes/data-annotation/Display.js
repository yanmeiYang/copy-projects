/**
 * Created by lizongbao on 2017/11/7.
 */
import React, { Component } from 'react';
import { Button } from 'antd';

import AutoResult from './Result';
import Homepage from './Homepage';
import styles from './Display.less';


export default class Display extends Component {
  constructor(props) {
    super(props);
    this.state = { modified: this.props.modified,
      raw: this.props.raw,
      origin: this.props.origin,
      isChanged: this.props.isChanged };
  }
  onClick(itemName) {
    const m = this.state.modified;
    m[itemName] = this.state.raw[itemName];
    this.setState({ modified: m });
    const n = this.state.isChanged;
    n[itemName] = <Button className={styles.rollback} icon="rollback" shape="circle" size="small" onClick={() => this.rollBack(itemName)} />;
    this.setState({ isChanged: n });
  }
  onClickMul(itemName, i) {
    const m = this.state.modified;
    if (m[itemName] !== '') {
      m[itemName] += ';';
    }
    m[itemName] += this.state.raw[itemName][i];
    this.setState({ modified: m });
    const n = this.state.isChanged;
    n[itemName] = <Button className={styles.rollback} icon="rollback" shape="circle" size="small" onClick={() => this.rollBack(itemName)} />;
    this.setState({ isChanged: n });
  }
  rollBack(itemName) {
    const m = this.state.modified;
    m[itemName] = this.state.origin[itemName];
    this.setState({ modified: m });
    const n = this.state.isChanged;
    n[itemName] = <p />
    this.setState({ isChanged: n });
  }
  render() {
    return (
      <div className={styles.display} >
        <Homepage homepageURL={this.props.homepageURL} />
        <div className={styles.result}>
          <div className={styles.title}>
            <h2 className={styles.heading}>
              <i className="fa fa-archive" />
              <span className={styles.content}>Profile</span>
            </h2>
          </div>
          <AutoResult raw={this.state.raw}
                        onClick={itemName => this.onClick(itemName)}
                        onClickMul={(itemName, i) => this.onClickMul(itemName, i)}
                        onChange={(itemName, rawName) => this.onChange(itemName, rawName)}
                        rollBack={itemName => this.rollBack(itemName)}
                        modified={this.state.modified}
                        origin={this.state.origin}
                        isChanged={this.state.isChanged}
                        profile={this.props.profile} />
          <Button type="primary" className={styles.btn} onClick={() => this.props.saveProfile()} >
            Save profile
          </Button>
        </div>
      </div>
    );
  }
}
