import { HubConnectionState } from "@microsoft/signalr";
import { useDispatch } from "react-redux";
import { setMoMoPaymentResponse } from "../../../modules/third-party-response/third-party-response.actions";
import storeWebSocket from "../../../sockets/store-web-socket";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
const { useEffect } = require("react");

/**
 * Listen MoMo Payment Status
 * @param {*} host store web socket endpoint
 * @param {*} accountId logged account ID
 * @returns
 */
function ListenMoMoPaymentStatus(props) {
  const dispatch = useDispatch();
  const getLoginUserInfo = () => {
    const customerInfoJsonString = getStorage(localStorageKeys.CUSTOMER_INFO);
    const customerInfo = JSON.parse(customerInfoJsonString);
    return customerInfo;
  };

  useEffect(() => {
    initSocket();
    storeWebSocket.onreconnected(() => {
      joinListenerChannel();
    });

    return () => {
      cleanup();
    };
  }, []);

  const initSocket = async () => {
    if (storeWebSocket.state !== HubConnectionState.Disconnected) return;

    const loginUserInfo = getLoginUserInfo();
    const accountId = loginUserInfo?.accountId;
    if (!accountId) {
      if (window.socketLog) {
        console.error("cannot find accountId");
      }
      retry();
      return;
    }

    try {
      await startSocketAsync();
    } catch (e) {
      if (window.socketLog) {
        console.log("Connection failed: ", e);
      }
      retry();
    }
  };

  const startSocketAsync = async (accountId) => {
    await storeWebSocket.start();
    iniDataAfterConnected(accountId);
  };

  const retry = () => {
    const loginUserInfo = getLoginUserInfo();
    const accountId = loginUserInfo?.accountId;
    if (window.socketLog) {
      console.log("re-connecting... ", accountId);
    }
    setTimeout(async () => {
      iniDataAfterConnected(accountId);
    }, 1000);
  };

  const iniDataAfterConnected = (accountId) => {
    if (!accountId) {
      retry();
      return;
    }

    registerSocketFunctions();
    joinListenerChannel(accountId);
  };

  const joinListenerChannel = () => {
    const loginUserInfo = getLoginUserInfo();
    const accountId = loginUserInfo?.accountId;
    let userConnection = {
      accountId: accountId,
    };

    if (window.socketLog) {
      console.log("JoinRoom with id ", accountId);
    }
    storeWebSocket.invoke("JoinRoom", userConnection);
  };

  const registerSocketFunctions = () => {
    storeWebSocket.on("STORE_WEB_PAYMENT_STATUS", (response) => {
      if (process.env.NODE_ENV === "development" || window.socketLog) {
        console.log("response ", response);
      }

      if (response) {
        dispatch(setMoMoPaymentResponse(response));
      }
    });
  };

  const cleanup = () => {
    storeWebSocket.off("STORE_WEB_PAYMENT_STATUS");
  };

  return <></>;
}

export default ListenMoMoPaymentStatus;
