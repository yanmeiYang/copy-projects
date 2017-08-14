const DebugLogEnabled = true;

function log(...data) {
  if (DebugLogEnabled) {
    console.log(...data);
  }
}

module.exports = {
  log,
};
