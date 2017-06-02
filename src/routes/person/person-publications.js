import React from 'react';
import { connect } from 'dva';
import styles from './person-publications.less';
import { PublicationList } from '../../components/publication';

class PersonPublications extends React.Component {

  constructor(props) {
    super(props);
    console.log('PersonPublications constructor props:', props);
    // const { publications } = props;
  }

  // TODO 启用Update模式的更新。
  componentDidMount() {
    // const { publications, dispatch } = this.props;
    // console.log('PersonPublications:: DidMount;', this.props.personId);
    // dispatch({ type: 'publications/getPublications', payload: { publications } });
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('Route:PersonPublications:willReceiveProps: ', this.props);
  //   console.log('Route:PersonPublications:willReceiveProps: ', nextProps);
  //   if (this.props.personId !== nextProps.personId) {
  //     // console.log('======================== props changed, ',
  //     //   this.state.personId, '==>', nextProps.personId);
  //     this.setState({ personId: nextProps.personId });
  //   } else {
  //     return false;
  //   }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // return this.state.personId === nextProps.personId;
    return true;
  }

  //
  componentDidUpdate() {
    // console.log('Person Publications update;', this.props.results);
  }

  render() {
    const { publications } = this.props;
    const { results } = publications;
    return (
      <div className={styles.person_publications}>

        <p>共 {results && results.length} 条;</p>

        <PublicationList pubs={results} />

      </div>
    );
  }
}

export default connect(({ publications }) => ({ publications }))(PersonPublications);
