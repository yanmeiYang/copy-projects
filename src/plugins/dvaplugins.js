import createLoading from "dva-loading";
import { ReduxLoggerEnabled } from "utils/debug";
import { createLogger } from "redux-logger";

// TODO add this.
// app.use(createLoading({ effects: true }));

const plugins = {};

if (process.env.NODE_ENV !== 'production') {
  if (ReduxLoggerEnabled) {
    plugins['onAction'] = createLogger();
  }
}

export default plugins;
