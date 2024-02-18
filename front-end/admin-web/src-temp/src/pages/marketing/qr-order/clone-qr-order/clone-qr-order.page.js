import { useSelector } from "react-redux";
import CreateQrOrderPage from "../create-qr-order/create-qr-order.page";

export default function CloneQrOrderPage(props) {
  let qrOrder = useSelector((state) => state?.qrCode);

  //Clone the new QrOrder. StartDate = current date. IsStopped set to false
  qrOrder.startDate = new Date();
  qrOrder.isStopped = false;
  if (qrOrder.endDate != null && qrOrder.endDate < qrOrder.startDate) qrOrder.endDate = null;

  return (
    <>
      <CreateQrOrderPage initialData={qrOrder} isClone={true} />
    </>
  );
}
