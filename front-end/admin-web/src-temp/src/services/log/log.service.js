import { ReactPlugin, withAITracking } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights, SeverityLevel } from "@microsoft/applicationinsights-web";
import { globalHistory } from "@reach/router";
import { APPLICATION_INSIGHTS_ROLE } from "constants/application.constants";
import { env, ENVIRONMENT } from "../../env";

const reactPlugin = new ReactPlugin();
const ai = new ApplicationInsights({
  config: {
    instrumentationKey: env.REACT_APP_INSTRUMENTATION_KEY,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: globalHistory },
    },
    loggingLevelTelemetry: 1,
    disableFetchTracking: false,
    enableAutoRouteTracking: true,
  },
});

if (env.NODE_ENV !== ENVIRONMENT.Development) {
  ai.loadAppInsights();
}

ai.appInsights.addTelemetryInitializer((envelope) => {
  envelope.tags["ai.cloud.role"] = APPLICATION_INSIGHTS_ROLE.FrontEnd;
  envelope.tags["ai.cloud.roleInstance"] = env.REACT_APP_AI_ROLE_INSTANCE;
  envelope.data.timeNow = Date(Date.now()).toString();
});

const logService = {
  console: function (message, data, options) {
    let opts = options || {};
    if (opts.enableLog) {
      let prefix = opts.prefix || "DEV_LOG";
      let color = opts.color || "blue";
      console.log("%c [%s] %s %O", `color: ${color}`, prefix, message, data || {});
    }
  },
  trackException: function (msg, err, options) {
    if (env.NODE_ENV === ENVIRONMENT.Development) {
      this.console(msg, err, options);
    } else {
      ai.appInsights.trackException({ error: err, severityLevel: SeverityLevel.Error });
    }
  },
  trackTrace: function (msg, options) {
    if (env.NODE_ENV === ENVIRONMENT.Development) {
      this.console(msg, null, options);
    } else {
      ai.appInsights.trackTrace({ message: msg, severityLevel: SeverityLevel.Information });
    }
  },
};

export default (Component) => withAITracking(reactPlugin, Component);
export { logService };
