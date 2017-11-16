import React from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {sysconfig} from 'systems';
import {Checkbox, Row, Col} from 'antd';
const CheckboxGroup = Checkbox.Group;


export default class SearchHelp extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    translationStatus: 0,
    expansionCheckedStatus: 0,
    bothWays: false,
    knowledgeGraphId: 0,
    labels: [
      { id: 1, en: 'check1', zh: '选1', superordinateWord: 'c1' ,subordinateWord:'C1' },
      { id: 2, en: 'check2', zh: '选2', superordinateWord: 'c2' ,subordinateWord:'C2' },
      { id: 3, en: 'check3', zh: '选3', superordinateWord: 'c3' ,subordinateWord:'C3' },
    ],
    indeterminate: true,
    checkAll: false,
    plainOptions: [ ],
    checkedList: [ ],
  };

  checkNumCLick = (id) => {
    console.log('=======', id);
    this.setState({
      expansionCheckedStatus: id,
      knowledgeGraphId: id-1,
    });
    if(this.state.bothWays===true){
      this.setState({
        translationStatus: id,
      });
    }
  };
  checkTranslation = (id) => {
    console.log('*******', this.state.bothWays);
    this.setState({
      translationStatus: id,
      bothWays:!false,

    });
  };
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  render() {
    let divStyle = {
      // width:'800px',
      border: '1px solid grey',
      height: '65px',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '14px',
    };
    const { expansionCheckedStatus } = this.state;
    const { translationStatus } = this.state;
    const { bothWays } = this.state;
    const { knowledgeGraphId } = this.state;
    console.log("$$$$$22222",knowledgeGraphId);
    const { indeterminate } = this.state;
    const { checkAll } = this.state;
    const plainOptions = [this.state.labels[knowledgeGraphId].superordinateWord, this.state.labels[knowledgeGraphId].subordinateWord];
    console.log("$$$$$", plainOptions);
    const defaultCheckedList = [ ];
    console.log("$$$$$", defaultCheckedList);

    return (
      <div style={divStyle}>
        <div className="InputExpansion">
          <span>We automatically expanded it to:</span>
          {this.state.labels.map((item) => {
            console.log(expansionCheckedStatus);
            console.log(item.id);
            return <Checkbox onChange={this.checkNumCLick.bind(this, item.id)} className="item" key={item.id}
                             checked={expansionCheckedStatus === item.id}>
              {item.en}
            </Checkbox>;
          })
          }
        </div>
        <div className="ExpansionTranslation">
          <span>We also search for:</span>
          {this.state.labels.map((item) => {
            return <Checkbox onChange={this.checkTranslation.bind(this, item.id)} className="item" key={item.id}
                             checked={translationStatus === item.id}>
              {item.zh}
              </Checkbox>;
          })
          }
        </div>
        <div className="ExpansionScope">
        <span>Expand by knowledge graph:<Checkbox onChange={this.onCheckAllChange} indeterminate={indeterminate} checked={checkAll}></Checkbox></span>
          <Checkbox checked={false}>{this.state.labels[knowledgeGraphId].superordinateWord}</Checkbox>
          <Checkbox checked={false}>{this.state.labels[knowledgeGraphId].subordinateWord}</Checkbox>
          <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
        </div>
      </div>
    );
  }


};
