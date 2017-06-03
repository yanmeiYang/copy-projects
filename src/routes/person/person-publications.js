import React from 'react';
import { connect } from 'dva';
import { Tabs, Button } from 'antd';
import styles from './person-publications.less';
import { PublicationList } from '../../components/publication';

const TabPane = Tabs.TabPane;

class PersonPublications extends React.Component {
  constructor(props) {
    super(props);
    console.log('PersonPublications constructor props:', props);
  }

  state = {
    // resultsByYear: this.props && this.props.results,
    // resultsByCitation: [],
  };


// TODO 启用Update模式的更新。
  componentDidMount() {
    // const { publications, dispatch } = this.props;
    // console.log('PersonPublications:: DidMount;', this.props.personId);
    // dispatch({ type: 'publications/getPublications', payload: { publications } });
  }

  componentWillReceiveProps(nextProps) {
    // console.log('Route:PersonPublications:willReceiveProps: ', this.props);
    console.log('Route:PersonPublications:willReceiveProps: ', nextProps);

    /* watch personId changes. call api. */
    if (this.props.personId !== nextProps.personId) {
      if (nextProps.personId) {
        // console.log('>>>>>>>>>>>> I received personId, now call api', nextProps.personId);
        this.params.personId = nextProps.personId;
        this.loadPublicationList();// initial call, personId change call.
      }
    }

    // watch props.results, if changed set to local state to render.
    // TODO ....
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('DidUpdate;', prevProps.personId, prevState);
  }

  onOrderTabChange = (key) => {
    console.log('>>', key);
    this.params.orderBy = key;
    this.loadPublicationList();
  }

  /** API Call */
    // exactly the parameters used by publication service. and errects:getPublications.
  params = {
    personId: '',
    orderBy: 'byYear',
    offset: 0,
    size: 10,
  };

  loadPublicationList() {
    this.props.dispatch({
      type: 'publications/getPublications',
      payload: this.params,
    });
  }

  render() {
    const { publications } = this.props;
    // const { results } = publications;
    console.log('>>>--------render -----------------------------',
      this.props.personId, this.state.resultsByYear)
    return (
      <div className={styles.person_publications}>

        <Tabs onChange={this.onOrderTabChange}>
          <TabPane tab="按年份排序" key="byYear">
            <PublicationList pubs={publications.resultsByYear} />
          </TabPane>

          <TabPane tab="按引用量排序" key="byCitation">
            <PublicationList pubs={publications.resultsByCitation} />
          </TabPane>
        </Tabs>


      </div>
    );
  }
}

export default connect(({ publications }) => ({ publications }))(PersonPublications);
