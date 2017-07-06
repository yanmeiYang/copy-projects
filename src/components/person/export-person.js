/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
import { Link } from 'dva/router';
import { Button, Modal, InputNumber, Checkbox, Row, Col } from 'antd';

const CheckboxGroup = Checkbox.Group;

const plainOptions = [{ id: 1, label: '姓名', desc: 'name_zh' }, { id: 2, label: '性别', desc: 'gender' },
  { id: 3, label: '职称', desc: 'pos' }, { id: 4, label: '单位', desc: 'aff' }];
const defaultCheckedList = [];
class ExportPersonBtn extends React.Component {
  state = {
    isExport: false,
    modalVisible: false,
    step1: true,
    step2: false,
    step3: false,
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
    exportSize: 1,
  };

  setExport = (value) => {
    this.setState({ isExport: !value })
  };

  setModalVisible = () => {
    this.setState({ modalVisible: false, step1: true, step2: false, step3: false });
  };

  exportSearchResult = () => {
    console.log('导出搜索结果');
    this.setState({ modalVisible: true });
  };
  exportSelectedResult = () => {
    console.log('导出选择结果');
  };

  setStep = (type, value) => {
    this.setState({ [type]: value, step1: false })
  };

  onChangeExportSize = (e) => {
    this.setState({ exportSize: e });
  };
  //选择导出字段
  onChange = (checkedList) => {
    this.setState({
      checkedList, indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length
    })
  };

  // onCheckAllChange = (e) => {
  //   console.log(e);
  //   this.setState({
  //     checkedList: e.target.checked ? plainOptions : [],
  //     indeterminate: false,
  //     checkAll: e.target.checked,
  //   })
  // };

  clickDownload = (e) => {
    const selectedItem = this.state.checkedList;
    let expertPersonInfo = '';
    let results=[];
    if (this.state.exportSize<=30){
      results = this.props.results.slice(0,this.state.exportSize)
    }
    results.map((person) => {
      selectedItem.map((item) => {
        switch (item) {
          case 'pos':
            if (person.pos.length > 0) {
              return expertPersonInfo += (person.pos[0].n_zh ? person.pos[0].n_zh.replace(/,/g, ';') : person.pos[0].n.replace(/,/g, ';')) + ','
            } else {
              return expertPersonInfo += ',';
            }
          case 'aff':
            return expertPersonInfo += (person.aff.desc_zh ? person.aff.desc_zh.replace(/,/g, ';') : person.aff.desc.replace(/,/g, ';')) + ',';
          case 'gender':
            return expertPersonInfo += person.attr.gender + ',';
          case 'name_zh':
            return expertPersonInfo += (person.name_zh ? person.name_zh : person.name) + ',';
          default:
            return false;
        }
      });
      expertPersonInfo += '\n';
    });
    let str = this.state.checkedList.toString() + '\n' + expertPersonInfo;
    str = encodeURIComponent(str);
    e.target.href = 'data:text/csv;charset=utf-8,' + str
  };


  render() {
    const { isExport, modalVisible, step1, step2, step3, exportSize } = this.state;

    return (
      <div style={{ float: 'right' }}>
        {isExport && <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }}
                             onClick={this.exportSearchResult.bind()}>导出当前页</Button>}
        {/*{isExport &&*/}
        {/*<Button type='primary' style={{ marginLeft: 5, marginRight: 5 }} onClick={this.exportSelectedResult.bind()}>导出已选结果</Button>}*/}
        <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }} onClick={this.setExport.bind(this, isExport)}>导出</Button>

        <Modal
          title='导出专家列表'
          visible={modalVisible}
          width={640}
          footer={null}
          onCancel={this.setModalVisible.bind(this)}
          style={{ height: 300 }}
        >
          <div style={{ minHeight: 300 }}>
            {step1 && !step2 && <div>
              <div style={{ minHeight: 300 }}>
                <span>导出条数：</span>
                <InputNumber placeholder='导出条数' min={1} max={30} defaultValue={30}
                             style={{ width: '100%' }} onChange={this.onChangeExportSize.bind(this)}/>
              </div>
              <div style={{ height: 20 }}>
                <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
                        onClick={() => this.setStep('step2', true)}>
                  下一步
                </Button>
              </div>
            </div>}
            {step2 && !step1 && <div>
              <div style={{ minHeight: 300 }}>
                <CheckboxGroup style={{ minHeight: 300 }} value={this.state.checkedList}
                               onChange={this.onChange}>
                  <Row>
                    {plainOptions.map((item) => {
                      return (
                        <Col span={8} key={item.id}><Checkbox value={item.desc}>{item.label}</Checkbox></Col>
                      )
                    })}

                  </Row>
                </CheckboxGroup>
              </div>
              <div style={{ height: 20 }}>
                <Button key="submit" type="primary" size="large" style={{ float: 'right' }}>
                  <a onClick={this.clickDownload.bind(this)} download='data.csv' href='#'>导出</a>
                </Button>
              </div>
            </div>}
          </div>
        </Modal>
      </div>
    );

  }
}

export default ExportPersonBtn;
