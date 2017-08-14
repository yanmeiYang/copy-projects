/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
// import { Link } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, InputNumber, Checkbox, Row, Col } from 'antd';
import { sysconfig } from '../../systems';
import styles from './expert-person.less';
import * as searchService from '../../services/search';
import { getTwoDecimal } from '../../utils';


const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  { id: 1, label: '姓名', desc: 'name' },
  { id: 2, label: '性别', desc: 'gender' },
  { id: 3, label: '职称', desc: 'pos' },
  { id: 4, label: '单位', desc: 'aff' },
  { id: 5, label: 'h-index', desc: 'h_index' },
  { id: 6, label: '学术活跃度', desc: 'activity' },
  { id: 7, label: '领域新星', desc: 'new_star' },
  { id: 8, label: '引用数', desc: 'num_citation' },
  { id: 9, label: '论文数', desc: 'num_pubs' },
];

const keyValue = {
  name: '姓名',
  gender: '性别',
  pos: '职称',
  aff: '单位',
  h_index: 'h-index',
  activity: '学术活跃度',
  new_star: '领域新星',
  num_citation: '引用数',
  num_pubs: '论文数',
  male: '男',
  female: '女',
};

const defaultCheckedList = ['name', 'gender', 'pos', 'aff', 'h_index', 'activity', 'new_star', 'num_citation', 'num_pubs'];
class ExportPersonBtn extends React.Component {
  state = {
    loading: false,
    isExport: false,
    modalVisible: false,
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
    exportSize: 100,
    maxExportSize: 100,
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

  clickDownload = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    const { query, pageSize, current, filters, sort } = this.props;
    const offset = pageSize * (current - 1);
    const size = this.state.exportSize;
    const selected = this.state.checkedList;
    searchService.searchPerson(query, offset, size, filters, sort).then((res) => {
      const selectedItem = selected;
      let expertPersonInfo = '';
      const results = res.data.result;
      if (res.data.result.length > 0) {
        results.map((person) => {
          selectedItem.map((item) => {
            switch (item) {
              case 'name':
                return expertPersonInfo += person.name_zh ? `${person.name_zh},` : (person.name ? `${person.name},` : ',');
              case 'gender':
                return expertPersonInfo += person.attr.gender ? `${keyValue[person.attr.gender]},` : ',';
              case 'pos':
                return expertPersonInfo += person.pos[0].n_zh ? `${person.pos[0].n_zh.replace(/,/g, ';')},` : (person.pos[0].n ? `${person.pos[0].n.replace(/,/g, ';')},` : ',');
              case 'aff':
                return expertPersonInfo += person.aff.desc_zh ? `${person.aff.desc_zh.replace(/,/g, ';')},` : (person.aff.desc ? `${person.aff.desc.replace(/,/g, ';')},` : ',');
              case 'h_index':
                return expertPersonInfo += person.indices.h_index ? `${person.indices.h_index},` : ',';
              case 'activity':
                return expertPersonInfo += person.indices.activity ? `${getTwoDecimal(parseFloat(person.indices.activity), 2)},` : ',';
              case 'new_star':
                return expertPersonInfo += person.indices.new_star ? `${getTwoDecimal(parseFloat(person.indices.new_star), 2)},` : ',';
              case 'num_citation':
                return expertPersonInfo += person.indices.num_citation ? `${getTwoDecimal(parseFloat(person.indices.num_citation), 2)},` : ',';
              case 'num_pubs':
                return expertPersonInfo += person.indices.num_pubs ? `${getTwoDecimal(parseFloat(person.indices.num_pubs), 2)},` : ',';
              default:
                return true;
            }
          });
          expertPersonInfo += '\n';
          return true;
        });
        let fristRow = '';
        selected.map((item) => {
          fristRow += `${keyValue[item]},`;
          return true;
        });
        let str = `${fristRow}\n${expertPersonInfo}`;
        const bom = '\uFEFF';
        str = encodeURIComponent(str);
        location.href = `data:text/csv;charset=utf-8,${bom}${str}`;
        this.setState({ loading: false });
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  render() {
    const { isExport, modalVisible } = this.state;
    return (
      <div style={{ float: 'right' }}>
        {isExport && <Button type="primary" className={styles.exportPersonBtn}
                             onClick={this.exportSearchResult.bind()}>导出当前页</Button>}
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
            <InputNumber placeholder="导出条数" min={1} max={this.state.maxExportSize}
                         defaultValue={this.state.maxExportSize}
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
              <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
                      loading={this.state.loading}>
                <a onClick={this.clickDownload.bind(this)} download="data.csv" href="#">导出</a>
              </Button>
            </div>
          </div>

        </Modal>
      </div>
    );
  }
}

export default connect(({ app, search, loading }) => ({ app, search, loading }))(ExportPersonBtn);

