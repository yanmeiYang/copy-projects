
const showPersonStatistic = (echarts, divId, data, type) => {
  console.log(data);
  if (typeof (data.staData) === 'undefined') {
    document.getElementById(type).innerHTML = 'No Data!';
  } else {
    let option;
    if (type === 'timeDistribution') {
      option = timeDistributionSta();
    } else {
      option = migrateHistorySta();
    }
    const myChart = echarts.init(document.getElementById(type));
    console.log(option);
    console.log(myChart);
    myChart.setOption(option);
  }
};

const timeDistributionSta = () => {
  const option = {
    tooltip: {
      trigger: 'item',
      //formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    series: [
      {
        name:'访问来源',
        type:'pie',
        selectedMode: 'single',
        radius: [0, '30%'],

        label: {
          normal: {
            position: 'inner'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:[
          {value:335, name:'直达', selected:true},
          {value:679, name:'营销广告'},
          {value:1548, name:'搜索引擎'}
        ]
      },
      {
        name:'访问来源',
        type:'pie',
        radius: ['40%', '55%'],
        label: {
          normal: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            // shadowBlur:3,
            // shadowOffsetX: 2,
            // shadowOffsetY: 2,
            // shadowColor: '#999',
            // padding: [0, 7],
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center'
              },
              // abg: {
              //     backgroundColor: '#333',
              //     width: '100%',
              //     align: 'right',
              //     height: 22,
              //     borderRadius: [4, 4, 0, 0]
              // },
              hr: {
                borderColor: '#aaa',
                width: '100%',
                borderWidth: 0.5,
                height: 0
              },
              b: {
                fontSize: 16,
                lineHeight: 33
              },
              per: {
                color: '#eee',
                backgroundColor: '#334455',
                padding: [2, 4],
                borderRadius: 2
              }
            }
          }
        },
        data:[
          {value:335, name:'直达'},
          {value:310, name:'邮件营销'},
          {value:234, name:'联盟广告'},
          {value:135, name:'视频广告'},
          {value:1048, name:'百度'},
          {value:251, name:'谷歌'},
          {value:147, name:'必应'},
          {value:102, name:'其他'}
        ]
      }
    ]
  };
  return option;
};

const migrateHistorySta = () => {
  const option = {
    title: {
      text: '深圳月最低生活费组成（单位:元）',
      subtext: 'From ExcelHome',
      sublink: 'http://e.weibo.com/1341556070/AjQH99che'
    },
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params) {
        var tar = params[1];
        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type : 'category',
      splitLine: {show:false},
      data : ['总费用','房租','水电费','交通费','伙食费','日用品数']
    },
    yAxis: {
      type : 'value'
    },
    series: [
      {
        name: '辅助',
        type: 'bar',
        stack:  '总量',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        data: [0, 1700, 1400, 1200, 300, 0]
      },
      {
        name: '生活费',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data:[2900, 1200, 300, 200, 900, 300]
      }
    ]
  };
  return option;
};

module.exports = {
  showPersonStatistic,
};
