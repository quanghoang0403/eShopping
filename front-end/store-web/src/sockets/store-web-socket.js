import { env } from "../env";
const { HubConnectionBuilder, LogLevel } = require("@microsoft/signalr");

const storeWebSocket = new HubConnectionBuilder()
  .withUrl(`${env.REACT_APP_ROOT_DOMAIN}/store-web`)
  .withAutomaticReconnect()
  .configureLogging(LogLevel.Information)
  .build();

export default storeWebSocket;
