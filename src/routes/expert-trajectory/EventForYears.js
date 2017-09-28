import React from 'react';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import classnames from 'classnames';
import { Indices } from 'components/widgets';
import styles from './EventForYears.less';

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
      this.findYearEvent(this.props.year);
    }
  }

  componentDidMount() {
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.qquery !== this.props.qquery){
      document.getElementById('eve').innerHTML = ''
      return true;
    }
    if (nextProps.year !== this.props.year) {
      this.findYearEvent(nextProps.year);
      return true;
    }
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
    const year = this.props.year;
    const message = this.props.expertTrajectory.yearMessage;

    return (
      <div className={styles.first} id="eve" >
        {message && message.map((mes, index) => {
          const key = `${mes.year}_${index}`;
          return (
            <div key={key} className={styles.year}>
              <h1>{mes.year}</h1>
              {mes.events.map((oneEvent, idx) => {
                if (oneEvent.type === 'paper') {
                  return (
                    <div key={idx} className={styles.event}>
                      {oneEvent.title}<br />Author: {oneEvent.author} <br />
                      Cited by {oneEvent.cited}
                    </div>
                  );
                } else if (oneEvent.type === 'professor') {
                  return (
                    <div key={idx} className={styles.event}>
                      <div className={styles.person}>
                        <div className={styles.avatar_zone}>
                          <img src={oneEvent.url}
                               className={styles.avatar} />
                        </div>
                        <div className={styles.info_zone}>
                          <div className={styles.info_zone_detail}>
                            {oneEvent.name &&
                            <div className={styles.title}>
                              <h2>
                                {oneEvent.name}
                                {false && <span className={styles.rank}>会士</span>}
                              </h2>
                            </div>}
                            {/*{this.personRightButton && this.personRightButton(person)}*/}
                            <div className={classnames(styles.zone, styles.interestColumn)}>
                              <div className={styles.contact_zone}>
                                H_index: {oneEvent.h_index} <br />
                                {oneEvent.position && <span><i className="fa fa-briefcase fa-fw" /> {oneEvent.position}</span>}
                                {oneEvent.affiliation && <span><i className="fa fa-institution fa-fw" /> {oneEvent.affiliation}</span>}
                              </div>
                            </div>
                          </div>
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
