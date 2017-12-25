import React, { Component } from 'react';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import { queryURL } from '../../../utils';
import { Form, Input, Button, Tag, Select, notification, Icon } from 'antd';
import styles from './talentSearch.less'

const Option = Select.Option;

@connect(({ app }) => ({ app }))
class TalentSearch extends Component {
  state = {
    tags: ['big data', 'test', 'data Mining', 'test1', '对对对', 'eeeeeeeee', 'ffffffffffffffff', 'dddddddddddd'],
    inputDisabled: false,
    values: [],
  };

  componentDidMount() {
    // TODO 跳转后带过来的词条加载到输入框内
    // const q = queryURL('wd');
    // const reg = new RegExp(`(^|&)wd=([^"]*?(?=")`, 'i');
    // console.log('reg>>>>>>>>>', reg)
    // const r = window.location.search.substr(1).match(reg);
    // console.log('r>>>>>>>>', r)
    // console.log('inpur>>>>>>>>>',r.input)
    // console.log('zifuchua', q);
    // if (q) {
    //   const w = q.split('&');
    //   console.log('zifuchuanzhuanshuzu', w, typeof w);
    //   this.setState({ values: w, });
    // }
  }

  // 提醒不能输入
  openNotification = () => {
    notification.open({
      message: '友情提示',
      description: '搜索词已达最大限制,请勿输入!',
      icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    });
  };
  //点击添加到input框内
  addQuert = (item) => {
    const items = this.state.values;
    if (items.indexOf(item) < 0) {
      if (items.length >= 9) {
        this.openNotification();
      } else {
        items.push(item);
        this.setState({ values: items, })
      }
    }
  };
  //输入框内change事件回调,判断何时不能输入,
  handleChange = (value) => {
    if (value.length >= 10) {
      this.openNotification();
      console.log('+++++', value)
    } else {
      this.setState({ values: value, });
      console.log('====', value)
    }
  };
// 点击搜索功能
  searchExpert = () => {
    const items = this.state.values;
    console.log('ceshi>>>>>>>>>', items.join(''));
    if (items && items.length < 10) {
      this.props.dispatch(routerRedux.push({
        pathname: `/talent/search/0/20`,
        search: `?wd=${items.join('&')}`,
      }));
    }
  };

  render() {
    const { tags } = this.state;
    const children = [];
    const tagBox = tags.map((tag) => {
      children.push(<Option key={tag}>{tag}</Option>)
    });
    return (
      <div className={styles.talentSearch}>
        <Select
          mode="tags"
          style={{ width: '80%', height: '36px' }}
          placeholder="请输入搜索词"
          onChange={this.handleChange}
          filterOption={false}
          dropdownClassName={styles.rr}
          value={this.state.values}
        >
          {children}
        </Select>
        <Button htmlType="submit" type="primary"
                className={styles.searchBtn}
                onClick={this.searchExpert}>搜索
        </Button>
        <div className={styles.searchWordsBox}>
          <span className={styles.title}>热门领域: </span>
          {tags.map((tag) => {
            return <div key={tag} className={styles.tagBox}
                        onClick={this.addQuert.bind(this, tag)}>
              <Tag>{tag}</Tag></div>
          })}
        </div>
        <div>
          <span className={styles.title}>热搜人群: </span>
          <Tag>专家</Tag>
          <Tag>毕业生</Tag>
        </div>

      </div>
    )
  }
}

export default (Form.create()(TalentSearch));
