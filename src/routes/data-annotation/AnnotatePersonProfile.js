import React, { Component } from 'react';
import { routerRedux, withRouter } from 'dva/router';
import { connect } from 'dva';
import * as strings from 'utils/strings';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { Auth } from 'hoc';
import styles from './AnnotatePersonProfile.less';
import Display from './Display.js';

const tc = applyTheme(styles);

// TODO Combine search and uniSearch into one.

@connect(({ app, person }) => ({ app, person }))
@Auth
@withRouter
export default class AnnotatePersonProfile extends Component {
  constructor(props) {
    super(props);
    const raw = { name: 'Rodney Brooks',
      position: ['Professor', 'Director', 'Assistant Professor', 'President of United State'],
      phone: '+1-617-253-5223',
      fax: '+1-617-253-0039',
      email: 'brooks@csail.mit.edu',
      affiliation: ['MIT', 'CMU', 'Stanford University', 'Queen Mary University of London', 'Beijing University of Post and Telecommunication'],
      address: ['America, California', 'China, Beijing', 'Mars, Human Colony', 'Galafrey'],
      photo: 'http://people.csail.mit.edu/brooks/all%20images/company%20images/Rod_Brooks_001.gif',
    };
    const modified = { name: 'empty name',
      position: 'empty position',
      phone: 'empty phone',
      fax: 'empty fax',
      email: 'empty email',
      affiliation: 'empty affiliation',
      address: 'empty address',
      photo: '' };
    const isChanged = {
      name: <p />,
      position: <p />,
      phone: <p />,
      fax: <p />,
      email: <p />,
      affiliation: <p />,
      address: <p />,
      photo: <p />,
    };
    const origin = _.cloneDeep(modified);
    this.state = { raw, modified, origin, isChanged };
  }
  componentWillMount() {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    console.log('000000--', { id });
    dispatch({ type: 'person/getPerson', payload: { personId:id } });
  }
  saveProfile() {
    alert('profile has been saved!');
  }
  render() {
    const { person } = this.props;
    const { profile } = person;
    return (
      <Layout contentClass={tc(['.annotatePersonProfile'])} >
        <Display homepageURL="http://people.csail.mit.edu/brooks/"
                 raw={this.state.raw}
                 modified={this.state.modified}
                 origin={this.state.origin}
                 isChanged={this.state.isChanged}
                 saveProfile={() => this.saveProfile()}
                 profile={profile} />
      </Layout>

    );
  }
}
