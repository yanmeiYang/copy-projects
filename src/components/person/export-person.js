/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
import { Button, Modal, InputNumber, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['姓名', '单位', '地址', '邮件', '关键词'];
const defaultCheckedList = ['姓名', '单位'];
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

  //选择导出字段
  onChange = (checkedList) => {
    this.setState({
      checkedList, indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length
    })
  };

  onCheckAllChange = (e) => {
    console.log(e);
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    })
  };


  render() {
    const { isExport, modalVisible, step1, step2, step3 } = this.state;

    return (
      <div style={{ float: 'right' }}>
        {isExport && <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }}
                             onClick={this.exportSearchResult.bind()}>导出搜索结果</Button>}
        {isExport &&
        <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }} onClick={this.exportSelectedResult.bind()}>导出已选结果</Button>}
        <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }} onClick={this.setExport.bind(this, isExport)}>导出</Button>

        <Modal
          title='导出专家列表'
          visible={modalVisible}
          width={640}
          footer={null}
          onCancel={this.setModalVisible.bind(this)}
        >
          {step1 && !step2 && <div style={{ minHeight: 300 }}>
            <InputNumber placeholder='导出条数' min={1} max={500} defaultValue={1} style={{ width: '100%' }}/>
            <div style={{ height: 20 }}>
              <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
                      onClick={() => this.setStep('step2', true)}>
                下一步
              </Button>
            </div>
          </div>}
          {step2 && !step1 && <div>
            {/*<Checkbox*/}
            {/*indeterminate={this.state.indeterminate}*/}
            {/*onChange={this.onCheckAllChange}*/}
            {/*checked={this.state.checkAll}*/}
            {/*>Check all</Checkbox>*/}

            {/*<br/>*/}
            <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange}/>
            <div style={{ height: 20 }}>
              <Button key="submit" type="primary" size="large" style={{ float: 'right' }}>
                导出
              </Button>
            </div>
          </div>}
        </Modal>
      </div>
    );

  }
}

export default ExportPersonBtn;
