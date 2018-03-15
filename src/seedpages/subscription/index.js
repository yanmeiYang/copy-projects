/**
 * Created by ranyanchuan on 2018/2/5.
 */
import React,{ Component } from 'react';
import { connect } from 'engine';
import { Auth } from 'hoc';
import { Layout } from 'components/layout';
import  Subscription  from 'components/subscription/index';

@connect(({ auth, app, loading }) => ({auth, app, loading,}))
export default class TestSub extends Component {

  render() {
    const subParam = {
      title: 'Collective Extraction of Document Facets in Large Technical Corpora',
      desc: 'Less Given the large volume of technical documents available,' +
      'it is crucial to automatically organize and categorize these ' +
      'documents to be able to understand and extract value from them. ' +
      'Towards this end, we introduce a new research problem called Facet' +
      'Extraction. Given a collection of technical documents, the goal of' +
      'Facet Extraction is to automatically labeleach document with a set' +
      'of concepts for the key facets (e.g.,application, technique, ' +
      'evaluation metrics, and dataset) that people may be interested in. ' +
      'Facet Extraction has numerous applications, including document ' +
      'summarization, literature search,',
      type: 'type',
      target: 'target',
    };
    return (
      <Layout searchZone={[]}  showNavigator={false}>
        <Subscription subParam={subParam} />
      </Layout>
    );
  }
}
