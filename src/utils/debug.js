/**
 *  Created by BoGao on 2017-08-14;
 *
 *  Note: This util is disabled in production mode.
 */
// const ReduxLoggerEnabled = true;
const ReduxLoggerEnabled = false;
const DebugLogEnabled = true;
const LogRequest = false;
const LogRequestResult = false;
const LogRequestContent = false;

const LogHOC = false;

const HighlightHoles = 'none'; // ['none' | 'yes' | 'all']


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

const logRequestError = (pattern, ...data) => {
  console.log(
    `%c${pattern}`,
    'background-color:red;color:white;padding:2px 8px;border-radius: 2px;',
    ...data,
  );
};


export {
  // configs
  ReduxLoggerEnabled, DebugLogEnabled, LogRequest, LogRequestResult, LogRequestContent,
  LogHOC,

  // methods
  log, logRequest, logRequestResult, logRequestError,

  // other configs:
  HighlightHoles,
};
