/**
 * Created by yangyanmei on 17/6/8.
 */
import React from 'react';
import { connect } from 'dva';

class TimeFormat extends React.Component {
  offsetMinutes = (new Date()).getTimezoneOffset() + 480;

  monthToEn = (num) =>{
    const enmonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'];
    return enmonth[num];
  };

  dateToString = (time) =>{
    let date = new Date(time);
    let year = date.getFullYear() + '-';
    let mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    return year + mon + day;
  };

  dateRangeToString=(from, to) =>{
    const dateFrom = new Date(from);
    const dateTo = new Date(to);
    dateFrom.setMinutes(this.offsetMinutes);
    dateTo.setMinutes(this.offsetMinutes);
    this.monthToEn(dateFrom.getMonth());
    if (dateFrom.getFullYear() === dateTo.getFullYear() && dateFrom.getMonth() === dateTo.getMonth()) {
      if (dateFrom.getDate() === dateTo.getDate()) {
        return this.monthToEn(dateFrom.getMonth()) + ' ' + dateFrom.getDate() + ',' + dateFrom.getFullYear();
      } else {
        return this.monthToEn(dateFrom.getMonth()) + ' ' + dateFrom.getDate() + '-' + dateTo.getDate() + ', ' + dateFrom.getFullYear();
      }
    } else {
      if (dateFrom.getFullYear() === dateTo.getFullYear() && dateFrom.getMonth() !== dateTo.getMonth()) {
        return this.monthToEn(dateFrom.getMonth()) + ' ' + dateFrom.getDate() + '-' + this.monthToEn(dateTo.getMonth()) + ' ' + dateTo.getDate() + ', ' + dateFrom.getFullYear();
      } else {
        return this.dateToString(from) + ' to ' + this.dateToString(to);
      }
    }

  };

  timeRangeToString = (from, to)=> {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);
    let mfrom, mto;

    if (dateFrom.getMinutes() === 0) {
      mfrom = "00";
    } else if (dateFrom.getMinutes() < 10) {
      mfrom = "0" + dateFrom.getMinutes();
    } else {
      mfrom = dateFrom.getMinutes();
    }

    if (dateTo.getMinutes() === 0) {
      mto = "00";
    } else if (dateTo.getMinutes() < 10) {
      mto = "0" + dateTo.getMinutes();
    } else {
      mto = dateTo.getMinutes();
    }

    if ((dateFrom.getHours() === dateTo.getHours()) && (dateFrom.getMinutes() === dateTo.getMinutes())) {
      return dateFrom.getHours() + ':' + mfrom;
    } else if (dateFrom.getHours() === dateTo.getHours() && dateFrom.getMinutes() !== dateTo.getMinutes()) {
      return dateFrom.getHours() + ':' + mfrom + '-' + dateFrom.getHours() + ":" + mto;
    } else {
      return dateFrom.getHours() + ':' + mfrom + '-' + dateTo.getHours() + ':' + mto;
    }
  };

  render() {
    const from = this.props.from;
    const to = this.props.to;
    return (
      <span>{this.dateRangeToString(from, to)} &nbsp;&nbsp;{this.timeRangeToString(from, to)}</span>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(TimeFormat);
