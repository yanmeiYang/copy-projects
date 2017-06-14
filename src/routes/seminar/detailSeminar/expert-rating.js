/**
 * Created by yangyanmei on 17/6/9.
 */
import React from 'react';
import { connect } from 'dva';
import { Rate, InputNumber } from 'antd';

class ExpertRating extends React.Component {
  render() {
    return (
      <div style={{ marginTop: '20px' }}>
        <span style={{ fontWeight: 'bold' }}>专家评分：</span>
        <table >
          <tbody>
            <tr>
              <td>演讲内容（水平）:</td>
              <td>
                <Rate allowHalf defaultValue={4.5}/>
                <InputNumber min={1} max={100} defaultValue={95} size="3"/>
              </td>
            </tr>
            <tr>
              <td>演讲水平:</td>
              <td>
                <Rate allowHalf defaultValue={4.5}/>
                <InputNumber min={1} max={100} defaultValue={95} size="3"/>
              </td>
            </tr>
            <tr>
              <td>综合评价（其它贡献）:</td>
              <td>
                <Rate allowHalf defaultValue={3.5}/>
                <InputNumber min={1} max={100} defaultValue={75} size="3"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(ExpertRating);
