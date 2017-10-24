/**
 * Created by ranyanchuan on 17/8/18.
 */
import React, { Component } from 'react';
// import { Link } from 'dva/router';
import { connect } from 'dva';
import { Auth } from 'hoc';
import { sysconfig } from 'systems';
import { Button, Modal, InputNumber, Checkbox, Row, Col } from 'antd';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import * as searchService from 'services/search';
import * as personService from 'services/person';
import { getTwoDecimal } from 'utils';
import { baseURL } from 'utils/config';
import * as profileUtils from 'utils/profile-utils';
import styles from './ExportExperts.less';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['name', 'gender', 'pos', 'aff', 'h_index', 'activity', 'new_star', 'num_citation', 'num_pubs', 'interest'];

const defaultCheckedList = plainOptions; // ['name', 'pos', 'aff', 'h_index'];

const mapStateToProps = ({ app, search, loading }) => ({ app, search, loading });

@connect(mapStateToProps)
@Auth
export default class ExportExperts extends Component {
  state = {
    loading: false,
    expanded: false, // 是否是展开状态
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
    // this.setState({ exportSize: this.props.pageSize });
  }

  setExport = (value) => {
    this.setState({ expanded: !value });
  };

  hideModal = () => {
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

    // 添加中文翻译 // TODO WTF
    // if (sysconfig.Locale === 'zh') {
    //   selected.push('translate');
    // }

    // TODO Change to multi download, change to use effects takeAll.
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
              value = value.replace(/\n|\r/g, ' ');
              if (value.indexOf(',') !== -1) {
                value = `"${value}"`;
              }
            }
            personInfo.push(value);
            return true;
          });
          expertPersonInfo += personInfo.join(',');
          expertPersonInfo += '\n';
          return true;
        });

        let temp = selectedItem;
        // if (sysconfig.Locale === 'zh') {
        //   temp = temp.map(item => keyValue[item]);
        // }
        const firstRow = temp.join(',');
        let str = `${firstRow}\n${expertPersonInfo}`;
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
    const { expanded, modalVisible } = this.state;
    const { expertBaseId } = this.props;
    return (
      <div className={styles.exportExperts}>

        {expanded && sysconfig.Enable_Export_EB_IF_EXIST && expertBaseId &&
        <a href={`${baseURL}/roster/${expertBaseId}/export/d/offset/0/size/2000/data.csv`}
           target="_blank" type="primary" className={styles.button}
          // onClick={this.exportEB}
        >
          <FM id="com.exportExpert.label.exportEB" defaultMessage="导出专家库" />
        </a>
        }

        {expanded &&
        <Button
          type="primary" className={styles.button}
          onClick={this.exportSearchResult.bind()}>
          <FM id="com.exportExpert.label.exportCurrentPage" defaultMessage="导出当前结果" />
        </Button>
        }

        <Button
          className={styles.exportButton}
          onClick={this.setExport.bind(this, expanded)}>
          <FM id="com.exportExpert.label.export" defaultMessage="导出" />
        </Button>

        {/* ---- Modal Zone ---- */}

        <Modal
          title={<FM id="com.exportExpert.modal.exportExperts" defaultMessage="导出专家列表" />}
          visible={modalVisible}
          footer={null}
          onCancel={this.hideModal.bind(this)}
          width={640}
          style={{ height: 300 }}>

          <label className={styles.exportNumLabel} htmlFor="">
            <FM id="com.exportExpert.modal.exportNumber" defaultMessage="导出条数:" />
          </label>
          <InputNumber min={1} max={this.state.maxExportSize}
                       defaultValue={this.state.exportSize}
                       onChange={this.onChangeExportSize.bind(this)} />

          <div className={styles.fields}>
            <FM id="com.exportExpert.modal.exportFields" defaultMessage="导出字段:" />
          </div>

          <CheckboxGroup value={this.state.checkedList} onChange={this.onChange}>
            <Row style={{ paddingLeft: 20 }}>
              {plainOptions.map(item => (
                <Col span={8} key={item}>
                  <Checkbox value={item}>
                    <FM id={`com.exportExpert.fields.${item}`} defaultMessage={item} />
                  </Checkbox>
                </Col>
              ))}

            </Row>
          </CheckboxGroup>
          <div style={{ height: 20 }}>
            <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
                    loading={this.state.loading}>
              <a onClick={this.clickDownload.bind(this)} download="data.csv" href="#">
                <FM id="com.exportExpert.modal.export" defaultMessage="导出" />
              </a>
            </Button>
          </div>

        </Modal>
      </div>
    );
  }
}