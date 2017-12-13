/**
 * Created by yangyanmei on 17/12/13.
 */
import React from 'react';
import { InputNumber, Rate, Button, Row, Col, Table, Modal } from 'antd';
import { Link } from 'dva/router';
import { Layout } from 'routes';

export default class ExpertRatingModalContent extends React.Component {
  state = {
    score: [0, 0, 0],
  };

  componentWillMount() {
    this.setState({ score: this.props.score });
  }

  onChange = (index, value) => {
    if (typeof value === 'number') {
      const score = this.state.score;
      score[index] = value;
      this.setState({
        score,
      });
    }
  };

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td><span style={{ marginRight: 5 }}>演讲水平:</span></td>
            <td>
              <Rate value={this.state.score[0]}
                    onChange={this.onChange.bind(this, 0)} />
              <InputNumber
                min={0} max={5} step={1} value={this.state.score[0]}
                onChange={this.onChange.bind(this, 0)} />
            </td>
          </tr>
          <tr>
            <td><span style={{ marginRight: 5 }}>演讲内容:</span></td>
            <td>
              <Rate value={this.state.score[1]}
                    onChange={this.onChange.bind(this, 1)} />
              <InputNumber
                min={0} max={5} step={1} value={this.state.score[1]}
                onChange={this.onChange.bind(this, 1)} />
            </td>
          </tr>
          <tr>
            <td><span style={{ marginRight: 5 }}>综合评价:</span></td>
            <td>
              <Rate value={this.state.score[2]}
                    onChange={this.onChange.bind(this, 2)} />
              <InputNumber
                min={0} max={5} step={1} value={this.state.score[2]}
                onChange={this.onChange.bind(this, 2)} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
