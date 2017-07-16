/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './expert-map.less';
import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile_utils';
import mapData from '../../../external-docs/expert-map/expert-map-example2.json';
import GetBMapLib from './utils/BMapLibGai.js';
import { findPosition, getById, waitforBMap, waitforBMapLib } from './utils/map-utils';

const ButtonGroup = Button.Group;
const blankAvatar = '/images/blank_avatar.jpg';

function clusterdetail(id) {
  const state = getById('flowstate').value;
  const statistic = getById('statistic').value;
  if (statistic !== id) { // 一般认为是第一次点击
    getById('flowstate').value = 1;
    const theNode = getById('allmap');
    const h = theNode.offsetHeight;  // 高度
    const w = theNode.offsetWidth;  // 宽度
    const width = 200;
    const height = h * 0.8;
    if (getById('flowinfo') == null) {
      const flowdiv = document.createElement('div');
      const cstyle = `z-index:10001;border:1px solid green;height:${height}px;width:${width}px;position: absolute;left:${w - width - 10}px;top:${(h - height) / 2}px;overflow:hidden;word-wrap: break-word;word-break:break-all;background-color:rgba(255, 255, 255, 0.3);`;
      flowdiv.setAttribute('name', 'flowinfo');// 中心的一个图片
      flowdiv.setAttribute('style', cstyle);
      flowdiv.setAttribute('id', 'flowinfo');
      theNode.appendChild(flowdiv);
    } else {
      const cstyle = `z-index:10001;border:1px solid green;height:${height}px;width:${width}px;position: absolute;left:${w - width - 10}px;top:${(h - height) / 2}px;overflow:hidden;word-wrap: break-word;word-break:break-all;background-color:rgba(255, 255, 255, 0.3);`;
      getById('flowinfo').setAttribute('style', cstyle);
      getById('flowinfo').style.display = '';
    }
    let cids = [];
    let thisinfo = '';
    if (id.indexOf(',') === -1) {
      cids[0] = id;
      const resultPromise = listPersonByIds(cids);
      resultPromise.then(
        (data) => {
          const personInfo = data.data.persons[0];
          let pos = '';
          if (typeof (personInfo.pos) === 'undefined') {
            pos = 'NULL';
          } else if (personInfo.pos == null || personInfo.pos === '') {
            pos = 'NULL';
          } else if (personInfo.pos[0] == null || personInfo.pos[0] === '') {
            pos = '';
          } else {
            pos = personInfo.pos[0].n;
          }
          let aff = 'NULL';
          if (personInfo.aff != null) {
            if (personInfo.aff.desc != null) {
              aff = personInfo.aff.desc;
            }
          }
          let photo = '/showimg.jpg';
          if (personInfo.avatar != null && personInfo.avatar !== '') {
            photo = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 50);
          }
          let tags = 'NULL';
          if (personInfo.tags != null && personInfo.tags !== '') {
            tags = '';
            for (const t in personInfo.tags) {
              tags += `${personInfo.tags[t].t}  |  `;
            }
            tags = tags.substring(0, tags.length - 3);
          }
          const thisinfo = `<img style='float:left;margin:4px' id='imgDemo' src='http:${photo}' width='70' height='80'/>`
            + `<i class='fa fa-user' style='width: 20px;'> </i><a  target='_blank' href='https://cn.aminer.org/profile/${personInfo.id}'>${
              personInfo.name}</a><br /><i class='fa fa-mortar-board' style='width: 20px;'> </i>${
              pos}<br /><i class='fa fa-institution' style='width: 20px;'> </i>${
              aff}<br /><i class='fa fa-header' style='width: 20px;'> </i><strong style='color:#A52A2A;'><span style='font-style:italic'>h</span>-index:</strong>${
              personInfo.indices.h_index}<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#Paper:  </strong>${
              personInfo.indices.num_pubs}<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#Citation:  </strong>${
              personInfo.indices.num_citation}<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#Activity:  </strong>${
              personInfo.indices.activity}<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#Diversity:  </strong>${
              personInfo.indices.diversity}<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#G_index:  </strong>${
              personInfo.indices.g_index}<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#Sociability:  </strong>${
              personInfo.indices.sociability}<br /><i class='fa fa-tag' style='width: 20px;'> </i>${
              tags}`;
          getById('flowinfo').innerHTML = `<div style='margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;word-wrap: break-word;word-break:break-all;opacity:1;background-color:#FFFFFF;'><div style='width:100%;margin:10px;'><h2>Detail Info</h2></div><div style='margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;line-height:22px'>${thisinfo}</div></div>`;
        },
        () => {
          console.log('failed');
        },
      ).catch((error) => {
        console.error(error);
      });
    } else {
      cids = id.split(',').slice(0, id.split(',').length - 1);
      const resultPromise = listPersonByIds(cids);
      resultPromise.then(
        (data) => {
          let avgHindex = 0;
          const top8 = '';
          let location = '';
          const setObj = new Set();
          const p = data.data.persons;
          for (let i = 0; i < p.length; i++) {
            avgHindex += p[i].indices.h_index;
            setObj.add(p[i].attr.nation);
          }
          for (const x in setObj) {
            location = `${location},${x}`;
          }
          avgHindex /= p.length;
          avgHindex = avgHindex.toFixed(2);// 保留两位小数
          thisinfo = `${"<div id='author_info' style='width: 350px;height: 120px;'>" + "<strong style='color:#A52A2A;'><span style='font-style:italic'>h</span>-index:</strong>"}${avgHindex
            }<br />countries:${location}</div>`;
          getById('flowinfo').innerHTML = `<div style='margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;word-wrap: break-word;word-break:break-all;opacity:1;background-color:#FFFFFF;'><div style='width:100%;margin:10px;'><h2>Statistic Info</h2></div><div style='margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;line-height:22px'>${thisinfo}</div></div>`;
        },
        () => {
          console.log('failed');
        },
      ).catch((error) => {
        console.error(error);
      });
    }
  } else if (state === 1) { // 偶数次点击同一个对象
    // 认为是第二次及其以上点击
    getById('flowstate').value = 0;
    getById('flowinfo').style.display = 'none';
  } else { // 奇数次点击同一个对象
    getById('flowstate').value = 1;
    getById('flowinfo').style.display = '';
  }

  getById('statistic').value = id;
}


function insertAfter(newElement, targetElement) {
  const parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

/*
 * Popup window.
 */
const showLoadErrorMessage = () => {
  getById('allmap').innerHTML = 'Cannot connect to Baidu Map! Please check the network state!';
};

let globalInfoWindow;
const getInfoWindow = () => {
  if (!globalInfoWindow) {
    const sContent = "<div id='author_info' class='popup'></div>";
    globalInfoWindow = new BMap.InfoWindow(sContent);
    globalInfoWindow.disableAutoPan();
  }
  return globalInfoWindow;
};

const syncInfoWindow = () => {
  const ai = getById('author_info');
  const pi = getById('personInfo');
  if (ai && pi) {
    ai.innerHTML = pi.innerHTML;
  }
};


/**
 * Component
 * @param id
 */
class ExpertMap extends React.PureComponent {
  /** 构造函数： 这里执行初始化*/
  constructor(props) {
    super(props);

    this.showOverLay = GetBMapLib(this.showTop)
    this.currentPersonId = 0;
  }

  componentDidMount() {
    this.callSearchMap(this.props.query);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('compare: ', nextProps.query, ' == ', this.props.query)
    if (nextProps.query && nextProps.query !== this.props.query) {
      this.callSearchMap(nextProps.query);
    }
    if (nextProps.expertMap.geoData !== this.props.expertMap.geoData) {
      const typeId = 0;
      this.showMap(nextProps.expertMap.geoData, typeId);
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    syncInfoWindow();
  }

  showTop = (usersIds, e, map, maindom, inputids) => {
    const ishere = getById('panel');
    if (ishere != null) {
      return;
    }
    let ids = [];
    const pixel = map.pointToOverlayPixel(e.currentTarget.getPosition());// 中心点的位置
    const width = 180;
    // 可得中心点到图像中心点的半径为：width/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=width/2
    const imgwidth = 45;
    const oDiv = document.createElement('div');
    const ostyle = `cursor:pointer;z-index:10000;height:${width}px;width:${width}px;position: absolute;left: ${pixel.x - width / 2}px;top: ${pixel.y - width / 2}px;border-radius:50%;`;
    oDiv.setAttribute('id', 'panel');
    oDiv.setAttribute('style', ostyle);
    insertAfter(oDiv, maindom);
    const thisNode = getById('panel');
    // 开始显示图片
    if (usersIds.length > 8) { // 只取前面的8个
      ids = usersIds.slice(0, 8);
    } else {
      ids = usersIds;
    }
    const fenshu = (2 * Math.PI) / ids.length;// 共有多少份，每份的夹角
    for (let i = 0; i < ids.length; i += 1) {
      const centerX = Math.cos(fenshu * i) * (width / 2 - imgwidth / 2) + width / 2;
      const centerY = Math.sin(fenshu * i) * (width / 2 - imgwidth / 2) + width / 2;
      const imgdiv = document.createElement('div');
      const cstyle = `z-index:10001;border:1px solid white;height:${imgwidth}px;width:${imgwidth}px;position: absolute;left:${centerX - imgwidth / 2}px;top:${centerY - imgwidth / 2}px; border-radius:50%; overflow:hidden;`;
      imgdiv.setAttribute('name', 'scholarimg');
      imgdiv.setAttribute('style', cstyle);
      imgdiv.innerHTML = `<img style='background: white;'  data='@@@@@@@0@@@@@@@' height='${imgwidth}' width='${imgwidth}' src='/showimg.jpg' alt='0'>`;
      // insertAfter(imgdiv,thisNode);
      thisNode.appendChild(imgdiv);
      imgdiv.addEventListener('click', function (event) {
        const chtml = this.innerHTML;
        let num = 0;
        if (chtml.split('@@@@s@@@').length > 1) {
          num = chtml.split('@@@@@@@')[1];
        }
        clusterdetail(ids[num]);
      }, false);
    }
    // 再在其中间添加一个图像
    const centerX = width / 2;
    const centerY = width / 2;
    const imgdiv = document.createElement('div');
    const cstyle = `opacity:0;z-index:10001;border:1px solid white;height:${imgwidth}px;width:${imgwidth}px;position: absolute;left:${centerX - imgwidth / 2}px;top:${centerY - imgwidth / 2}px; border-radius:50%; overflow:hidden;`;
    imgdiv.setAttribute('name', 'center');// 中心的一个图片
    imgdiv.setAttribute('style', cstyle);
    imgdiv.innerHTML = `<img style='background: white;'  data='' height='${imgwidth}' width='${imgwidth}' src='/showimg.jpg' alt='-1'>`;
    thisNode.appendChild(imgdiv);
    imgdiv.addEventListener('click', (event) => { // 集体的一个显示
      clusterdetail(inputids);
    });
    if (thisNode != null) { // 准备绑定事件
      const pthisNode = thisNode.parentNode;
      pthisNode.addEventListener('mouseleave', (event) => {
        if (thisNode != null && thisNode.parentNode != null) {
          const imgdivs = document.getElementsByName('scholarimg');
          for (let i = 0; i < imgdivs.length;) {
            imgdivs[i].parentNode.removeChild(imgdivs[i]);
          }
          thisNode.parentNode.removeChild(thisNode);
        }
      });
    }
    const resultPromise = listPersonByIds(ids);
    resultPromise.then(
      (data) => {
        const imgdivs = document.getElementsByName('scholarimg');
        if (imgdivs != null && imgdivs.length !== 0) {
          for (let i = 0; i < ids.length; i += 1) {
            const cimg = imgdivs[i];
            const personInfo = data.data.persons[i];
            let url = blankAvatar;
            if (personInfo.avatar != null && personInfo.avatar !== '') {
              url = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 41);
            }
            cimg.innerHTML = `<img style='background: white;'  data='@@@@@@@${i}@@@@@@@' height='${imgwidth}' width='${imgwidth}' src='${url}' alt='${i}'>`;
          }

          for (let j = 0; j < imgdivs.length; j += 1) {
            const cimg = imgdivs[j];
            cimg.addEventListener('mouseenter', (event) => {
              // get current point.
              const apos = getById('allmap').getBoundingClientRect();
              const cpos = event.target.getBoundingClientRect();
              const newPixel = new BMap.Pixel(cpos.left - apos.left + imgwidth, cpos.top - apos.top); // eslint-disable-line
              const currentPoint = map.pixelToPoint(newPixel);

              // get personInfo data.
              const chtml = event.target.innerHTML;
              let num = 0;
              if (chtml.split('@@@@@@@').length > 1) {
                num = chtml.split('@@@@@@@')[1];
              }
              const personInfo = data.data.persons[num];

              const infoWindow = getInfoWindow();
              this.onSetPersonCard(personInfo);
              map.openInfoWindow(infoWindow, currentPoint);
              syncInfoWindow();
              this.currentPersonId = personInfo.id;
            });
            cimg.addEventListener('mouseleave', (event) => {
              map.closeInfoWindow();
            });
          }
        }
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      console.error(error);
    });
  };

  showMap = (place, type) => {
    waitforBMap(200, 100,
      (BMap) => {
        this.showOverLay();
        const map = new BMap.Map('allmap');
        let scale = 4;
        if (type === 2) {
          scale = 6;
        } else if (type === 3) {
          scale = 6;
        } else if (type === 4) {
          scale = 10;
        }
        map.centerAndZoom(new BMap.Point(116.404, 39.915), scale);
        map.enableScrollWheelZoom();
        const cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
        map.addControl(cr);
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.OverviewMapControl());
        // map.disableDoubleClickZoom();// 静止双击
        // map.addControl(new BMap.MapTypeControl());

        const markers = [];
        const pId = [];
        let counts = 0;
        for (const o in place.results) {
          let pt = null;
          const newplace = findPosition(type, place.results[o]);
          // 只有经纬度不为空或者0的时候才显示，否则丢弃
          if ((newplace[1] != null && newplace[1] != null) && (newplace[1] != 0 && newplace[1] != 0)) {
            pt = new BMap.Point(newplace[1], newplace[0]);// 这里经度和纬度是反着的
            const marker = new BMap.Marker(pt);
            const label = new BMap.Label(`<div>${place.results[o].name}</div><div style='display: none;'>${place.results[o].id}</div>`);
            label.setStyle({
              color: 'black',
              fontSize: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              // opacity:0.4,
              fontWeight: 'bold',
              textAlign: 'center',
              width: '130px',
              textShadow: '1px 1px 2px white, -1px -1px 2px white',
              fontStyle: 'italic',
            });
            label.setOffset(new BMap.Size(-55.5, 25));
            marker.setLabel(label);
            const personId = place.results[o].id;
            pId[counts] = personId;
            markers.push(marker);
            counts += 1;
          }
        }

        waitforBMapLib(200, 100,
          (BMapLib) => {
            const _ = new BMapLib.MarkerClusterer(map, { markers });
            for (let m = 0; m < pId.length; m += 1) {
              this.addMouseoverHandler(markers[m], pId[m]);
            }
          }, showLoadErrorMessage,
        );
      }, showLoadErrorMessage,
    );
  };

  // 单点鼠标移上效果
  addMouseoverHandler = (marker, personId) => {
    const infoWindow = getInfoWindow();
    marker.addEventListener('mouseover', (e) => {
      if (this.currentPersonId !== personId) {
        this.onResetPersonCard(); // TODO Load default name
        this.onLoadPersonCard(personId);
        e.target.openInfoWindow(infoWindow);
        syncInfoWindow();
      } else {
        e.target.openInfoWindow(infoWindow);
        syncInfoWindow();
      }
      this.currentPersonId = personId;
    });
    marker.addEventListener('mouseout', (e) => {
      e.target.closeInfoWindow(infoWindow);
    });
    marker.addEventListener('click', (e) => {
      clusterdetail(personId);
    });
  };

  showType = (e) => {
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    if (typeid === 0) {
      this.showMap(this.props.expertMap.geoData, typeid);
    } else if (typeid === 1) {
      // 简单地读取其城市大区等信息，然后归一到一个地址，然后在地图上显示
      this.showMap(mapData, typeid);
    } else if (typeid === 2) {
      this.showMap(mapData, typeid);
    } else if (typeid === 3) {
      this.showMap(mapData, typeid);
    } else if (typeid === 4) {
      this.showMap(mapData, typeid);
    } else if (typeid === 5) {
      this.showMap(mapData, typeid);
    }
  };

  onChangeGoogleMap = () => {
    // this.props.dispatch(routerRedux.push({
    //   pathname: '/expert-map',
    //   data: { type: 'google' },
    // }));
    const href = window.location.href;
    window.location.href = href.replace('expert-map', 'expert-googlemap');
  };

  onChangeBaiduMap = () => {
    const href = window.location.href;
    window.location.href = href;
  };

  onLoadPersonCard = (personId) => {
    this.props.dispatch({ type: 'expertMap/getPersonInfo', payload: { personId } });
  };

  onResetPersonCard = () => {
    this.props.dispatch({ type: 'expertMap/resetPersonInfo' });
  };

  onSetPersonCard = (personInfo) => {
    this.props.dispatch({
      type: 'expertMap/getPersonInfoSuccess',
      payload: { data: { data: personInfo } },
    })
  };

  callSearchMap(query) {
    this.props.dispatch({ type: 'expertMap/searchMap', payload: { query } });
  }

  render() {
    const model = this.props && this.props.expertMap;
    const personInfo = model.personInfo;
    const url = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 50);
    const name = profileUtils.displayNameCNFirst(personInfo.name, personInfo.name_zh);
    const pos = profileUtils.displayPositionFirst(personInfo.pos);
    const aff = profileUtils.displayAff(personInfo);
    const hindex = personInfo && personInfo.indices && personInfo.indices.h_index;

    return (
      <div className={styles.expertMap} id="currentMain">

        <div className={styles.main1}>
          <div className={styles.lab1}><span>按照层级显示：</span></div>
          <div>
            <ButtonGroup id="sType">
              <Button onClick={this.showType} value="0">自动</Button>
              <Button onClick={this.showType} value="1">大区</Button>
              <Button onClick={this.showType} value="2">国家</Button>
              <Button onClick={this.showType} value="3">国内区</Button>
              <Button onClick={this.showType} value="4">城市</Button>
              <Button onClick={this.showType} value="5">机构</Button>
            </ButtonGroup>
            <div className={styles.switch}>
              <ButtonGroup id="diffmaps">
                <Button type="primary" onClick={this.onChangeBaiduMap}>Baidu Map</Button>
                <Button onClick={this.onChangeGoogleMap}>Google Map</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className="mapshow">
          <div id="allmap" style={{ width: '100%', height: '800px' }} />
          <div className="em_report" id="em_report">
            统计/报表
          </div>
          <input id="currentId" type="hidden" />
          <input id="currentIds" type="hidden" />
          <input id="statistic" type="hidden" value="0" />
          <input id="flowstate" type="hidden" value="0" />
        </div>

        <div id="personInfo">
          <div className="personInfo">
            <div><img className="img" src={url} alt="IMG" /></div>
            <div className="info">
              <div className="nameLine">
                <div className="right">H-index:<b> {hindex}</b>
                </div>
                <div className="name">{name}</div>
              </div>
              {pos && <span><i className="fa fa-briefcase fa-fw" />{pos}</span>}
              {aff && <span><i className="fa fa-institution fa-fw" />{aff}</span>}
            </div>
          </div>


        </div>
      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(ExpertMap);
