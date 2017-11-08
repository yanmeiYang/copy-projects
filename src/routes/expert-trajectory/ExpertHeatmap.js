import React from 'react';
import { connect } from 'dva';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import { request, queryURL } from 'utils';
import loadScript from 'load-script';
import styles from './ExpertHeatmap.less';

class ExpertHeatmap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {

  };

  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {
    const ifPlay = this.state.ifPlay;
    const display = this.state.displayURL;
    console.log('display', this.state.displayURL);
    return (
      <div>
        <div className={styles.picture} id="pic">
          {display && display.map((oneExpert, index) => {
            const key = index;
            return (
              <div className={styles.onePic} key={key} id={oneExpert.authorIndex}
                   style={{ left: oneExpert.pixel[0] - 20, top: oneExpert.pixel[1] - 46 }}>
                <img src={oneExpert.url} className={styles.url} alt="" />
              </div>
            );
          })
          }
        </div>
        <div className={styles.button}>
          <Button className={styles.dark} type="primary" ghost onClick={this.onThemeChangeDark}>dark</Button>
          <Button className={styles.light} type="primary" ghost onClick={this.onThemeChangeLight}>light</Button>
          <Button className={styles.plus} type="primary" ghost icon="plus"
                  onClick={this.plusHeatZoom} />
          <Button className={styles.minus} type="primary" ghost icon="minus"
                  onClick={this.minusHeatZoom} />
        </div>
        <div role="presentation" className={styles.heat} id="heatmap"
             style={{ height: '670px', width: '1150px' }} onClick={this.onMapClick} />
        <div className={styles.two}
             style={{ color: '#f5f3f0', fontSize: '20px', fontWeight: '50' }} id="showYear">
          <h1>2222</h1>
        </div>

        <div className={styles.dinner}>
          <Button className={styles.play} icon={ifPlay} onClick={this.onClick} />
          <Row className={styles.slide}>
            <Col span={22}>
              <Slider min={this.state.startYear} max={this.state.endYear} onChange={this.onChange}
                      onAfterChange={this.onAfterChange} value={this.state.inputValue} />
            </Col>
            <Col span={1}>
              <InputNumber
                min={this.state.startYear}
                max={this.state.endYear}
                style={{ marginLeft: 0 }}
                value={this.state.inputValue}
                onChange={this.onInputNum}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmap);
