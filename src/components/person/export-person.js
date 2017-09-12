/**
 * Created by ranyanchuan on 17/8/18.
 */
import React from 'react';
// import { Link } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, InputNumber, Checkbox, Row, Col } from 'antd';
import { sysconfig } from '../../systems';
import styles from './export-person.less';
import * as searchService from '../../services/search';
import { getTwoDecimal } from '../../utils';
import * as profileUtils from '../../utils/profile-utils';
import * as personService from '../../services/person';


const CheckboxGroup = Checkbox.Group;

const plainOptions = ['name', 'gender', 'pos', 'aff', 'h_index', 'activity', 'new_star', 'num_citation', 'num_pubs', 'interest'];

const keyValue = {
  name: '姓名',
  gender: '性别',
  pos: '职称',
  aff: '单位',
  h_index: 'h指数',
  activity: '学术活跃度',
  new_star: '领域新星',
  num_citation: '引用数',
  num_pubs: '论文数',
  male: '男',
  female: '女',
  translate: '翻译',
  interest: '研究兴趣',
};

const defaultCheckedList = ['name', 'pos', 'aff', 'h_index'];

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
    interestsI18n: {},
  };

  componentWillMount() {
    personService.getInterestsI18N((result) => {
      this.setState({ interestsI18n: result });
    });
    this.setState({ exportSize: this.props.pageSize });
  }

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
    const size = this.state.exportSize + 10;
    const selected = plainOptions.filter((x) => {
      return this.state.checkedList.includes(x);
    });

    //  添加中文翻译
    if (sysconfig.Locale === 'zh') {
      selected.push('translate');
    }
    searchService.searchPerson(query, offset, size, filters, sort).then((res) => {
      const selectedItem = selected;
      let expertPersonInfo = '';
      if (res.data.result.length > 0) {
        const results = res.data.result.slice(0, this.state.exportSize);
        results.map((person) => {
          const personInfo = [];
          const basic = {
            name: profileUtils.displayNameCNFirst(person.name, person.name_zh),
            gender: person.attr.gender ? personService.returnGender(person.attr.gender) : ' ',
            pos: profileUtils.displayPosition(person.pos),
            aff: profileUtils.displayAff(person),
            h_index: person.indices.h_index ? person.indices.h_index : ' ',
            activity: person.indices.activity ? getTwoDecimal(parseFloat(person.indices.activity), 2) : ' ',
            new_star: person.indices.new_star ? getTwoDecimal(parseFloat(person.indices.new_star), 2) : ' ',
            num_citation: person.indices.num_citation ? getTwoDecimal(parseFloat(person.indices.num_citation), 2) : ' ',
            num_pubs: person.indices.num_pubs ? getTwoDecimal(parseFloat(person.indices.num_pubs), 2) : ' ',
            interest: person.tags.length > 0 ? person.tags.slice(0, 8).map(item => item.t).join(';') : ' ',
            translate: person.tags.length > 0 ? person.tags.slice(0, 8).map((item) => {
              const tag = personService.returnKeyByLanguage(this.state.interestsI18n, item.t);
              const showTag = tag.zh !== '' ? tag.zh : tag.en;
              return showTag;
            }).join(';') : ' ',
          };

          selectedItem.map((item) => {
            let value = basic[item];
            if (typeof value === 'string') {
              value = value.replace(/,|\n|\r/g, ' '); // 对空格、回车和逗号处理
            }
            personInfo.push(value);
            return true;
          });
          expertPersonInfo += personInfo.join(',');
          expertPersonInfo += '\n';
          return true;
        });

        let temp = selectedItem;
        if (sysconfig.Locale === 'zh') {
          temp = temp.map(item => keyValue[item]);
        }
        const fristRow = temp.join(',');
        let str = `${fristRow}\n${expertPersonInfo}`;
        const bom = '\uFEFF';
        str = encodeURI(str);
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
                         defaultValue={this.state.exportSize}
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
                    <Col span={8} key={item}><Checkbox
                      value={item}>{keyValue[item]}</Checkbox></Col>
                  );
                })}

              </Row>
            </CheckboxGroup>
            <div style={{ height: 20 }}>
              {!this.state.loading &&
              <Button key="submit" type="primary" size="large" style={{ float: 'right' }}>
                <a onClick={this.clickDownload.bind(this)} download="data.csv" href="#">导出</a>
              </Button>
              }
              {this.state.loading &&
              <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
                      loading={this.state.loading}>导出
              </Button>
              }

            </div>
          </div>

        </Modal>
      </div>
    );
  }
}

export default connect(({ app, search, loading }) => ({ app, search, loading }))(ExportPersonBtn);

