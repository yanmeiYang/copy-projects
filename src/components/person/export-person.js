/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
import { Link } from 'dva/router';
import { Button, Modal, InputNumber, Checkbox, Row, Col } from 'antd';
import { sysconfig } from '../../systems';
import styles from './expert-person.less';

const CheckboxGroup = Checkbox.Group;

const plainOptions = [{ id: 1, label: '姓名', desc: 'name_zh' }, {
  id: 2,
  label: '性别',
  desc: 'gender',
},
  { id: 3, label: '职称', desc: 'pos' }, { id: 4, label: '单位', desc: 'aff' }];
const defaultCheckedList = ['name_zh', 'gender', 'pos', 'aff'];

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
    exportSize: sysconfig.MainListSize,
  };

  setExport = (value) => {
    this.setState({ isExport: !value });
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
    this.setState({ [type]: value, step1: false });
  };

  onChangeExportSize = (e) => {
    this.setState({ exportSize: e });
  };
  // 选择导出字段
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  // onCheckAllChange = (e) => {
  //   console.log(e);
  //   this.setState({
  //     checkedList: e.target.checked ? plainOptions : [],
  //     indeterminate: false,
  //     checkAll: e.target.checked,
  //   })
  // };

  i18nGenderTable = { male: '男', female: '女' };
  clickDownload = (e) => {
    const selectedItem = this.state.checkedList;
    let expertPersonInfo = '';
    let results = [];
    if (this.state.exportSize <= 30) {
      results = this.props.results.slice(0, this.state.exportSize);
    }
    results.map((person) => {
      selectedItem.map((item) => {
        switch (item) {
          case 'pos':
            if (person.pos.length > 0) {
              return expertPersonInfo += `${person.pos[0].n_zh ? person.pos[0].n_zh.replace(/,/g, ';') : person.pos[0].n.replace(/,/g, ';')},`;
            } else {
              return expertPersonInfo += ',';
            }
          case 'aff':
            if (person.aff.desc_zh || person.aff.desc) {
              return expertPersonInfo += `${person.aff.desc_zh ? person.aff.desc_zh.replace(/,/g, ';') : person.aff.desc.replace(/,/g, ';')},`;
            } else {
              return expertPersonInfo += ',';
            }

          case 'gender':
            const gender = person.attr.gender;
            const i18nGender = this.i18nGenderTable[gender] || '';
            return expertPersonInfo += `${i18nGender},`;
          case 'name_zh':
            return expertPersonInfo += `${person.name_zh ? person.name_zh : person.name},`;
          default:
            return false;
        }
      });
      expertPersonInfo += '\n';
      return true;
    });
    const fristRow = this.state.checkedList.toString().replace(/name_zh/, '姓名').replace(/gender/, '性别').replace(/pos/, '职称').replace(/aff/, '单位');
    let str = `${fristRow}\n${expertPersonInfo}`;
    const bom = '\uFEFF';
    str = encodeURIComponent(str);
    e.target.href = `data:text/csv;charset=utf-8,${bom}${str}`;
  };


  // i18nGender = gender => this.i18nGenderTable[gender] || '';

  render() {
    const { isExport, modalVisible } = this.state;
    return (
      <div style={{ float: 'right' }}>
        {isExport && <Button type="primary" className={styles.exportPersonBtn}
                             onClick={this.exportSearchResult.bind()}>导出当前页</Button>}
        {/* {isExport && */}
        {/* <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }} onClick={this.exportSelectedResult.bind()}>导出已选结果</Button>} */}
        <Button className={styles.exportPersonBtn}
                onClick={this.setExport.bind(this, isExport)}>导出</Button>

        <Modal
          title="导出专家列表"
          visible={modalVisible}
          width={640}
          footer={null}
          onCancel={this.setModalVisible.bind(this)}
          style={{ height: 300 }}
        >
          <div>
            <label htmlFor="" style={{ margin: '0px 15px 10px 20px' }}>导出数据:</label>
            <InputNumber placeholder="导出条数" min={1} max={sysconfig.MainListSize}
                         defaultValue={sysconfig.MainListSize}
                         style={{ width: '80%' }}
                         onChange={this.onChangeExportSize.bind(this)} />

            <div style={{
              margin: '15px 15px 10px 20px',
              borderTop: '1px solid #f4f4f4',
              paddingTop: 10,
            }}>导出字段:
            </div>
            <CheckboxGroup value={this.state.checkedList}
                           onChange={this.onChange}>
              <Row style={{ paddingLeft: 20 }}>
                {plainOptions.map((item) => {
                  return (
                    <Col span={8} key={item.id}><Checkbox
                      value={item.desc}>{item.label}</Checkbox></Col>
                  );
                })}

              </Row>
            </CheckboxGroup>
            <div style={{ height: 20 }}>
              <Button key="submit" type="primary" size="large" style={{ float: 'right' }}>
                <a onClick={this.clickDownload.bind(this)} download="data.csv" href="#">导出</a>
              </Button>
            </div>
          </div>

        </Modal>
      </div>
    );
  }
}

export default ExportPersonBtn;
