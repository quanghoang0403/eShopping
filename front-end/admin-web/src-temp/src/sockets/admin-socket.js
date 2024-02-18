import { env } from "env";

const { HubConnectionBuilder, LogLevel } = require("@microsoft/signalr");

const adminSocket = new HubConnectionBuilder()
  .withUrl(`${env.REACT_APP_ROOT_DOMAIN}/admin-socket`)
  .configureLogging(LogLevel.Information)
  .build();

export default adminSocket;
