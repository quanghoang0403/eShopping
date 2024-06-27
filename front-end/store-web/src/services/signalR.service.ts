import { OrderHubConstants } from '@/constants/hub.constants'
import * as signalR from '@microsoft/signalr'

class SignalRService {
  private connection: signalR.HubConnection

  constructor(customerId: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_HUB}/${OrderHubConstants.CONNECTION}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()
  }

  public startConnection = async () => {
    try {
      await this.connection.start()
      console.log('SignalR connected')
    } catch (err) {
      console.error('Error while starting SignalR connection: ', err)
    }
  }

  public stopConnection = async () => {
    try {
      await this.connection.stop()
      console.log('SignalR disconnected')
    } catch (err) {
      console.error('Error while stopping SignalR connection: ', err)
    }
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.connection.on(event, callback)
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.connection.off(event, callback)
    } else {
      this.connection.off(event)
    }
  }
}

export default SignalRService
