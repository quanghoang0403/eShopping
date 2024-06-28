import * as signalR from '@microsoft/signalr'
import { OrderHubConstants } from 'constants/signalR.constants'
import { env } from 'env'

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${env.REACT_APP_HUB_DOMAIN}/${OrderHubConstants.CONNECTION}`) // replace with your hub URL
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    this.connection.onclose(this.onClose)
  }

  start() {
    this.connection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err))
  }

  stop() {
    this.connection
      .stop()
      .then(() => console.log('SignalR Disconnected'))
      .catch(err => console.error('Error stopping SignalR connection: ', err));
  }

  on(event, callback) {
    this.connection.on(event, callback)
  }

  off(event, callback) {
    this.connection.off(event, callback)
  }

  onClose() {
    console.log('SignalR Disconnected')
  }
}

const signalRService = new SignalRService()
export default signalRService
