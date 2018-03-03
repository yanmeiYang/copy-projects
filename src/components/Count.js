import React from 'react';
import { Button } from 'antd-mobile';
import { connect } from "engine";

const debug = require('debug')('aminer:engine');
debug('init Component Count ------------------------------');

// Models([require('models/count')]);
function Count({ dispatch, countModel }) {

  return (
    <div>
      <div>Count: {countModel.number}</div>
      <br />
      <div>
        <Button
          type="primary"
          onClick={() => {
            dispatch({ type: 'countModel/increase' });
          }}
        >
          Increase
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            dispatch({ type: 'countModel/decrease' });
          }}
        >
          Decrease
        </Button>
      </div>
    </div>
  );
}

function mapStateToProps(state, props, m) {
  return {
    countModel: state.countModel,
  };
}

export default connect(mapStateToProps)(Count);
