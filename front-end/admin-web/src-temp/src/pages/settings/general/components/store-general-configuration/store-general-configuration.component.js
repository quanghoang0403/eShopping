import "./store-general-configuration.style.scss";
import {
  StoreGeneralConfigMoneyIcon,
  StoreGeneralConfigSettingIcon,
  StoreGeneralConfigShopIcon,
  StoreQRCodeIcon,
} from "constants/icons.constants";
import { useEffect, useRef, useState } from "react";
import { CardGeneralInfo } from "./components/general-info.component";
import { CardBankAccount } from "./components/bank-account.component";
import { CardOperationConfiguration } from "./components/operation-configuration.component";
import { QRCodeConfiguration } from "./components/qr-code-configuration.component";

export default function StoreGeneralConfiguration(props) {
  const { t, storeDataService } = props;
  const generalInfoRef = useRef();
  const bankAccountRef = useRef();
  const operationConfigRef = useRef();

  const pageData = {
    general: t("store.configTab.general"),
    bankAccount: t("store.configTab.bankAccount"),
    operation: t("store.configTab.operation"),
    qrCode: t("store.configTab.qrCode"),
  };

  const tab = {
    GENERAL: 1,
    BANK_ACCOUNT: 2,
    OPERATION: 3,
    QRCODE: 4,
  };

  const [currentTab, setCurrentTab] = useState(tab.GENERAL);

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync();
    }
    fetchData();
  }, []);

  const getInitDataAsync = async () => {
    let promises = [];
    promises.push(storeDataService.getPrepareAddressDataAsync());
    promises.push(storeDataService.getStoreByIdAsync());

    let [prepareAddressDataResponse, storeDataResponse] = await Promise.all(promises);
    if (storeDataResponse) {
      generalInfoRef?.current?.setInitGeneralInfoData(prepareAddressDataResponse, storeDataResponse);
      operationConfigRef?.current?.setInitOperationData(storeDataResponse?.store);
    }

    const storeBankAccountResponse = await storeDataService.getStoreBankAccountByStoreIdAsync();
    if (storeBankAccountResponse) {
      bankAccountRef?.current?.setInitBankAccountData(storeBankAccountResponse, prepareAddressDataResponse);
    }
  };

  const onChangeTab = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className="store-general-config-wrapper">
      <div className="left-content">
        <div className="tab-general-config-container">
          {/* General */}
          <div
            className={`tab-general-config ${currentTab === tab.GENERAL && "active"}`}
            onClick={() => onChangeTab(tab.GENERAL)}
          >
            <div className="icon-box d-flex-align-center justify-center">
              <StoreGeneralConfigShopIcon />
            </div>
            <div className="text-box d-flex-align-center">
              <span className="ml-1"> {pageData.general}</span>
            </div>
          </div>

          {/* Bank account */}
          <div
            className={`tab-general-config ${currentTab === tab.BANK_ACCOUNT && "active"}`}
            onClick={() => onChangeTab(tab.BANK_ACCOUNT)}
          >
            <div className="icon-box d-flex-align-center justify-center">
              <StoreGeneralConfigMoneyIcon />
            </div>
            <div className="text-box d-flex-align-center">
              <span className="ml-1"> {pageData.bankAccount}</span>
            </div>
          </div>

          {/* Operation */}
          <div
            className={`tab-general-config ${currentTab === tab.OPERATION && "active"}`}
            onClick={() => onChangeTab(tab.OPERATION)}
          >
            <div className="icon-box d-flex-align-center justify-center">
              <StoreGeneralConfigSettingIcon />
            </div>
            <div className="text-box d-flex-align-center">
              <span className="ml-1"> {pageData.operation}</span>
            </div>
          </div>

          {/* QR Code */}
          <div
            className={`tab-general-config ${currentTab === tab.QRCODE && "active"}`}
            onClick={() => onChangeTab(tab.QRCODE)}
          >
            <div className="icon-box d-flex-align-center justify-center">
              <StoreQRCodeIcon />
            </div>
            <div className="text-box d-flex-align-center">
              <span className="ml-1"> {pageData.qrCode}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="right-content">
        <CardGeneralInfo
          ref={generalInfoRef}
          t={t}
          className={currentTab === tab.GENERAL ? "d-block" : "d-none"}
          storeDataService={storeDataService}
        />
        <CardBankAccount
          ref={bankAccountRef}
          t={t}
          className={currentTab === tab.BANK_ACCOUNT ? "d-block" : "d-none"}
          storeDataService={storeDataService}
        />
        <CardOperationConfiguration
          ref={operationConfigRef}
          t={t}
          className={currentTab === tab.OPERATION ? "d-block" : "d-none"}
          storeDataService={storeDataService}
        />
        <QRCodeConfiguration
          t={t}
          className={currentTab === tab.QRCODE ? "d-block" : "d-none"}
        />
      </div>
    </div>
  );
}
