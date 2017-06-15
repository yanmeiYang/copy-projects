/**
 * Created by yangyanmei on 17/6/9.
 */
import React from 'react';
import { connect } from 'dva';
import { Rate, InputNumber } from 'antd';

class ExpertRating extends React.Component {
  state = {
    content: 0,
    level: 0,
    integrated: 0,
  };
  onChange = (type, value) => {
    if (value === '') {
      value = 0;
    }
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    this.setState({ [type]: value });
  };

  render() {
    const { content, level, integrated } = this.state;
    return (
      <div style={{ marginTop: '20px' }}>
        <span style={{ fontWeight: 'bold' }}>专家评分：</span>
        <table >
          <tbody>
          <tr>
            <td>演讲内容（水平）:</td>
            <td>
              <Rate value={content} onChange={this.onChange.bind(this, 'content')}/>
              <InputNumber min={0} max={5} step={1} value={content} defaultValue={content}
                           onChange={this.onChange.bind(this, 'content')}/>
            </td>
          </tr>
          <tr>
            <td>演讲水平:</td>
            <td>
              <Rate value={level} onChange={this.onChange.bind(this, 'level')}/>
              <InputNumber min={0} max={5} step={1} value={level}
                           onChange={this.onChange.bind(this, 'level')}/>
            </td>
          </tr>
          <tr>
            <td>综合评价（其它贡献）:</td>
            <td>
              <Rate value={integrated} onChange={this.onChange.bind(this, 'integrated')}/>
              <InputNumber min={0} max={5} step={1} value={integrated}
                           onChange={this.onChange.bind(this, 'integrated')}/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(ExpertRating);