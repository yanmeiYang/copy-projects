import React from 'react';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import classnames from 'classnames';
import styles from './EventForYears.less';

let authors;
let table;
let locationName;
@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
export default class EventForYears extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    year: '',
  }

  componentWillMount() {
    if (this.props.year !== '') {
      authors = this.props.expertTrajectory.authors;
      table = this.props.expertTrajectory.table;
      locationName = this.props.expertTrajectory.locationName;
      this.setState({ year: this.props.year });
      // this.findYearEvent(this.props.year);
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.year !== nextProps.year) {
      this.setState({ year: nextProps.year });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.qquery !== this.props.qquery) {
      document.getElementById('eve').innerHTML = '';
      return true;
    }
    // if (nextProps.year !== this.props.year) {
    //   this.findYearEvent(nextProps.year);
    //   return true;
    // }
    if (isEqual(nextProps.expertTrajectory.yearMessage, this.props.expertTrajectory.yearMessage)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (this.props.onDone) {
      this.props.onDone();
    }
  }

  findYearEvent = (year) => {
    this.setState({ year });
    this.props.dispatch({ type: 'expertTrajectory/eventFind', payload: { yearNow: year } });
  }

  render() {
    const message = this.props.expertTrajectory.yearMessage; // 每年数据
    console.log('message', message);
    return (
      <div className={styles.first} id="eve" >
        {message && message.map((mes, index) => {
          const key = `${mes.year}_${index}`;
          console.log('events--==', mes.events);
          return (
            <div key={key} className={styles.year}>
              <h1>{mes.year}</h1>
              {
                mes.events.map((oneEvent, index1) => {
                const key1 = `${key}_${index1}`;
                if (oneEvent.type === 'paper') {
                  return (
                    <div key={key1} className={styles.event}>
                      <ul>
                        <li className={styles.list_style}>
                          <strong className={styles.ng_binding}> {oneEvent.title} </strong>
                          <ul className={styles.inner_list}>
                            <li className={styles.ng_scope}>
                              {oneEvent.author}
                            </li>
                          </ul>
                          <ul className={styles.list_inline}>
                            Cited by {oneEvent.cited}
                          </ul>
                        </li>
                      </ul>
                    </div>
                  );
                } else if (oneEvent.type === 'expert') {
                  const authorIndex = authors.indexOf(oneEvent.author);
                  // const authorIndex = authors.indexOf(oneEvent.authorID);
                  const yearIndex = this.state.year - this.props.expertTrajectory.startYear;
                  const thisYearID = table[authorIndex][yearIndex];
                  const nextYearID = table[authorIndex][yearIndex + 1];
                  const thisYear = locationName[thisYearID].toLowerCase();
                  const nextYear = locationName[nextYearID].toLowerCase();
                  if (oneEvent.url === '') {
                    oneEvent.url = 'https://am-cdn-s0.b0.upaiyun.com/default/default.jpg!50';
                  }
                  return (
                    <div key={key1} className={styles.event}>
                      <div className={styles.person}>
                        <div className={styles.image_zone}>
                          <div className={styles.avatar_zone}>
                            <img src={oneEvent.url} className={styles.avatar} alt="" />
                          </div>
                          <div className={styles.name_list}>
                            {oneEvent.name &&
                            <div className={styles.title}>
                              <ul className={styles.name}>
                                {oneEvent.name}
                                {false && <span className={styles.rank}>会士</span>}
                              </ul>
                            </div>}
                            <div className={styles.contact_zone}>
                              <strong>H_index: {oneEvent.h_index}</strong>
                            </div>
                          </div>
                        </div>
                        <div className={styles.yearToGo}>
                          <h4 className={styles.h4} > {this.state.year}: </h4>
                          <span> {thisYear} </span>
                          <br /> <h4 className={styles.h4}> {this.state.year + 1}:</h4> <span> {nextYear} </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
