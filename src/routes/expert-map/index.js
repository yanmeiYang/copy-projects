/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import ExpertMap from './expert-map.js';
import styles from './index.less';

class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    console.log('Loading BaiduMap Container');
    // console.log('DEBUG: ', this.props, this.props.expertMap);
  }

  showtype=(e)=>{
    const typeid = e.target && e.target.getAttribute('data');
    var tli=document.getElementById("menu0").getElementsByTagName("li");
    //alert(document.getElementById("tabs0").className);
    ExpertMap.test1();
    var currentclass=""
    for(var i=0;i<tli.length;i++){
      if(tli[i].className!=""){
        currentclass=tli[i].className
      }
    }
    for(var i=0;i<tli.length;i++){
      if(i==typeid){
        tli[i].className=currentclass
      }else{
        tli[i].className=""
      }
    }
  }

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div className="cont1">
        <h1>Expert Map</h1>
        <ExpertMap />
      </div>
    );
  }
}

export default connect(({ expertMap }) => ({ expertMap }))(ExpertMapPage);
