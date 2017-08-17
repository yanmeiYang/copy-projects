/**
 */
import React from 'react';
import { Tabs, Icon, Slider } from 'antd';
import { connect } from 'dva';
import d3 from 'd3';
import d3sankey from './utils/sankey';
import trend from '../../../external-docs/trend-prediction/trend_out1.json';
import styles from './trend-prediction.less';

let ball_radius, bar_pos, chart, color, format, formatNumber, height, hist_height,margin, render_topic, root, timeline, timeline_item_offset, width;
let area, path, sankey, svg, y;
let energy=trend;
let axis, basis, draw_flow, draw_right_box, flow, force, item, link, max_freq, max_sum, node, people, terms, time_slides_dict, time_slides_offset, time_window, x;
let query;
const TabPane = Tabs.TabPane;
const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};
/**
 * Component
 * @param id
 */
class TrendPrediction extends React.PureComponent {
  componentDidMount() {
    d3sankey();
    this.showtrend();
  }

  showtrend = () => {
    root = void 0;
    margin = {
      top: 1,
      right: 1,
      bottom: 6,
      left: 1
    };
    width = 1300;//需调整参数，容器宽度
    height = 1300 - margin.top - margin.bottom;//需调整参数，容器高度
    //console.log(height);
    formatNumber = d3.format(",.0f");
    format = function (d) {//格式化为整数，点出现的次数
      return formatNumber(d) + " Times";
    };
    color = d3.scale.category10();//d3图的配色样式
    chart = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    timeline;
    bar_pos = 150;//直方图左边文字的宽度
    timeline_item_offset = 20;//左侧直方图的间隔距离
    ball_radius = 6;
    hist_height = 100;//左侧直方图的高度
    //d3.select("head").append("script").attr("type", "text/javascript").attr("src", "../routes/trend-prediction/utils/sankey.js");//添加sankey.js
    d3.select(window).on('resize', function () {//窗口改变的时候重新加载
      return render_topic("big data", 1, 1000);
    });
    d3.select('#trend').on('click', function () {//trend被点击的时候重新加载
      return render_topic("big data", 1, 1000);
    });
//显示整个界面的方法，sankey为技术发展图
    this.render_topic("big data", 1, 1000);
  }

  render_topic = function (q, start, end) {
    query=q;
    var area, path, sankey, svg, y;
    sankey = d3.sankey().nodeWidth(0).nodePadding(0).size([width, 330]);//上方趋势图的宽度
    path = sankey.link();
    //console.log(path);
    area = d3.svg.area().x(function (d) {
      return d.x;
    }).y0(function (d) {
      return d.y0;
    }).y1(function (d) {
      return d.y1;
    });
    y = d3.scale.linear().range([height, 0]);
    //界面中的技术发展图（右上方）和趋势图（右下方）
    chart.remove();
    chart = d3.select("#chart").append("svg").attr("overflow", "scroll").attr("id", "dark").attr("width", width).attr("height", height + margin.top + margin.bottom).attr("transform", "translate(" + 70 + "," + 25 + ")");
    chart.append("linearGradient").attr("id", "xiangyu");
    timeline = d3.select("#right-box").append("svg").attr("overflow", "scroll");
    svg = chart.append("g").attr("height", 350).attr("id", "trend");
    svg.on("mousewheel", function () {
      console.log("mousewheel");
    });
    svg.append("line").attr("id", "nvMouse").attr("class", "hidden").style("stroke", "red").style("stroke-width", 5);
    chart.append("line").attr("x1", 0).attr("x2", width).attr("y1", 360).attr("y2", 360).attr("id", "cutline").style("stroke", "darkgray").style("stroke-width", 1);//上下图之间的线的设置
    //$("#chart").addClass("loading");
    //$("#chart").removeClass("loading");
    terms = {};
    max_sum = 0;
    // current hotsopt中按各技术2010年之后的文献总数排序
    energy.terms.forEach(function (t) {
      t.sum = 0;
      t.year.forEach(function (tt) {
        if ((tt.y > 2010) && (tt.d > 0)) {
          t.sum += tt.d;
        }
      });
      if (t.sum > max_sum) {
        max_sum = t.sum;
      }
      terms[t.t] = t;
    });
    people = {};
    energy.people.forEach(function (t) {
      people[t.id] = t;
    });
    timeline.attr("height", function (d) {
      return 25 * energy.terms.length;
    });
    timeline.append("line").attr("x1", bar_pos + 10).attr("x2", bar_pos + 10).attr("y1", 0).attr("y2", function () {
      return 25 * energy.terms.length;
    }).style("stroke", "gray").style("stroke-width", .5);
    max_freq = 0;
    energy.terms.forEach(function (d) {
      if (d.freq > max_freq) {
        max_freq = d.freq;
      }
    });
    //导航布局，first-three即页面中current hotspot按钮
    d3.select("#nav").style("display", "");
    d3.select(".active").classed("active", false);
    d3.select("#first-three").classed("active", "true");
    //左侧的统计框
    draw_right_box = function () {//右侧的
      var hist;
      energy.terms.sort(function (a, b) {
        return b.sum - a.sum;
      });
      hist = timeline.append("g").selectAll(".term").data(energy.terms).enter().append("g").attr("class", "term").attr("transform", function (d, i) {
        return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";//左侧图离标签页的距离，字和直方图的旋转
      }).attr("id", function (d) {
        return "term-" + d.idx;
      }).on("click", function (d) {
        draw_flow(d);
      });
      //页面左侧统计模块的直方图
      hist.append("rect").attr("x", function (d) {//直方图离线的距离
        return bar_pos + 10;
      }).attr("y", function (d) {//直方图离上方的高度
        return 0;
      }).attr("height", 18).attr("width", function (d) {//直方图的宽度为18
        return hist_height * d.sum / max_sum;//高度为计算得出
      }).style("fill-opacity", 0.7).style("fill", "#60aFe9").append("svg:title").text(function (d) {
        return d.sum;
      });
      hist.append("text").attr("text-anchor", "end").attr("transform", function (d) {
        return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
      }).style("font-size", 12).attr("dy", ".85em").text(function (d) {//左侧图字体大小
        return d.t;
      });
    };
    draw_right_box();
    //first-three即页面中current hotspot按钮，点击后按照2010之后关于该技术的文献总数排序并显示直方图，
    // revert即页面中overall按钮，点击后按照freq对技术排序并显示直方图
    d3.select("#first-three").on("click", function (e) {
      console.log("@@@@###");
      d3.select(".active").classed("active", false);
      d3.select(this.parentNode).classed("active", true);
      d3.selectAll(".term").remove();
      energy.terms.sort(function (a, b) {
        return b.freq - a.freq;
      });
      draw_right_box();
      draw_flow(terms[q]);
    });
    d3.select("#revert").on("click", function (e) {
      console.log("!!!!!###");
      var hist;
      d3.select(".active").classed("active", false);
      d3.select(this.parentNode).classed("active", "true");
      d3.selectAll(".term").remove();
      energy.terms.sort(function (a, b) {
        return b.freq - a.freq;
      });
      hist = timeline.append("g").selectAll(".term").data(energy.terms).enter().append("g").attr("class", "term").attr("id", function (d) {
        return "term-" + d.idx;
      }).attr("transform", function (d, i) {
        return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";
      }).on("click", function (d) {
        draw_flow(d);
      });
      //页面左侧统计模块的直方图
      hist.append("rect").attr("x", function (d) {
        return bar_pos + 10;
      }).attr("y", function (d) {
        return 0;
      }).attr("height", 18).attr("width", function (d) {
        return hist_height * d.freq / max_freq;
      }).style("fill-opacity", 0.7).style("fill", "#60aFe9").append("svg:title").text(function (d) {
        return d.sum;
      });
      hist.append("text").attr("text-anchor", "end").attr("transform", function (d) {
        return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
      }).style("font-size", 12).attr("dy", ".85em").text(function (d) {
        return d.t;
      });
      draw_flow(terms[q]);
    });
    time_slides_dict = {};
    time_slides_offset = {};
    energy.time_slides.forEach(function (time, i) {
      time.sort();
      time.forEach(function (year, j) {
        time_slides_dict[year] = i;
        time_slides_offset[year] = j;
      });
    });
    //console.log(time_slides_dict);
    //console.log(time_slides_offset);
    time_window = energy.time_slides[0].length;
    x = function (year) {
      return (time_slides_dict[year] + ((1 / time_window) * time_slides_offset[year])) * (width / energy.time_slides.length);
    };
    axis = svg.append("g").selectAll(".axis").data(energy.time_slides).enter().append("g").attr("class", "axis").attr("transform", function (d, i) {
      return "translate(" + (50 + i * width / energy.time_slides.length) + "," + 0 + ")";//需调整参数，点离左边空白处
    });
    //年代坐标轴，x1、y1为起点坐标，x2、y2为终点坐标
    axis.append("line").attr("x1", function (d) {
      return 0;
    }).attr("x2", function (d) {
      return 0;
    }).attr("y1", function (d) {
      return 0;
    }).attr("y2", function (d) {
      return 800;//需调整参数，直线坐标，决定直线长短
    }).style("stroke", function (d) {
      return "lightgray";
    }).style("stroke-width", function (d) {
      return 1;
    });
    axis.append("text").attr("x", -6).attr("y", 10).attr("dy", ".0em").attr("text-anchor", "end").attr("transform", null).text(function (d, i) {
      return d3.min(d);
    }).attr("x", 6).attr("text-anchor", "start").style("font-weight", "bold");
    //技术发展图（右上方），用的sankey画图框架
    sankey.nodes(energy.nodes).links(energy.links).items(energy.terms).nodeOffset(width / energy.time_slides.length).layout(300);
    root = energy.links;
    link = svg.append("g").selectAll(".link").data(energy.links).enter().append("path").attr("class", function (d) {
      return "link " + d.source_index + "-" + d.target_index;
    }).attr("transform", "translate(" + 100 + "," + 0 + ")").attr("d", path).style("stroke-width", function (d) {
      return 20;
    }).style("fill-opacity", .6).style("fill", function (d) {
      var key;
      key = "gradient-" + d.source_index + "-" + d.target_index;
      //offset表示link中颜色渐变，0%为起始结点颜色，100%为终止节点颜色，cluster类别为0-4，每个类别对应不同颜色
      svg.append("linearGradient").attr("id", key).attr("gradientUnits", "userSpaceOnUse").attr("x1", d.source.x + 50).attr("y1", 0).attr("x2", d.target.x).attr("y2", 0).selectAll("stop").data([
        {
          offset: "0%",
          color: color(d.source.cluster)
        }, {
          offset: "100%",
          color: color(d.target.cluster)
        }
      ]).enter().append("stop").attr("offset", function (d) {
        return d.offset;
      }).attr("stop-color", function (d) {
        return d.color;
      });
      return d.color = "url(#" + key + ")";
    }).sort(function (a, b) {
      return b.dy - a.dy;
    }).on("mouseover", function () {
      d3.select(this).attr("opacity", .6);
    }).on("mouseout", function () {
      d3.select(this).transition().duration(250).attr("opacity", function () {
        return 1;
      });
    }).on("click", function (d) {
    });
    link.append("title").text(function (d) {
      return d.source.name + " → " + d.target.name + d.source_index;
    });
    //为sankey图的结点建立力学结构模型，实现用户交互效果
    force = d3.layout.force();
    force.nodes(energy.nodes).gravity(.1).charge(function (d) {
      if (d.dy < 10) {
        return -(d.dy * 10);
      } else {
        return -(d.dy * 4);
      }
    }).size([width, 330]).start();
    node = svg.append("g").selectAll(".node").data(energy.nodes).enter().append("a").attr("href", "#").attr("class", "popup").attr("rel", "popuprel").append("g").attr("class", "node").call(force.drag).on("mouseover", function (d, event) {
      var xPosition, yPosition;
      d3.select(this).attr("opacity", .6);
      xPosition = d3.event.layerX + 50;
      yPosition = d3.event.layerY + 30;
      // if (xPosition > 900) {
      //     xPosition = d3.event.layerX - 200;
      // }
      d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(function () {
        return d.name + "：  " + format(d.value) + " " + d.y;
      });
      d3.select("#tooltip").classed("hidden", false);
    }).on("mouseout", function () {
      d3.select(this).transition().duration(400).attr("opacity", function () {
        return 1;
      });
      d3.select("#tooltip").classed("hidden", true);
    }).on("click", function (d) {
      $('#myModal').modal('show');
      d3.select("#detailInfo").text(function () {
        return d.name + "：  " + format(d.value) + "\n";
      });
    });
    node.append("a").attr("class", "border-fade").append("rect").attr("height", function (d) {
      return d.dy;
    }).attr("width", sankey.nodeWidth()).style("fill", function (d) {
      return d.color = color(d.cluster);
    }).style("stroke", function (d) {
      return d.color;
    }).style("stroke-width", function (d) {
      return 0;
    }).style("opacity", function (d) {
      return 0.6;
    });
    node.append("circle").attr("cy", function (d) {
      return (d.dy / 2) + 5;
    }).attr("r", 5).attr("stroke", "black").attr("stroke-width", 1).attr("fill", "red");
    node.append("text").attr("x", -20).attr("y", function (d) {
      return d.dy / 2;
    }).attr("text-anchor", "middle").attr("transform", null).text(function (d) {
      return d.name;
    }).style("fill", function (d) {
      return "black";
    }).style("font-weight", "bold").style("font", function (d) {
      //结点信息大小，按权重分类
      var w;
      w = d.w;
      if (w > 15) {
        w = 15;
      }
      if (w < 10 && w > 0) {
        w = 10;
      }
      return w + "px sans-serif";
    });
    energy.terms.sort(function (a, b) {
      return b.start.year - a.start.year;
    });
    force.on("tick", function () {
      node.attr("transform", function (d) {
        d.x = d.pos * (width / energy.time_slides.length);
        return "translate(" + (d.x + 50) + "," + d.y + ")";//需调整参数，人图离左边的距离
      });
      sankey.relayout();
      link.attr("d", path);
    });
    //item对应每条技术，根据start数据确定位置偏移
    item = svg.append("g").selectAll(".item").data(energy.terms).enter().append("g").attr("class", "item").attr("transform", function (d) {
      return "translate(" + x(d.start.year) + "," + (d.start.node.y + d.start.node.dy / 2) + ")";
    });
    item.append("circle").attr("cx", function (d) {
      return 0;
    }).attr("cy", function (d) {
      return 0;
    }).attr("r", function (d) {
      return d.freq / 10;
    }).style("stroke-width", 1).style("stroke", function (d) {
      return color(d.start.cluster);
    }).style("stroke-opacity", .5).style("fill", function (d) {
      return color(d.start.cluster);
    }).style("display", "none");
    //技术趋势图（右下方）的两条包络线,做了减小梯度的处理
    basis = d3.svg.area().x(function (d, i) {
      return x(d.y);
    }).y0(function (d) {
      if (d.d < 30) {
        return 200 - d.d * 5;
      }
      return 200 - 30/21.35*Math.pow(d.d,0.9) * 5;
    }).y1(function (d) {
      if (d.d < 30) {
        return 200 + d.d * 5;
      }
      return 200 + 30/21.35*Math.pow(d.d,0.9) * 5;
    }).interpolate("basis");
    flow = chart.append("g").attr("transform", function (d) {
      return "translate(" + [0, 350] + ")rotate(" + 0 + ")";
    });
    //绘制技术趋势图，data对应1个term，趋势由data.year.d的大小反映
    draw_flow = function (data) {
      if(typeof(data)=="undefined"){
        return
      }
      var channels, count, i, people_flow;
      flow.remove();
      flow = chart.append("g").attr("transform", function (d) {
        return "translate(" + [-500, 350] + ")rotate(" + 0 + ")";//需调整参数，人图的left和top，宽度的起始和旋转
      });
      d3.select(".strong").remove();
      d3.select("#term-" + data.idx).append("rect").attr("class", "strong").attr("x", "0px").attr("y", function (d) {
        return -1.8125;
      }).attr("width", "300px").attr("height", function (d) {
        return 19.8125;
      }).style("fill", "#9900FF").style("fill-opacity", 0.2);
      flow.append("path").attr("d", function (d) {
        //console.log(data.year);
        data.year.forEach(function (d) {
          d.d = d.d;
        });
        return basis(data.year);
      }).style("stroke-width", 0.2).style("stroke", "#60afe9").style("fill", "#60afe9");
      count = 0;
      //为趋势图的专家结点建立力学结构模型
      people_flow = d3.layout.force().linkDistance(80).charge(-1000).gravity(.05).size([]);
      channels = [];
      i = 0;
      //channel是趋势图显示结点信息的航道，由中间基线依次向两边扩展，即中间为0号航道，上方为1、3、5…号航道，下方为2、4、6…号航道
      //若当前航道在坐标轴上四年内未被使用，则该航道空闲，将结点信息在此处显示
      while (i < 40) {
        channels[i] = [];
        i++;
      }
      people_flow = flow.append("g").selectAll(".people").data(data.first.sort(function (a, b) {
        return a.y - b.y;
      })).enter().append("g").attr("class", "people").on("click", function (d) {
        $('#myModal').modal('show');
        //console.log(people);
        return d3.select("#detailInfo").text(function () {
          people[d.p].name + "\n";
        });
      }).attr("transform", function (d, i) {
        var c;
        c = 0;
        i = 0;
        //i表示信道序号，若4年长度内信道空闲，则可用该位置显示节点，并push进channel
        while (i < 40) {
          if (channels[i].length > 0) {
            if (d.y - d3.max(channels[i]) < 4) {
              i++;
              continue;
            }
          }
          channels[i].push(d.y);
          break;
          i++;
        }
        if (i % 2 === 0) {
          return "translate(" + [x(d.y), 200 - i / 2 * 12] + ")rotate(" + 0 + ")";
        } else {
          return "translate(" + [x(d.y), 200 + (i + 1) / 2 * 12] + ")rotate(" + 0 + ")";
        }
      });
      people_flow.append("text").attr("text-anchor", "end").style("font-size", 10).attr("dy", ".85em").attr("transform", function (d) {
        return "translate(" + [-5, -5] + ")rotate(" + 0 + ")";
      }).text(function (d) {
        return people[d.p].name;
      });
      people_flow.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5).style("stroke-width", 1).style("stroke", function (d) {
        return "#eee";
      }).style("opacity", .8).style("fill", function (d) {
        return "orangered";
      });
    };
    draw_flow(terms["all pair"]);
  };

  onChange = (key) =>{
    if (key==1){
      console.log("@@@@###");
      d3.select(".active").classed("active", false);
      d3.select(this.parentNode).classed("active", true);
      d3.selectAll(".term").remove();
      energy.terms.sort(function (a, b) {
        return b.freq - a.freq;
      });
      draw_right_box();
      draw_flow(terms[q]);
    }else{
      var hist;
      d3.select(".active").classed("active", false);
      d3.select(this.parentNode).classed("active", "true");
      d3.selectAll(".term").remove();
      let energy = trend;
      energy.terms.sort(function (a, b) {
        return b.freq - a.freq;
      });
      hist = timeline.append("g").selectAll(".term").data(energy.terms).enter().append("g").attr("class", "term").attr("id", function (d) {
        return "term-" + d.idx;
      }).attr("transform", function (d, i) {
        return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";
      }).on("click", function (d) {
        draw_flow(d);
      });
      //页面左侧统计模块的直方图
      hist.append("rect").attr("x", function (d) {
        return bar_pos + 10;
      }).attr("y", function (d) {
        return 0;
      }).attr("height", 18).attr("width", function (d) {
        return hist_height * d.freq / max_freq;
      }).style("fill-opacity", 0.7).style("fill", "#60aFe9").append("svg:title").text(function (d) {
        return d.sum;
      });
      hist.append("text").attr("text-anchor", "end").attr("transform", function (d) {
        return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
      }).style("font-size", 12).attr("dy", ".85em").text(function (d) {
        return d.t;
      });
      let q = query
      draw_flow(terms[q]);
    }
  }

  render() {
    return (
      <div className={styles.trend}>
        <Slider marks={marks} step={10} range defaultValue={[20, 50]} disabled={false} />
        <div className={styles.nav} id="right-box">
          <Tabs defaultActiveKey="1" type="card" onTabClick={ this.onChange }>
            <TabPane tab={<span><Icon type="calendar" />Current Hotspot</span>} key="1" id="first-three"></TabPane>
            <TabPane tab={<span><Icon type="global" />Overall</span>} key="2" id="revert"></TabPane>
          </Tabs>
        </div>
        <div className={styles.show} id="chart">
          <div className="modal-loading"></div>
          <div id="tooltip" className="hidden">
            <p>
              <strong id="value"></strong>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(TrendPrediction);
