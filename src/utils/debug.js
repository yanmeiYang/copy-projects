/**
 *  Created by BoGao on 2017-08-14;
 *
 *  Note: This util is disabled in production mode.
 */
const ReduxLoggerEnabled = false;
const DebugLogEnabled = true;
const LogRequest = true;
const LogHOC = true;

// Log common message.
function log(...data) {
  if (DebugLogEnabled) {
    // add color automatically.
    console.log(...data);
  }
}

// Log every network request.
function logRequest(pattern, ...data) {
  if (LogRequest) {
    console.log(`%c${pattern}`, 'color:green', ...data);
  }
}

module.exports = {
  // configs
  ReduxLoggerEnabled, DebugLogEnabled, LogRequest, LogHOC,

  // methods
  log, logRequest,
};
