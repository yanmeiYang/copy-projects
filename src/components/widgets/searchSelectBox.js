/**
 * Created by Administrator on 2017/9/20.
 */
import React from 'react';
import styles from './searchSelectBox.less';
import { Tag } from 'antd';
const { CheckableTag } = Tag;

class SearchSelectBox extends React.PureComponent {

  onChangeDomain = (val) => {
    console.log(val)
    localStorage.setItem("domain",val);
  };
  render() {
    const model = this.props.model;
    const that = this;
    return (
      <div className={styles.filterWrap}>
        {/*<div className={styles.filter}>*/}
          {/*<div className={styles.filterRow}>*/}
            {/*<span className={styles.filterTitle}><span>Hot words:</span></span>*/}
            {/*<ul>*/}
              {/*<CheckableTag className={styles.filterItem}>Data Mining</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Database</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Theory</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Multimedia</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Security</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>System</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Machine Learning</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Artificial Intelligence</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Software Engineering</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Computer Networking</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Natural Language Processing</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Human-Computer Interaction</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Computer Graphics</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Computer Vision</CheckableTag>*/}
              {/*<CheckableTag className={styles.filterItem}>Web and Information Retrieval</CheckableTag>*/}
            {/*</ul>*/}
          {/*</div>*/}
        {/*</div>*/}
          <div className={styles.filter}>
            {/*<div className={styles.filterRow}>*/}
              {/*<span className={styles.filterTitle}><span>Filters:</span></span>*/}
            {/*</div>*/}
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}><span>Range:</span></span>
            <ul>
              <CheckableTag className={styles.filterItem}>
                <span onClick={this.onChangeDomain.bind(that, 0)} ><i className="fa fa-globe fa-fw"></i>全球专家</span>
              </CheckableTag>
              <CheckableTag className={styles.filterItem}><span onClick={this.onChangeDomain.bind(that, 1)}>ACM Fellow</span></CheckableTag>
              <CheckableTag className={styles.filterItem}><span onClick={this.onChangeDomain.bind(that, 2)}>IEEE Fellow</span></CheckableTag>
              <CheckableTag className={styles.filterItem}><span onClick={this.onChangeDomain.bind(that, 3)}>华人</span></CheckableTag>
            </ul>
          </div>
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}><span>H-index:</span></span>
            <ul>
              <CheckableTag className={styles.filterItem}>TOP50</CheckableTag>
              <CheckableTag className={styles.filterItem}>TOP100</CheckableTag>
              <CheckableTag className={styles.filterItem}>TOP200</CheckableTag>
              <CheckableTag className={styles.filterItem}>TOP500</CheckableTag>
              <CheckableTag className={styles.filterItem}>ALL</CheckableTag>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchSelectBox;
