/**
 *  Created by BoGao on 2017-08-14;
 */
const ReduxLoggerEnabled = false;
const DebugLogEnabled = true;

function log(...data) {
  if (DebugLogEnabled) {
    console.log(...data);
  }
}

module.exports = {
  // configs
  ReduxLoggerEnabled,

  // methods
  log,
};
