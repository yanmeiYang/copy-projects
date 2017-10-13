/**
 * Created by yutao on 2017/9/3.
 */
import React from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import clusteringData from '../../../../external-docs/clustering_weiwang_50.json';
// import colors from '../../../../external-docs/colors.json';

import * as toolsService from '../../../services/tools';

const colors = [
  '#9e0142',
  '#d53e4f',
  '#f46d43',
  '#fdae61',
  '#fee08b',
  '#ffffbf',
  '#e6f598',
  '#abdda4',
  '#66c2a5',
  '#3288bd',
  '#5e4fa2',
];

@connect(({ tools }) => ({ tools }))
export default class DataCleaningClustering extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getOption = this.getOption.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseOver = this.onMouseOut.bind(this);
  }
  state = {
    nodes: clusteringData.results.map((node) => {
      return [node[2][0], node[2][1], node[1], node[0]];
    }),
    selectedCluster: null,
    hoverCluster: null,
    selectedPubs: [],
  };

  getOption() {
    const nodes = clusteringData.results.map((node) => {
      return [node[2][0], node[2][1], node[1], node[0]];
    });
    const clusterSizes = {};
    nodes.forEach((data) => {
      if (data[2] in clusterSizes) {
        clusterSizes[data[2]] += 1;
      } else {
        clusterSizes[data[2]] = 1;
      }
    });

    const option = {
      tooltip: {
        position: 'top',
        showDelay: 0,
        formatter: (params) => {
          return `Cluster ${params.value[2]}:<br/> size: ${clusterSizes[params.value[2]]}`;
        },
      },
      xAxis: {
        show: false,
        type: 'value',
        max: 'dataMax',
        min: 'dataMin',
      },
      yAxis: {
        show: false,
        type: 'value',
        max: 'dataMax',
        min: 'dataMin',
      },
      series: [{
        name: 'cluster',
        type: 'scatter',
        data: nodes,
        z: (param) => {
          if (nodes[param.dataIndex][2] === this.state.selectedCluster) {
            return 2;
          } else if (nodes[param.dataIndex][2] === this.state.hoverCluster) {
            return 3;
          } else {
            return 1;
          }
        },
        itemStyle: {
          normal: {
            color: (param) => {
              if (nodes[param.dataIndex][2] === this.state.selectedCluster) {
                return 'black';
              } else if (nodes[param.dataIndex][2] === this.state.hoverCluster) {
                return 'grey';
              } else {
                return colors[nodes[param.dataIndex][2]];
              }
            },
            opacity: 0.7,
            borderColor: 'white',
            borderWidth: 0.5,
            // borderColor: (param) => {
            //   if (nodes[param.dataIndex][2] === this.state.selectedCluster) {
            //     return 'silver';
            //   } else if (nodes[param.dataIndex][2] === this.state.hoverCluster) {
            //     return 'grey';
            //   } else {
            //     return colors[nodes[param.dataIndex][2]];
            //   }
            // },
          },
        },
      }],
    };
    return option;
  }

  onClick(params, echart) {
    const selectedPubs =
    this.setState({
      selectedCluster: params.data[2],
    });
  }

  onMouseOver(params, echart) {
    this.setState({
      hoverCluster: params.data[2],
    });
  }

  onMouseOut(params, echart) {
    this.setState({
      hoverCluster: null,
    });
  }


  render() {
    const onEvents = {
      click: this.onClick,
      mouseover: this.onMouseOver,
      mouseout: this.onMouseOut,
    };
    // const clusteringData = toolsService.getClustering();
    let cnt = 0;
    return (
      <div className="content-inner">
        <ReactEcharts
          echarts={echarts}
          option={this.getOption()}
          style={{ height: '800px', width: '100%' }}
          onEvents={onEvents}
        />
        <div>
          {
            this.state.nodes.map((node) => {
              if (node[2] === this.state.selectedCluster) {
                cnt += 1;
                return <div><h2><span>{cnt}. </span>{node[3]}</h2></div>;
              } else {
                return '';
              }
            })
          }
        </div>
      </div>
    );
  }
}
