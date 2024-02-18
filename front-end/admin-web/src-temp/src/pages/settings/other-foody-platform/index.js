import { Col, Image, message, Row, Switch, Tooltip } from "antd";
import { icons } from "constants/icons.constants";
import otherFoodyPlatformConfigDataService from "data-services/other-foody-platform-config/other-foody-platform-config-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OtherFoodyPlatformConfigComponent } from "./components/other-foody-platform-config.component";
import { AddNewOtherFoodyPlatformConfigComponent } from "./components/add-new-other-foody-platform-config.component";
import ConfirmDialog from "./components/confirmation-dialog/confirm-dialog.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import "./other-foody-platform.scss";

export default function OtherFoodyPlatformPage(props) {
  const maxFoodyPlatform = 10;
  const [selectedFoodyPlatform, setSelectedFoodyPlatform] = useState(null);
  const [foodyPlatforms, setFoodyPlatforms] = useState([]);
  const [showAddFoodyPlayformsModal, setAddFoodyPlayformsModal]= useState(false);
  const [isAllowAddNewFoodyPlatform, setIsAllowAddNewFoodyPlatform] = useState(false);
  const [displayStopFoodyPlatformConfirmation, setDisplayStopFoodyPlatformConfirmation] = useState(false);
  const [stopFoodyPlatformContent, setStopFoodyPlatformContent] = useState("");
  const { t } = useTranslation();
  const addNewFoodyPlatformRef = React.useRef();
  const pageData = {
    updateSuccess: t("messages.updateSuccess"),
    updateFailed: t("messages.updateFailed"),
    addNewPlatform: t("otherFoodyPlatform.addNewPlatform"),
    addPlatform: t("otherFoodyPlatform.addPlatform"),
    confirmCancel: t("leaveDialog.confirmCancel"),
    cancelTransferMaterial: t("transferMaterial.cancelTransferMaterial"),
    cancel: t("button.cancel"),
    ignore: t("button.ignore"),
    stopFoodyPlatformConfirmationTitle: t("otherFoodyPlatform.deleteFoodyPlatformConfirmationTitle"),
    stopFoodyPlatformConfirmationCancellation: t("otherFoodyPlatform.deleteFoodyPlatformConfirmationCancellation"),
    stopFoodyPlatformConfirmationOk: t("otherFoodyPlatform.stopFoodyPlatformConfirmationOk")
  };

  const [isMobieSize, setIsMobieSize]   = useState(false);

  const updateDimensions = () => {
    setIsMobieSize(window.innerWidth < 500);
  }

  useEffect(() => {
    getInitData();
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const getInitData = () => {
    otherFoodyPlatformConfigDataService.getAllFoodyPlatformConfigAsync().then((resData) => {
      if (resData) {
        const { foodPlatform } = resData;
        if (Array.isArray(foodPlatform)) {
          setIsAllowAddNewFoodyPlatform(foodPlatform?.length < maxFoodyPlatform);
          setFoodyPlatforms(foodPlatform);
          setSelectedFoodyPlatform(foodPlatform?.find(foodPlatform  => foodPlatform?.id === selectedFoodyPlatform?.id) || foodPlatform[0]);
        }
      }
    });
  };

  const handleDisplayStopFoodyPlatform = (foodyPlatform, isActive) => {
    if (!isActive) {
      setStopFoodyPlatformContent(
        t("otherFoodyPlatform.stopFoodyPlatformConfirmationContent")
        .replace('{{name}}', `
          <span class="warning-text">
            ${foodyPlatform?.name}
          </span>
        `)
      );
      setSelectedFoodyPlatform(foodyPlatform);
      setDisplayStopFoodyPlatformConfirmation(true);
    }
    else {
      onActiveFoodyPlatform(foodyPlatform, isActive);
    }
  }

  const handleCancelStopFoodyPlatform = () => {
    setDisplayStopFoodyPlatformConfirmation(false);
  }

  const onActiveFoodyPlatform = (foodyPlatform, isActive) => {
    const enablePaymentConfigRequest = {
      id: foodyPlatform?.id,
      isActive: isActive
    };
    otherFoodyPlatformConfigDataService.setStatusFoodyPlatformConfigAsync(enablePaymentConfigRequest).then((response) => {
      if (response?.isSuccess === true) {
        message.success(t(response.message));
      }
      else {
        message.error(t(response.message));
      }
      getInitData();
      setDisplayStopFoodyPlatformConfirmation(false);
    });
  };

  const renderContent = () => {
    return <AddNewOtherFoodyPlatformConfigComponent ref={addNewFoodyPlatformRef}
      onCompleted={() => {
        getInitData();
        addNewFoodyPlatformRef.current.reset();
        setAddFoodyPlayformsModal(false);
      }
    }/>;
  };

  const renderTableAddNewPlatformModal = () => {
    return (
      <FnbModal
        className="modal-foody-platform"
        closable={false}
        width={"70%"}
        title={pageData.addNewPlatform}
        visible={showAddFoodyPlayformsModal}
        handleCancel={() => {
          addNewFoodyPlatformRef.current.reset();
          setAddFoodyPlayformsModal(false);}
        }
        content={renderContent()}
        footer={(null, null)}
      />
    );
  };

  const renderOtherFoodyPlatform = () => {
    const renderMethods = foodyPlatforms?.map((foodyPlatform) => {
      const currentSelected = selectedFoodyPlatform?.id === foodyPlatform?.id ? "active" : "";
      const switchOn = foodyPlatform?.isActive;
      return (
        <Row className={`p-md-3 m-2 pointer ${currentSelected}`} onClick={() => setSelectedFoodyPlatform(foodyPlatform)}>
          <Col span={19} className="col-title">
            <Image style={foodyPlatform?.isActive ? {} : {filter: 'grayscale(100%)'}} className="title-center title-image" preview={false} width={88} height={88} src={foodyPlatform?.logo} fallback={icons.paymentDefaultIcon} />
            <Tooltip placement="top" overlayClassName="tooltip-foody-platform" title={t(foodyPlatform?.name)}>
              <h3 className="ml-1 title-center limited-character-two-lines">{t(foodyPlatform?.name)}</h3>
            </Tooltip>
          </Col>
          <Col span={5} className="col-switch">
            <Switch
              className="float-right"
              size="default"
              checked={switchOn}
              onChange={(value) => {
                handleDisplayStopFoodyPlatform(foodyPlatform, value);
              }}
            />
          </Col>
          { (isMobieSize && selectedFoodyPlatform?.id == foodyPlatform?.id) && 
            <Col sm={12} md={16} className="foody-platform-setting">
              <Col span={24} className="p-0 ml-md-2 foody-platform-config">
                { renderOtherFoodyPlatformConfig()}
              </Col>
            </Col>
          }
        </Row>
      );
    });
    return (
      <div className="foody-platform-config-container">
        <h3 className="m-4">{pageData.paymentMethod}</h3>
        <div className="mt-4">{renderMethods}</div>
      </div>
    );
  };

  const renderOtherFoodyPlatformConfig = () => {
    let otherFoodyPlatformConfigComponent = <></>;
    if (selectedFoodyPlatform) {
      otherFoodyPlatformConfigComponent = (
        <OtherFoodyPlatformConfigComponent
          onCompleted={() => {
            getInitData();
          }}
          initData={selectedFoodyPlatform}
        />
      );
    }

    return (
      <div className="component-PaymentConfig p-2">
        {otherFoodyPlatformConfigComponent}
      </div>
    );
  };
  const openModal = () => {
    setAddFoodyPlayformsModal(true);
  };

  return (
    <>
      {renderTableAddNewPlatformModal()}
      <Row gutter={[0, { xs: 8, sm: 24, md: 24, lg: 32 }]} className="platform-menu">
        <Col sm={24} xs={24} lg={12}>
          <h1 className="mb-0 title">{t("otherFoodyPlatform.platformManagement")}</h1>
        </Col>
        <Col sm={24} xs={24} lg={12}>
          {isAllowAddNewFoodyPlatform && 
            <FnbAddNewButton 
              className="float-right" 
              htmlType="submit" 
              type="primary" 
              text={pageData.addPlatform} 
              onClick={openModal}
            />
          }
        </Col>
      </Row>

      {isMobieSize ?
        <>
          <Col sm={12} md={8} className="foody-platform-choice h-100">
            {renderOtherFoodyPlatform()}
          </Col>
        </>
        :
        <>
          <Row gutter={[18, { xs: 8, sm: 24, md: 24, lg: 32 }]}>
            <Col sm={12} md={8} className="foody-platform-choice">
              {renderOtherFoodyPlatform()}
            </Col>
            <Col sm={12} md={16} className="foody-platform-setting">
              <Col span={24} className="p-0 ml-md-2 foody-platform-config">
                {renderOtherFoodyPlatformConfig()}
              </Col>
            </Col>
          </Row>
        </>
      }
      <ConfirmDialog
        className='stop-confirmation-modal'
        title={pageData.stopFoodyPlatformConfirmationTitle}
        content={stopFoodyPlatformContent}
        visible={displayStopFoodyPlatformConfirmation}
        skipPermission={true}
        cancelText={pageData.stopFoodyPlatformConfirmationCancellation}
        okText={pageData.stopFoodyPlatformConfirmationOk}
        onCancel={handleCancelStopFoodyPlatform}
        onOk={() => onActiveFoodyPlatform(selectedFoodyPlatform, false)}
      />
    </>
  );
}