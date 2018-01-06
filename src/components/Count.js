import React from 'react';
import { Button } from 'antd-mobile';
import { engine, connect } from "core";

console.log("COMPONENT COUNT 1111111111111111111111111111111111111111111111111");

engine.model(require('models/count').default);

function Count({ dispatch, countModel }) {
  console.log('---------------------', engine);
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
