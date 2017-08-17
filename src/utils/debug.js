/**
 *  Created by BoGao on 2017-08-14;
 *
 *  Note: This util is disabled in production mode.
 */
const ReduxLoggerEnabled = false;
const DebugLogEnabled = true;
const LogRequest = true;

// Log common message.
function log(...data) {
  if (DebugLogEnabled) {
    console.log(...data);
  }
}

// Log every network request.
function logRequest(...data) {
  if (LogRequest) {
    console.log(...data);
  }
}

module.exports = {
  // configs
  ReduxLoggerEnabled,

  // methods
  log, logRequest,
};
