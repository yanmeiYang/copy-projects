/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
import { Link } from 'dva/router';
import { Button, Modal, InputNumber, Checkbox, Row, Col } from 'antd';
import { sysconfig } from '../../systems';
import styles from './expert-person.less';

const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  { id: 1, label: '姓名' },
  { id: 2, label: '性别' },
  { id: 3, label: '职称' },
  { id: 4, label: '单位' },
  { id: 5, label: '学术成就' },
  { id: 6, label: '学术活跃度' },
];
const defaultCheckedList = ['姓名', '性别', '职称', '单位', '学术成就', '学术活跃度'];

class ExportPersonBtn extends React.Component {
  state = {
    isExport: false,
    modalVisible: false,
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
    exportSize: sysconfig.MainListSize,
  };

  setExport = (value) => {
    this.setState({ isExport: !value });
  };

  setModalVisible = () => {
    this.setState({ modalVisible: false });
  };

  exportSearchResult = () => {
    this.setState({ modalVisible: true });
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
          case '职称':
            if (person.pos.length > 0) {
              return expertPersonInfo += `${person.pos[0].n_zh ? person.pos[0].n_zh.replace(/,/g, ';') : person.pos[0].n.replace(/,/g, ';')},`;
            } else {
              return expertPersonInfo += ',';
            }
          case '单位':
            if (person.aff.desc_zh || person.aff.desc) {
              return expertPersonInfo += `${person.aff.desc_zh ? person.aff.desc_zh.replace(/,/g, ';') : person.aff.desc.replace(/,/g, ';')},`;
            } else {
              return expertPersonInfo += ',';
            }
          case '性别':
            const gender = person.attr.gender;
            const i18nGender = this.i18nGenderTable[gender] || '';
            return expertPersonInfo += `${i18nGender},`;
          case '姓名':
            return expertPersonInfo += `${person.name_zh ? person.name_zh : person.name},`;
          case '学术成就':
            if (person.indices.h_index) {
              return expertPersonInfo += `${person.indices.h_index},`;
            } else {
              return expertPersonInfo += ',';
            }
          case '学术活跃度':
            if (person.indices.activity) {
              return expertPersonInfo += `${person.indices.activity},`;
            } else {
              return expertPersonInfo += ',';
            }
          default:
            return false;
        }
      });
      expertPersonInfo += '\n';
      return true;
    });

    const fristRow = this.state.checkedList.toString();
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
                      value={item.label}>{item.label}</Checkbox></Col>
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
