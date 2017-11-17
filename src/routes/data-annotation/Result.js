/**
 * Created by lizongbao on 2017/11/7.
 */
import { Button, Icon, Select, Input } from 'antd';
import React, { Component } from 'react';

import styles from './Result.less';

const Option = Select.Option;
const { TextArea } = Input;
export default class AutoResult extends Component {
  constructor(props) {
    super(props);
    this.state = { raw: this.props.raw,
      modified: this.props.modified,
      origin: this.props.origin,
      positions: [], affiliations: [], addresses: [],
      isChanged: this.props.isChanged };
    for (let i = 0; i < this.state.raw.position.length; i += 1) {
      this.state.positions.push(<div className={styles.itemDiv}>
        <div className={styles.itemContentDiv}>
          <span className={styles.itemContent}>
            {this.state.raw.position[i]}
          </span>
        </div>
        <div className={styles.itemContentDiv}>
          <Button className={styles.btn} icon="plus" shape="circle" size="small" onClick={() => this.props.onClickMul('position', i)} />
        </div>
                                </div>);
    }
    for (let i = 0; i < this.state.raw.affiliation.length; i += 1) {
      this.state.affiliations.push(<div className={styles.itemDiv}>
        <div className={styles.itemContentDiv}>
          <span className={styles.itemContent}
                  >
            {this.state.raw.affiliation[i]}
          </span>
        </div>
        <div className={styles.itemContentDiv}>
          <Button className={styles.btn} shape="circle" size="small" onClick={() => this.props.onClickMul('affiliation', i)}>
            <Icon type="plus" />
          </Button>
        </div>
                                   </div>);
    }
    for (let i = 0; i < this.state.raw.address.length; i += 1) {
      this.state.addresses.push(<div className={styles.itemDiv}>
        <div className={styles.itemContentDiv}>
          <span className={styles.itemContent}>
            {this.state.raw.address[i]}
          </span>
        </div>
        <div className={styles.itemContentDiv}>
          <Button className={styles.btn} shape="circle" size="small" onClick={() => this.props.onClickMul('address', i)}>
            <Icon type="plus" />
          </Button>
        </div>
      </div>);
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleMouseOver(event) {
    event.target.style.background = '#ddd';
  }
  handleMouseLeave(event) {
    event.target.style.background = '#fff';
  }
  handleChange(event, itemName) {
    const m = this.state.modified;
    m[itemName] = event.target.value;
    this.setState({ modified: m });
    const n = this.state.isChanged;
    n[itemName] = <Button className={styles.rollback} icon="rollback" shape="circle" size="small" onClick={() => this.props.rollBack(itemName)} />;
    this.setState({ isChanged: n });
  }
  componentWillUpdate(nextProps) {
    if (nextProps.profile === this.props.profile) {
      return false;
    }
    const { profile, modified, origin } = nextProps;
    modified.name = profile.name;
    let str = '';
    for (let i = 0; i < profile.pos.length; i++) {
      if (i !== 0) { str += ';'; }
      str += profile.pos[i].n;
    }
    modified.position = str;
    modified.phone = profile.contact.phone;
    modified.fax = profile.contact.fax;
    modified.affiliation = profile.contact.affiliation;
    modified.address = profile.contact.address;
    modified.photo = profile.avatar;

    origin.name = modified.name;
    origin.position = modified.position;
    origin.phone = modified.phone;
    origin.fax = modified.fax;
    origin.affiliation = modified.affiliation;
    origin.address = modified.address;
    origin.photo = modified.photo;
    return true;
  }
  render() {
    return (
      <div className={styles.frame}>
        <div className={styles.page}>
          <div className={styles.title}>
            <h2 className={styles.heading}>
              <i className="fa fa-android" />
              <span className={styles.content}>Automatic result</span>
            </h2>
            <h2 className={styles.heading} style={{ marginLeft: 130 }}>
              <i className="fa fa-gears" />
              <span className={styles.content}>Modified result</span>
            </h2>
          </div>
          <div className={styles.content}>
            <div className={styles.item}>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-user" />
                  <strong className={styles.itemName}>Name: &nbsp;</strong><br />
                </div>
                <div className={styles.itemDiv}>
                  <div className={styles.itemContentDiv}>
                    <span className={styles.itemContent}>
                      {this.state.raw.name}
                    </span>
                  </div>
                  <div className={styles.itemContentDiv}>
                    <Button className={styles.btn} shape="circle" size="small" onClick={() => this.props.onClick('name')}>
                      <Icon type="right" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-user" />
                  <strong className={styles.itemName}>Name: &nbsp;</strong>
                  {this.state.isChanged.name}
                </div>
                <Input className={styles.itemContent} value={this.state.modified.name}
                       onChange={event => this.handleChange(event, 'name')} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.part}>
                <i style={{ width: 20, color: '#777' }} className="fa fa-briefcase" />
                <strong className={styles.itemName}>Position: &nbsp;</strong>
                {this.state.positions}
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-briefcase" />
                  <strong className={styles.itemName}>Position: &nbsp;</strong>
                  {this.state.isChanged.position}
                </div>
                <TextArea className={styles.itemContent} rows={3}
                          value={this.state.modified.position}
                       onChange={event => this.handleChange(event, 'position')} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.part}>
                <i style={{ width: 20, color: '#777' }} className="fa fa-phone" />
                <strong className={styles.itemName}>Phone: &nbsp;</strong><br />
                <div className={styles.itemDiv}>
                  <div className={styles.itemContentDiv}>
                    <span className={styles.itemContent}>
                      {this.state.raw.phone}
                    </span>
                  </div>
                  <div className={styles.itemContentDiv}>
                    <Button className={styles.btn} shape="circle" size="small" onClick={() => this.props.onClick('phone')}>
                      <Icon type="right" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-phone" />
                  <strong className={styles.itemName}>Phone: &nbsp;</strong>
                  {this.state.isChanged.phone}
                </div>
                <Input className={styles.itemContent} value={this.state.modified.phone}
                       onChange={event => this.handleChange(event, 'phone')} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.part}>
                <i style={{ width: 20, color: '#777' }} className="fa fa-fax" />
                <strong className={styles.itemName}>Fax: &nbsp;</strong><br />
                <div className={styles.itemDiv}>
                  <div className={styles.itemContentDiv}>
                    <span className={styles.itemContent}>
                      {this.state.raw.fax}
                    </span>
                  </div>
                  <div className={styles.itemContentDiv}>
                    <Button className={styles.btn} shape="circle" size="small" onClick={() => this.props.onClick('fax')}>
                      <Icon type="right" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-fax" />
                  <strong className={styles.itemName}>Fax: &nbsp;</strong>
                  {this.state.isChanged.fax}
                </div>
                <Input className={styles.itemContent} value={this.state.modified.fax}
                       onChange={event => this.handleChange(event, 'fax')} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.part}>
                <i style={{ width: 20, color: '#777' }} className="fa fa-envelope" />
                <strong className={styles.itemName}>Email: &nbsp;</strong><br />
                <div className={styles.itemDiv}>
                  <div className={styles.itemContentDiv}>
                    <span className={styles.itemContent}>
                      {this.state.raw.email}
                    </span>
                  </div>
                  <div className={styles.itemContentDiv}>
                    <Button className={styles.btn} shape="circle" size="small" onClick={() => this.props.onClick('email')}>
                      <Icon type="right" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-envelope" />
                  <strong className={styles.itemName}>Email: &nbsp;</strong>
                  {this.state.isChanged.email}
                </div>
                <Input className={styles.itemContent} value={this.state.modified.email}
                       onChange={event => this.handleChange(event, 'email')} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.part}>
                <i style={{ width: 20, color: '#777' }} className="fa fa-institution" />
                <strong className={styles.itemName}>Affiliation: &nbsp;</strong>
                {this.state.affiliations}
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-institution" />
                  <strong className={styles.itemName}>Affiliation: &nbsp;</strong>
                  {this.state.isChanged.affiliation}
                </div>
                <TextArea className={styles.itemContent} rows={4}
                       value={this.state.modified.affiliation}
                       onChange={event => this.handleChange(event, 'affiliation')} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.part}>
                <i style={{ width: 20, color: '#777' }} className="fa fa-building" />
                <strong className={styles.itemName}>Address: &nbsp;</strong>
                {this.state.addresses}
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-building" />
                  <strong className={styles.itemName}>Address: &nbsp;</strong>
                  {this.state.isChanged.address}
                </div>
                <TextArea className={styles.itemContent} rows={4}
                          value={this.state.modified.address}
                         onChange={event => this.handleChange(event, 'address')} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.part}>
                <i style={{ width: 20, color: '#777' }} className="fa fa-photo" />
                <strong className={styles.itemName}>Photo: &nbsp;</strong>
                <div className={styles.itemDiv}>
                  <div className={styles.itemContentDiv}>
                    <span className={styles.itemContent}>
                      {this.state.raw.photo}
                    </span>
                  </div>
                  <div className={styles.itemContentDiv}>
                    <Button className={styles.btn} shape="circle" size="small" onClick={() => this.props.onClick('photo')}>
                      <Icon type="right" />
                    </Button>
                  </div>
                </div>
                <br />
                <img className={styles.pho} src={this.state.raw.photo} alt="" />
              </div>
              <div className={styles.part}>
                <div style={{ lineHeight: 2 }}>
                  <i style={{ width: 20, color: '#777' }} className="fa fa-photo" />
                  <strong className={styles.itemName}>Photo: &nbsp;</strong>
                  {this.state.isChanged.photo}
                </div>
                <TextArea className={styles.itemContent} rows={3}
                          value={this.state.modified.photo}
                       onChange={event => this.handleChange(event, 'photo')} />
                <br />
                <img className={styles.pho} src={this.state.modified.photo} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
