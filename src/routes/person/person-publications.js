import React from 'react';
import { connect } from 'dva';
import { Tabs, Button, Radio } from 'antd';
import styles from './person-publications.less';
import { PublicationList } from '../../components/publication';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const PUBLIST_DEFAULT_SIZE = 50;

class PersonPublications extends React.Component {
  constructor(props) {
    super(props);
    // console.log('PersonPublications constructor props:', props);
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
    // console.log('Route:PersonPublications:willReceiveProps: ', nextProps);

    /* watch personId changes. call api. */
    if (this.props.personId !== nextProps.personId) {
      if (nextProps.personId) {
        // console.log('>>>>>>>>>>>> I received personId, now call api', nextProps.personId);
        this.params.personId = nextProps.personId;
        this.props.dispatch({
          type: 'publications/getPublistInfo',
          payload: { personId: this.params.personId },
        });
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
    // console.log('DidUpdate;', prevProps, prevState);
  }

  onOrderTabChange = (key) => {
    this.params.orderBy = key;
    this.loadPublicationList();
  }

  onByYearTabChange = (e) => {
    const yearTab = e.target.value;
    this.params.orderBy = 'byYear';
    this.params.year = yearTab;// reset year.
    if (yearTab === 'all') {
      this.params.size = PUBLIST_DEFAULT_SIZE;
    } else if (yearTab === 'recent' || yearTab === '') {
      this.params.size = 20;
    }
    this.loadPublicationList();
  }

  onByCitationTabChange = (e) => {
    const citedTab = e.target.value;
    this.params.orderBy = 'byCitation';
    this.params.citedTab = citedTab;
    // this.params.year = yearTab;// reset year.
    if (citedTab === 'all') {
      this.params.size = PUBLIST_DEFAULT_SIZE;
    } else if (citedTab === 'top' || citedTab === '') {
      this.params.size = 20;
    }
    this.loadPublicationList();
  }

  /** API Call,exactly the parameters used by publication service. and errects:getPublications. */
  params = {
    personId: '',
    orderBy: 'byYear',
    year: '',
    citedTab: '',
    offset: 0,
    size: 20,
  };

  loadPublicationList() {
    this.props.dispatch({
      type: 'publications/getPublications',
      payload: this.params,
    });
  }

  render() {
    const { publications } = this.props;
    const { pubListInfo } = publications;
    const years = pubListInfo.years;
    const ncites = pubListInfo.ncites && pubListInfo.ncites;

    return (
      <div className={styles.person_publications}>

        <Tabs onChange={this.onOrderTabChange} defaultActiveKey="byYear">

          <TabPane tab="按年份排序" key="byYear" className={styles.tabpane}>

            {this.props.personId &&
            <RadioGroup
              defaultValue="recent" size="small" className={styles.radiogroup}
              onChange={this.onByYearTabChange}
            >
              <RadioButton value="all" className={styles.big}>
                所有的 ({this.props.totalPubs})
              </RadioButton>
              <RadioButton value="recent" className={styles.big}>
                最近的 (20)
              </RadioButton>
              {years && years.map((year) => {
                return <RadioButton value={year.year} key={year.year}>{year.year}</RadioButton>;
              })}
            </RadioGroup>
            }

            <PublicationList pubs={publications.resultsByYear} />
          </TabPane>


          <TabPane tab="按引用量排序" key="byCitation">

            {this.props.personId &&
            <RadioGroup
              defaultValue="top" size="small" className={styles.radiogroup}
              onChange={this.onByCitationTabChange}
            >
              <RadioButton value="all" className={styles.big}>
                所有的 ({this.props.totalPubs})
              </RadioButton>
              <RadioButton value="top" className={styles.big}>
                前 (20)
              </RadioButton>
              {ncites && ncites.map((ncite) => {
                const key = `${ncite.nl}-${ncite.nh}-${ncite.size}`;
                if (ncite.size <= 0) {
                  return '';
                }
                return <RadioButton value={key} key={key}>{`${ncite.nl}-${ncite.nh}`}</RadioButton>
              })}
            </RadioGroup>
            }
            <PublicationList pubs={publications.resultsByCitation} />
          </TabPane>

        </Tabs>

      </div>
    );
  }
}

export default connect(({ publications }) => ({ publications }))(PersonPublications);
