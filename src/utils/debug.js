/**
 *  Created by BoGao on 2017-08-14;
 *
 *  Note: This util is disabled in production mode.
 */
let ReduxLoggerEnabled = false;
const DebugLogEnabled = true;
const LogRequest = true;
const LogRequestResult = true;
const LogHOC = false;

ReduxLoggerEnabled = true;

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
    console.log(
      `%c${pattern}`,
      'background-color:#00a854;color:white;padding:2px 8px;border-radius: 2px;',
      ...data,
    );
  }
}

// Log every network request Response.
function logRequestResult(pattern, ...data) {
  if (LogRequestResult) {
    console.log(
      `%c${pattern}`,
      'background-color:#49a9ee;color:white;padding:2px 8px;border-radius: 2px;',
      ...data,
    );
  }
}

function logRequestError(pattern, ...data) {
  console.log(
    `%c${pattern}`,
    'background-color:red;color:white;padding:2px 8px;border-radius: 2px;',
    ...data,
  );
}

module.exports = {
  // configs
  ReduxLoggerEnabled, DebugLogEnabled, LogRequest, LogRequestResult, LogHOC,

  // methods
  log, logRequest, logRequestResult, logRequestError,

  // other configs:
  HighlightHoles: 'none', // ['none' | 'yes' | 'all']

};
