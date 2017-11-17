/**
 * Created by lizongbao on 2017/11/7.
 */
import React, { Component } from 'react';
import styles from './ModifiedResult.less';
import { Input } from 'antd';

export default class ModifiedResut extends Component {
  constructor(props) {
    super(props);
    this.state = { modified: this.props.modified };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event, itemName) {
    const m = this.state.modified;
    m[itemName] = event.target.value;
    this.setState({ modified: m });
  }
  render() {
    return (
      <div className={styles.page}>
        <div className={styles.title}>
          <h2 className={styles.heading}>
            <i className="fa fa-gears" />
            <span className={styles.content}>Modified result</span>
          </h2>
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-user" />
            <strong className={styles.itemName}>Name: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.name}
                   onChange={event => this.handleChange(event, 'name')} />
          </div>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-briefcase" />
            <strong className={styles.itemName}>Position: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.position}
                   onChange={event => this.handleChange(event, 'position')} />
          </div>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-phone" />
            <strong className={styles.itemName}>Phone: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.phone}
                   onChange={event => this.handleChange(event, 'phone')} />
          </div>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-fax" />
            <strong className={styles.itemName}>Fax: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.fax}
                   onChange={event => this.handleChange(event, 'fax')} />
          </div>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-envelope" />
            <strong className={styles.itemName}>Email: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.email}
                   onChange={event => this.handleChange(event, 'email')} />
          </div>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-institution" />
            <strong className={styles.itemName}>Affiliation: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.affiliation}
                   onChange={event => this.handleChange(event, 'affiliation')} />
          </div>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-building" />
            <strong className={styles.itemName}>Address: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.address}
                   onChange={event => this.handleChange(event, 'address')} />
          </div>
          <div className={styles.item}>
            <i style={{ width: 20, color: '#777' }} className="fa fa-photo" />
            <strong className={styles.itemName}>Photo: &nbsp;</strong>
            <Input className={styles.itemContent} value={this.state.modified.photo}
                   onChange={event => this.handleChange(event, 'photo')} />
            <br />
            <img className={styles.pho} src={this.state.modified.photo} alt="no photo" />
          </div>
        </div>
      </div>
    );
  }
}
