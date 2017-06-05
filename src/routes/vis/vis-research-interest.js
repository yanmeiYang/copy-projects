/**
 *  File Created by BoGao on 2017-06-04;
 *  Moved form aminer-web, on 2017-06-04;
 */
import React from 'react';
import NVD3Chart from 'react-nvd3';
import { connect } from 'dva';
import styles from './vis-research-interest.less';
import './nv.d3.css';


class VisResearchInterest extends React.Component {
  constructor(props) {
    super(props);
    console.log('VisResearchInterest constructor props:', props);
    console.log(this.props.personId)
    if (this.props.personId) {
      console.log('>>>>>>>>>>>> initial call ', this.props.personId);
      this.loadData(this.props.personId);
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('Route:PersonPublications:willReceiveProps: ', this.props);
    // console.log('Route:PersonPublications:willReceiveProps: ', nextProps);
    if (this.props.personId !== nextProps.personId) {
      if (nextProps.personId) {
        // console.log('>>>>>>>>>>>> I received personId, now call api', nextProps.personId);
        this.loadData(nextProps.personId);
      }
    }
  }

  loadData(id) {
    this.props.dispatch({
      type: 'visResearchInterest/getInterestVisData',
      payload: { personId: id },
    });
  }

  render() {
    const visData = this.props.visResearchInterest && this.props.visResearchInterest.data;
    console.log('==== data is:', this.data);

    return (
      <div className={styles.vis_research_interest}>
        {visData.interests &&
        <NVD3Chart
          type="stackedAreaChart" width={500} height={200} duration={200}
          defaultState="Stream"
          controlOptions={['Stream']}
          showControls={true} showYAxis={false}
          datum={visData.interests}
          useInteractiveGuideline={false}
          xAxis={{ tickFormat: (d) => d }}
          x={(d) => d[0]}
          y={(d) => d[1]}
        />
        }
      </div>
    );
  }
}
;

export default connect(({ visResearchInterest }) => ({ visResearchInterest }))(VisResearchInterest);
