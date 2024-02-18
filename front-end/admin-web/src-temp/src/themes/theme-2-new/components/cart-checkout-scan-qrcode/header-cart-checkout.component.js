import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setQrCodeOrder } from "../../../modules/order/order.actions";
import posCartService from "../../../services/pos/pos-cart.services";
import { ArrowLeftMemberOffer, CloseIcon } from "../../assets/icons.constants";
import "./header-cart-checkout.scss";

export default function HeaderCartCheckout(props) {
  const { title, isCart, fontFamily } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClose = () => {
    posCartService.cleanPOSCartAsync(history.push("/"));
    const emptyCart = [];
    posCartService.setStoreCartLocalStorage(emptyCart);
    localStorage.removeItem("QR_CODE");
    dispatch(setQrCodeOrder(null));
  };
  const pathBack = isCart ? "/pos" : "/pos-cart";
  return (
    <div style={{ fontFamily: fontFamily }}>
      <div className="header-cart-checkout-scan-qr">
        <div className="header-cart-checkout-scan-qr-left">
          <Link to={pathBack}>
            <ArrowLeftMemberOffer />
          </Link>
          <span>{title}</span>
        </div>
        <div className="header-cart-checkout-scan-qr-right">
          <div onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
