/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from './expert-map.less';
import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile_utils';
import { findPosition, getById, waitforBMap, waitforBMapLib } from './utils/map-utils';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneAll from './RightInfoZoneAll';
import GetBMapLib from './utils/BMapLibGai.js';

const ButtonGroup = Button.Group;
const blankAvatar = '/images/blank_avatar.jpg';

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
      const typeId = '0';
      this.showMap(nextProps.expertMap.geoData, typeId);
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    this.syncInfoWindow();
  }

  showTop = (usersIds, e, map, maindom, inputids) => {
    const ishere = getById('panel');
    if (ishere != null) {
      return;
    }

    const pixel = map.pointToOverlayPixel(e.currentTarget.getPosition());// 中心点的位置
    const width = 180;
    // 可得中心点到图像中心点的半径为：width/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=width/2
    const imgwidth = 45;

    const oDiv = document.createElement('div');
    const ostyle = `height:${width}px;width:${width}px;left: ${pixel.x - (width / 2)}px;top: ${pixel.y - (width / 2)}px;`;
    oDiv.setAttribute('id', 'panel');
    oDiv.setAttribute('style', ostyle);
    oDiv.setAttribute('class', 'roundImgContainer');
    insertAfter(oDiv, maindom);
    const thisNode = getById('panel');
    // 开始显示图片
    const ids = usersIds.slice(0, 8);

    const fenshu = (2 * Math.PI) / ids.length;// 共有多少份，每份的夹角
    for (let i = 0; i < ids.length; i += 1) {
      const centerX = Math.cos(fenshu * i) * (width / 2 - imgwidth / 2) + width / 2;
      const centerY = Math.sin(fenshu * i) * (width / 2 - imgwidth / 2) + width / 2;
      const imgdiv = document.createElement('div');
      const cstyle = `height:${imgwidth}px;width:${imgwidth}px;left:${centerX - (imgwidth / 2)}px;top:${centerY - (imgwidth / 2)}px;`;
      imgdiv.setAttribute('name', 'scholarimg');
      imgdiv.setAttribute('style', cstyle);
      imgdiv.setAttribute('class', 'imgWrapper');
      imgdiv.innerHTML = `<img width='${imgwidth}' src='${blankAvatar}' alt='0'>`;
      insertAfter(imgdiv,thisNode);
      thisNode.appendChild(imgdiv);
      imgdiv.addEventListener('click', () => this.toggleRightInfoBox(ids[i]), false);
    }
    // 再在其中间添加一个图像
    const wh = imgwidth + 40;
    const left = (width / 2) - (wh / 2);
    const imgdiv = document.createElement('div');
    const cstyle = `opacity:0;height:${wh}px;width:${wh}px;left:${left}px;top:${left}px;`;
    imgdiv.setAttribute('name', 'center');// 中心的一个图片
    imgdiv.setAttribute('style', cstyle);
    imgdiv.setAttribute('class', 'imgWrapper');
    thisNode.appendChild(imgdiv);
    imgdiv.addEventListener('click', (event) => { // 集体的一个显示
      this.toggleRightInfoBox(inputids);
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
              this.syncInfoWindow();
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
      //console.error(error);
    });
  };

  initializeBaiduMap = (map) => {
    map.enableScrollWheelZoom();
    const cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
    map.addControl(cr);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    // map.disableScrollWheelZoom();
    // map.setDefaultCursor();
    // map.disableDoubleClickZoom();// 静止双击
    // map.addControl(new BMap.MapTypeControl());
  };

  showMap = (place, type) => {
    waitforBMap(200, 100,
      (BMap) => {
        this.showOverLay();
        let scale = 4;
        let minscale = 3;
        let maxscale = 19;
        if (type === '0') {
          scale = 4;
          minscale = 4;
        } else if (type === '1' || type === '2' || type === '3') {
          scale = 4;
          minscale = 4;
          maxscale = 5;
        } else if (type === '4' || type === '5') {
          scale = 7;
          minscale = 5;
          maxscale = 7;
        }
        const map = new BMap.Map('allmap', { minZoom: minscale, maxZoom: maxscale });
        this.map = map; // set to global;
        map.centerAndZoom(new BMap.Point(116.404, 39.915), scale);
        this.initializeBaiduMap(map);
        const markers = [];
        const pId = [];
        let counts = 0;
        for (const o in place.results) {
          let pt = null;
          const newplace = findPosition(type, place.results[o]);
          // 只有经纬度不为空或者0的时候才显示，否则丢弃
          if ((newplace[1] != null && newplace[1] != null) &&
            (newplace[1] !== 0 && newplace[1] !== 0)) {
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
        this.syncInfoWindow();
      } else {
        e.target.openInfoWindow(infoWindow);
       this.syncInfoWindow();
      }
      this.currentPersonId = personId;
    });
    marker.addEventListener('mouseout', (e) => {
      e.target.closeInfoWindow(infoWindow);
    });
    marker.addEventListener('click', (e) => {
      this.toggleRightInfoBox(personId);
    });
  };

  getRightInfoBox = () => {
    let riz = getById('flowInfo');
    if (!riz) {
      riz = document.createElement('div');
      riz.setAttribute('id', 'flowInfo');
      console.log(riz)
      riz.setAttribute('class', 'rightInfoZone');
      getById('allmap').appendChild(riz);
      riz.onmouseenter = () => this.map.disableScrollWheelZoom();
      riz.onmouseleave = () => this.map.enableScrollWheelZoom();
    }
    return riz;
  };

    // 将内容同步到地图中的控件上。
  syncInfoWindow = () => {
    // sync personInfo popup
    const ai = getById('author_info');
    const pi = getById('personInfo');
    if (ai && pi) {
      ai.innerHTML = pi.innerHTML;
    }
    // sync rightSideZone
    const model = this.props && this.props.expertMap;
    const person = model.personInfo;
    const shouldRIZUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') === -1 && model.infoZoneIds === person.id;
    if (shouldRIZUpdate || model.infoZoneIds.indexOf(',') >= 0) {
      const rsz = getById('rightInfoZone');
      const flowInfo = getById('flowInfo');
      if (rsz && flowInfo) {
        flowInfo.innerHTML = rsz.innerHTML;
      }
    }
      // this.bindMouseScroll();
  };

  toggleRightInfoBox = (id) => {
    const state = getById('flowstate').value;
    const statistic = getById('statistic').value;
    if (statistic !== id) { // 一般认为是第一次点击
      getById('flowstate').value = 1;
      this.getRightInfoBox();
      if (this.props.expertMap.infoZoneIds !== id) { // don't change
        if (id.indexOf(',') >= 0) { // is cluster
          const clusterIdList = id.split(',');
          this.props.dispatch({
            type: 'expertMap/listPersonByIds',
            payload: {ids: clusterIdList},
          });
        }
        this.props.dispatch({type: 'expertMap/setRightInfoZoneIds', payload: {idString: id}});
      }
      this.syncInfoWindow();
    } else if (state === 1) { // 偶数次点击同一个对象
        // 认为是第二次及其以上点击
      getById('flowstate').value = 0;
      getById('flowInfo').style.display = 'none';
    } else { // 奇数次点击同一个对象
      getById('flowstate').value = 1;
      getById('flowInfo').style.display = '';
    }

    getById('statistic').value = id;
  };

  showType = (e) => {
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    if (typeid === '0') {
      this.showMap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '1') {
      // 简单地读取其城市大区等信息，然后归一到一个地址，然后在地图上显示
      this.showMap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '2') {
      this.showMap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '3') {
      this.showMap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '4') {
      this.showMap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '5') {
      this.showMap(this.props.expertMap.geoData, typeid);
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
    });
  };

  callSearchMap = (query) => {
    this.props.dispatch({ type: 'expertMap/searchMap', payload: { query } });
  }

    // not used.
  bindMouseScroll = () => {
    console.log('binding mouse scroll....');
    const rizs = document.getElementsByClassName('rightInfoZone');
    if (rizs && rizs.length > 0) {
      const riz = rizs[0];
      if (riz.addEventListener) {
        console.log('everything is fine.');
        // IE9, Chrome, Safari, Opera
        riz.addEventListener('mousewheel', this.onMouseScroll, false);
        // Firefox
        riz.addEventListener('DOMMouseScroll', this.onMouseScroll, false);
      } else {
        // IE 6/7/8
        riz.attachEvent('onmousewheel', this.onMouseScroll);
       }
    }
  };

  onMouseScroll = (e) => {
      // event.preventDefault();
      // console.log(e);
  };

  render() {
    const model = this.props && this.props.expertMap;
    const person = model.personInfo;
    const persons = this.props.expertMap.geoData.results;
    let count = 0;
    let hIndexSum = 0;
    if (persons) {
      persons.map((person1) => {
        hIndexSum += person1.hindex;
        count += 1;
        return hIndexSum;
      });
    }
    const avg = (hIndexSum / count).toFixed(0);
    let personPopupJsx;
    if (person) {
      const url = profileUtils.getAvatar(person.avatar, person.id, 50);
      const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      const pos = profileUtils.displayPositionFirst(person.pos);
      const aff = profileUtils.displayAff(person);
      const hindex = person && person.indices && person.indices.h_index;
      if( url !== '//static.aminer.org/default/default.jpg') {
        personPopupJsx = (
          <div className="personInfo">
            <div><img className="img" src={url} alt="IMG"/></div>
            <div className="info">
              <div className="nameLine">
                <div className="right">H-index:<b> {hindex}</b>
                </div>
                <div className="name">{name}</div>
              </div>
              {pos && <span><i className="fa fa-briefcase fa-fw"/>{pos}</span>}
              {aff && <span><i className="fa fa-institution fa-fw"/>{aff}</span>}
            </div>
          </div>
        );
      } else{
        personPopupJsx = (
          <div className="personInfo">
            <div className="info">
              <div className="nameLine">
                <div className="right">H-index:<b> {hindex}</b>
                </div>
                <div className="name">{name}</div>
              </div>
              {pos && <span><i className="fa fa-briefcase fa-fw"/>{pos}</span>}
              {aff && <span><i className="fa fa-institution fa-fw"/>{aff}</span>}
            </div>
          </div>
        );
      }
    }

      // right info
    const shouldRIZUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') === -1 && model.infoZoneIds === person.id;
    const shouldRIZClusterUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') > 0;
    const clusterPersons = model.clusterPersons;
    return (
      <div className={styles.expertMap} id="currentMain">

        <div className={styles.headerLine}>
          <div className="left">{this.props.title}</div>

          <div className={styles.scopes}>
            <span>按照层级显示：</span>
            <ButtonGroup id="sType">
              <Button onClick={this.showType} value="0">自动</Button>
              <Button onClick={this.showType} value="1">大区</Button>
              <Button onClick={this.showType} value="2">国家</Button>
              <Button onClick={this.showType} value="3">国内区</Button>
              <Button onClick={this.showType} value="4">城市</Button>
              <Button onClick={this.showType} value="5">机构</Button>
            </ButtonGroup>
            <div className={styles.switch} style={{display: 'none'}}>
              <ButtonGroup id="diffmaps">
                <Button type="primary" onClick={this.onChangeBaiduMap}>Baidu Map</Button>
                <Button onClick={this.onChangeGoogleMap}>Google Map</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className="mapshow">

          <div id="allmap" />
          <div className="em_report" id="em_report">
            统计/报表
          </div>
          <input id="currentId" type="hidden" />
          <input id="currentIds" type="hidden" />
          <input id="statistic" type="hidden" value="0" />
          <input id="flowstate" type="hidden" value="0" />
        </div>

        <div id="rank">
          <div className={styles.main3}>
            <img width="14%" src="/images/personsNumber.png"/>
            <div className={styles.lab3}><p>该区域学者人数</p>该学者所在位置</div>
          </div>
          <div className={styles.container}>
            <div className={styles.item1}> 1</div>
            <div className={styles.item2}> 2</div>
            <div className={styles.item3}> 3</div>
            <div className={styles.item4}> 4</div>
            <div className={styles.item5}> 5</div>
          </div>
          <img width="100%" src="/images/arrow.png" />
          <div className={styles.lab2}>人数增加</div>
        </div>

        <div id="flowInfoAll" >
          <div className="rightInfoZone">
            <RightInfoZoneAll count={count} hIndexSum={hIndexSum} avg={avg} persons={persons} />
          </div>
        </div>
        <div id="personInfo" style={{ display: 'none' }} >
          {personPopupJsx && personPopupJsx}
        </div>

        <div id="rightInfoZone" style={{ display: 'none' }}>
          <div className="rightInfoZone">

            {shouldRIZUpdate && <RightInfoZonePerson person={model.personInfo} /> }
            {shouldRIZClusterUpdate && <RightInfoZoneCluster persons={clusterPersons} />}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(ExpertMap);

