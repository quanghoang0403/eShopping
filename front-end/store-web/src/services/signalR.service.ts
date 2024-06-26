import { OrderHubConstants } from '@/constants/hub.constants';
import { getOrderStatusText } from '@/enums/enumOrderStatus';
import * as signalR from '@microsoft/signalr';
import { toast } from 'react-hot-toast';

class SignalRService {
  private connection: signalR.HubConnection;

  constructor(customerId: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BACKEND}/${OrderHubConstants.CONNECTION}/${customerId}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  public startConnection = async () => {
    try {
      await this.connection.start();
      console.log('SignalR connected');
      this.connection.on(OrderHubConstants.UPDATE_STATUS_BY_STAFF, this.onOrderUpdateStatus);
    } catch (err) {
      console.error('Error while starting SignalR connection: ', err);
      setTimeout(this.startConnection, 5000);
    }
  };

  public stopConnection = async () => {
    try {
      this.connection.off(OrderHubConstants.UPDATE_STATUS_BY_STAFF, this.onOrderUpdateStatus);
      await this.connection.stop();
      console.log('SignalR disconnected');
    } catch (err) {
      console.error('Error while stopping SignalR connection: ', err);
    }
  };

  private onOrderUpdateStatus = (orderId: string, status: number) => {
    toast.success(`Đơn hàng ${orderId} đã được ${getOrderStatusText(status)}`);
  };
}

export default SignalRService;
