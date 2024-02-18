import { Col, Image, message, Row, Switch, Collapse, Tabs, Tooltip } from "antd";
import { icons, EnterprisePaymentMethodIcon, PersonalPaymentMethodIcon, DragIcon, InfoCircleFlashSaleIcon } from "constants/icons.constants";
import { paymentMethod } from "constants/payment-method.constants";
import paymentConfigDataService from "data-services/payment-config/payment-config-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoMoPaymentConfigComponent } from "./components/momo-payment-config.component";
import { VisaMasterPaymentConfigComponent } from "./components/visa-master-payment-config.component";
import { VNPayPaymentConfigComponent } from "./components/vnpay-payment-config.component";
import { BankTransferPaymentConfigComponent } from "./components/banktransfer-payment-config.component";
import { NewMethodDialogComponent } from "./components/new-method-dialog.component";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import "./payment-method.scss";
import paymentDataService from "data-services/payment/payment-data.service";
import { PersonalPaymentConfigComponent } from "./components/personal-payment-method.component";
import { FnbNotifyDialog } from "components/fnb-notify-dialog/fnb-notify-dialog.component";
import TabPane from "antd/lib/tabs/TabPane";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CashPaymentConfigComponent } from "./components/cash-payment-config.component";

export default function PaymentMethodPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedPaymentMethodTypeName, setSelectedPaymentMethodTypeName] = useState(null);
  const [isShowFnbAddNewButton, setIsShowFnbAddNewButton] = useState(null);
  const [enterprisePaymentMethods, setEnterprisePaymentMethods] = useState([]);
  const [personalPaymentMethods, setPersonalPaymentMethods] = useState([]);  
  const [namePaymentMethods, setNamePaymentMethods] = useState(false);
  const [showAddNewMethodForm, setShowAddNewMethodForm] = useState(false);
  const [isModalNotificationVisible, setIsModalNotificationVisible] = useState(false);
  const [isMobieSize, setIsMobieSize]   = useState(false);
  const [activeScreen, setActiveScreen] = useState();
  const { t } = useTranslation();
  const pageData = {
    paymentMethod: t("payment.paymentMethod"),
    enterprisePaymentMethod: t("payment.enterprisePaymentMethod"),
    personalPaymentMethod: t("payment.personalPaymentMethod"),
    tooltipEnterprise: t('payment.tooltipEnterprise'), 
    tooltipPersonal: t('payment.tooltipPersonal'),
    addNewMethodButton: t("payment.addNewMethodButton"),
    noDataFound: t("payment.noDataFound"),
    settings: t("payment.settings"),
    activated: t("payment.activated"),
    notIntegrated: t("payment.notIntegrated"),
    updateSuccess: t("payment.updateSuccess"),
    updateFailed: t("payment.updateFailed"),
    personalUpdateSuccess: t("payment.personalUpdateSuccess"),
    notificationTitle: t("form.notificationTitle"),
    notificationMessage: t("payment.notificationMessage", { method_name: selectedPaymentMethod?.name }),
    personalPaymentMethodEmpty: t("payment.personalPaymentMethodEmpty"),
    tagEnterprise: t("payment.tagEnterprise"),
    button: {
      stop: t("button.stop"),
      ignore: t("button.ignore"),
    }
  };

  const maxLengthNamePersonalMethod = 17;

  const paymentMethodTypeEnum = {
    enterprise: 1,
    personal: 2,
  };

  const screens = [
    {
      name: pageData.enterprisePaymentMethod,
      key: paymentMethodTypeEnum.enterprise,
      tooltip: pageData.tooltipEnterprise,
    },
    {
      name: pageData.personalPaymentMethod,
      key: paymentMethodTypeEnum.personal,
      tooltip: pageData.tooltipPersonal,
    },
  ];

  useEffect(() => {
    getInitData(true);
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const getInitData = (isFistLoad = false, isReloadSelectedMethod = false) => {
    paymentConfigDataService.getAllStorePaymentConfigAsync().then((resData) => {
      if (resData) {
        let { paymentMethods, personalPaymentMethods } = resData;
        setEnterprisePaymentMethods(paymentMethods);
        setPersonalPaymentMethods(personalPaymentMethods);
        setNamePaymentMethods(paymentMethods.map(method => method.name)
        .concat(personalPaymentMethods.map(method => method.name)));
        if(isFistLoad){
          onChangeCollapse(paymentMethodTypeEnum.enterprise.toString(), paymentMethods);
        }
        if(isReloadSelectedMethod){
          let newSelectedPaymentMethod = null; 
          if(selectedPaymentMethod.enumId != paymentMethod.Personal){
            newSelectedPaymentMethod = enterprisePaymentMethods.find(method => method.id == selectedPaymentMethod.id);
          }
          else {
            newSelectedPaymentMethod = personalPaymentMethods.find(method => method.id == selectedPaymentMethod.id);
          }
          setSelectedPaymentMethod(newSelectedPaymentMethod);
        }
      }
    });
  };

  const updateDimensions = () => {
    setIsMobieSize(window.innerWidth < 500);
  }

  const onActivePaymentMethod = (paymentMethod, isActive) => {
    const enablePaymentConfigRequest = {
      enumId: paymentMethod.enumId,
      isActive: isActive,
    };
    paymentConfigDataService.enablePaymentConfigAsync(enablePaymentConfigRequest).then((success) => {
      if (success === true) {
        message.success(pageData.updateSuccess);
        if (paymentMethod.paymentConfigs[0]) {          
          paymentMethod.paymentConfigs[0].isActivated = isActive;
          setSelectedPaymentMethod(paymentMethod);
        }  
        
      } else {
        message.error(pageData.updateFailed);
      }
      getInitData();
    });
  };

  const onActivePersonalPaymentMethod = (paymentMethod, isActive) => {
    const enablePersonalPaymentMethodRequest = {
      id: paymentMethod.id,
      isActive: isActive,
    };
    paymentDataService.enablePersonalPaymentMethodAsync(enablePersonalPaymentMethodRequest).then((success) => {
      if (success === true) {
        message.success(pageData.personalUpdateSuccess);
        let newSelectedPaymentMethod = selectedPaymentMethod;
        newSelectedPaymentMethod.isActive = isActive;
        setSelectedPaymentMethod(newSelectedPaymentMethod);
      } else {
        message.error(pageData.updateFailed);
      }
      getInitData();
    });
  };

  const onClickSwitchPersonal = (paymentMethod, isActive) => {
    if(isActive){
      onActivePersonalPaymentMethod(paymentMethod, isActive);
    }
    else {
      setIsModalNotificationVisible(true);
    }
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.forEach((item, index) => item.position = index);
    return result;
  };

  const onDragEnd = (result, paymentMethodTypeEnumId) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    if(paymentMethodTypeEnumId == paymentMethodTypeEnum.enterprise){
      const newPositionEnterprisePaymentMethods = reorder(
        enterprisePaymentMethods,
        result.source.index,
        result.destination.index
      );
      paymentDataService.updatePositionEnterprisePaymentMethodAsync({ positionEnterprisePaymentMethods: newPositionEnterprisePaymentMethods })
        .then((success) => {
          if (success) {
            setEnterprisePaymentMethods(newPositionEnterprisePaymentMethods);
          }
        })
    }
    if(paymentMethodTypeEnumId == paymentMethodTypeEnum.personal){
      const newPositionPersonalPaymentMethods = reorder(
        personalPaymentMethods,
        result.source.index,
        result.destination.index
      );
      paymentDataService.updatePositionPersonalPaymentMethodAsync({ positionPersonalPaymentMethods: newPositionPersonalPaymentMethods })
        .then((success) => {
          if (success) {
            setPersonalPaymentMethods(newPositionPersonalPaymentMethods);
          }
        })
    }
    
  }

  const onChangeCollapse = (key, localEnterprisePaymentMethods = enterprisePaymentMethods) => {
    switch(key) {
      case paymentMethodTypeEnum.enterprise.toString(): {
        //can't use pageData.enterprisePaymentMethod because this not change where select another language
        setSelectedPaymentMethodTypeName('payment.enterprisePaymentMethod');
        setSelectedPaymentMethod(localEnterprisePaymentMethods.find(method => method.enumId == paymentMethod.Cash));
        setIsShowFnbAddNewButton(false);
        break;
      }
      case paymentMethodTypeEnum.personal.toString(): {
        setSelectedPaymentMethodTypeName('payment.personalPaymentMethod');
        setSelectedPaymentMethod();
        setIsShowFnbAddNewButton(true);
        break;
      }
      default:
        break;
    }
  }

  const renderPaymentMethods = () => {
    const renderEnterpriseMethods = () => {
      return (
        <DragDropContext
          onDragEnd={(list) => onDragEnd(list, paymentMethodTypeEnum.enterprise)}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="list-enterprise-method"
              >
                {enterprisePaymentMethods?.map((method, index) => {
                  const config = method?.paymentConfigs[0];
                  const currentSelected = selectedPaymentMethod?.id === method?.id ? "active" : "";
                  const switchOn = config?.isActivated;
                  return (
                    <Draggable key={method.id} draggableId={method.id} index={index}>
                      {(provided) => (
                        <Row className={`mt-4 pointer ${currentSelected}`} onClick={() => setSelectedPaymentMethod(method)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                           <Col span={19} className="col-title">
                              <DragIcon className="title-center drag-icon" width={40} height={40}/>
                              <Image className={`title-center title-image ${switchOn ? "" : "disable"}`} 
                                preview={false} width={88} height={88} src={method?.icon} 
                                fallback={icons.paymentDefaultIcon} />
                              <div className="ml-3 title-center">
                                <h3>{t(method?.name)}</h3>
                                { method?.enumId != paymentMethod.Cash && <span className="tag-enterprise">{pageData.tagEnterprise}</span> } 
                              </div>            
                           </Col>
                           <Col span={5} className="col-switch">
                             <Switch
                               className="float-right"
                               size="default"
                               checked={switchOn}
                               onChange={(value) => {
                                 onActivePaymentMethod(method, value);
                               }}
                             />
                           </Col>
                           { (isMobieSize && selectedPaymentMethod?.id == method.id) && 
                             <Col sm={12} md={16} className="payment-method-setting">
                               <Col span={24} className="p-0 ml-md-2 payment-config">
                                 { renderPaymentConfig()}
                               </Col>
                             </Col>
                           }  
                        </Row>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    };

    const renderPersonalMethods = () => {
      return (
        personalPaymentMethods?.length <= 0 ? 
        <h3 className="ml-3 title-center method-title method-empty">{pageData.personalPaymentMethodEmpty}</h3>
        : <DragDropContext
          onDragEnd={(list) => onDragEnd(list, paymentMethodTypeEnum.personal)}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="list-personal-method"
              >
                {personalPaymentMethods?.map((method, index) => {
                  method.enumId = paymentMethod.Personal;
                  const currentSelected = selectedPaymentMethod?.id === method?.id ? "active" : "";
                  const switchOn = method?.isActive;
                  return (
                    <Draggable key={method.id} draggableId={method.id} index={index}>
                      {(provided) => (
                        <Row className={`ml-0 mt-4 mb-4 pointer ${currentSelected}`} onClick={() => setSelectedPaymentMethod(method)} draggable
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                          <Col span={19} className="col-title">
                            <DragIcon className="title-center drag-icon" width={40} height={40}/>
                            <Image className={`title-center title-image ${switchOn ? "" : "disable"}`} 
                              preview={false} width={88} height={88} src={method?.logo} fallback={icons.paymentDefaultIcon} />
                            { method?.name?.length > maxLengthNamePersonalMethod ? 
                              <Tooltip placement="top" className="custom-width-tooltip" title={t(method?.name)}>
                                <h3 className="ml-3 title-center method-title">{t(method?.name)}</h3>
                              </Tooltip> : 
                              <h3 className="ml-3 title-center method-title">{t(method?.name)}</h3> }
                          </Col>
                          <Col span={5} className="col-switch">
                            <Switch
                              className="switch"
                              size="default"
                              checked={switchOn}
                              onChange={(value) => {
                                onClickSwitchPersonal(method, value);
                              }}
                            />
                          </Col>
                          {(isMobieSize && selectedPaymentMethod?.id == method.id) &&
                            <Col sm={12} md={16} className="payment-method-setting">
                              <Col span={24} className="p-0 ml-md-2 payment-config">
                                {renderPaymentConfig()}
                              </Col>
                            </Col>
                          }
                        </Row>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    }   

    return (
      <div className="payment-methods-config-container">
        {
          isMobieSize ?
            <>
              {activeScreen == paymentMethodTypeEnum.personal ? renderPersonalMethods() : renderEnterpriseMethods()}
            </>
            :
            <>
              <Collapse defaultActiveKey={[paymentMethodTypeEnum.enterprise.toString()]} className="fnb-collapse" accordion
                onChange={(key) => onChangeCollapse(key)}>
                <Collapse.Panel key={paymentMethodTypeEnum.enterprise}
                  header={<div className="collapse-dropdown">
                    <EnterprisePaymentMethodIcon width={35} height={35}
                      className="icon-collapse-dropdown" />
                    <span>{pageData.enterprisePaymentMethod}</span>
                    <Tooltip placement="top" className="custom-width-tooltip" 
                      title={ 
                        <div className="tooltip-title" dangerouslySetInnerHTML={{ __html: pageData.tooltipEnterprise }}></div>
                      }>
                      <InfoCircleFlashSaleIcon width={24} height={24} />
                    </Tooltip>
                  </div>} forceRender={true} >
                  <div>{renderEnterpriseMethods()}</div>
                </Collapse.Panel>
                <Collapse.Panel key={paymentMethodTypeEnum.personal}
                  header={<div className="collapse-dropdown">
                    <PersonalPaymentMethodIcon width={35} height={35}
                      className="icon-collapse-dropdown" />
                    <span>{pageData.personalPaymentMethod}</span>
                    <Tooltip placement="top" className="custom-width-tooltip" 
                      title={
                        <div className="tooltip-title" dangerouslySetInnerHTML={{ __html: pageData.tooltipPersonal }}></div>
                      }>
                      <InfoCircleFlashSaleIcon width={24} height={24} />
                    </Tooltip>
                  </div>} forceRender={true} >
                  <div>{renderPersonalMethods()}</div>
                </Collapse.Panel>
              </Collapse>
            </>
        }
      </div>
    );
  };

  const renderPaymentConfig = () => {
    let paymentConfigComponent =  <Row className="default-payment-config">
                                    <div className="content">
                                      <NoDataFoundComponent />  
                                    </div>
                                  </Row>;
    switch (selectedPaymentMethod?.enumId) {
      case paymentMethod.MoMo:
        paymentConfigComponent = (
          <MoMoPaymentConfigComponent
            onCompleted={() => {
              let newSelectedPaymentMethod = selectedPaymentMethod;
              if(newSelectedPaymentMethod.paymentConfigs[0]){
                newSelectedPaymentMethod.paymentConfigs[0].isActivated = true;
                setSelectedPaymentMethod(newSelectedPaymentMethod);
              }              
              getInitData();
            }}
            initData={selectedPaymentMethod}
          />
        );
        break;
      case paymentMethod.ZaloPay:
        /// TODO: Implement ZaloPay payment config component
        break;
      case paymentMethod.CreditDebitCard:
        paymentConfigComponent = (
          <VisaMasterPaymentConfigComponent
            onCompleted={() => {
              getInitData();
            }}
            initData={selectedPaymentMethod}
          />
        );
        break;
      case paymentMethod.Cash:
        /// TODO: Implement cash payment config component
        paymentConfigComponent =
          <CashPaymentConfigComponent
            initData={selectedPaymentMethod}
          />;
        break;
      case paymentMethod.VNPay:
        paymentConfigComponent = (
          <VNPayPaymentConfigComponent
            onCompleted={() => {
              getInitData();
            }}
            initData={selectedPaymentMethod}
          />
        );
        break;
      case paymentMethod.BankTransfer:
        paymentConfigComponent = (
          <BankTransferPaymentConfigComponent
            initData={selectedPaymentMethod}
          />
        );
        break;
      case paymentMethod.Personal:
        paymentConfigComponent = (
          <PersonalPaymentConfigComponent
            onCompleted={() => {
              getInitData(false, true);         
            }}
            namePaymentMethods={namePaymentMethods.filter(name => name != selectedPaymentMethod.name)}
            initData={selectedPaymentMethod}
          />
        );
        break;
      default:
        break;
    }

    return (
      <div className="component-payment-config">
        { !isMobieSize && renderPaymentConfigHeader()}
        <Col className="payment-method-content mt-4 p-4">
          {paymentConfigComponent}         
        </Col>        
      </div>
    );
  };

  const renderPaymentConfigHeader = () => {
    return (
      <Row className="payment-method-name p-4">
          <span className="title">{t(selectedPaymentMethodTypeName)}</span>
          { isShowFnbAddNewButton && 
            <FnbAddNewButton className="button-new-method" 
              onClick={() => setShowAddNewMethodForm(true)}
              text={pageData.addNewMethodButton} 
            />
          } 
        </Row>
    )
  }

  const renderDialog = () => {
    if (showAddNewMethodForm) {
      return (<NewMethodDialogComponent isModalVisible={showAddNewMethodForm} 
        namePaymentMethods={ namePaymentMethods } 
          handleCancel={() => handleCancelDialog()} handleSuccess={() => handleSuccessDialog()} />);
    }
    else {
      return (<></>);
    }
  }

  const handleCancelDialog = () => {
    setShowAddNewMethodForm(false);  
  }

  const handleSuccessDialog = () => {
    getInitData();
    handleCancelDialog();  
  }
  
  const onChangeTab = (key) => {
    onChangeCollapse(key);
    setActiveScreen(key);
  }

  const renderTagName = (screen) => {
    return (
      <>
        <Tooltip placement="top" className="custom-width-tooltip" 
          title={<div className="tooltip-title" dangerouslySetInnerHTML={{ __html: screen.tooltip }}></div>}>
          {screen?.name}
        </Tooltip>
        <InfoCircleFlashSaleIcon className="ml-2" width={24} height={24} />
      </>
    );
  }

  return (
    <>
      <Row gutter={[18, { xs: 8, sm: 24, md: 24, lg: 32 }]} className="payment-method">
        {isMobieSize ?
          <>
            <Tabs defaultActiveKey={paymentMethodTypeEnum.enterprise} className="transaction-report-tabs" onChange={(key) => onChangeTab(key)}>
              {screens?.map((screen) => {
                return <TabPane tab={renderTagName(screen)} key={screen.key}></TabPane>;
              })}
            </Tabs>
            <Col sm={12} md={8} className="payment-method-choice h-100">
              {renderPaymentConfigHeader()}
              {renderPaymentMethods()}
            </Col>
          </>
          :
          <>
            <Col sm={12} md={8} className="payment-method-choice h-100">
              {renderPaymentMethods()}
            </Col>
            <Col sm={12} md={16} className="payment-method-setting">
              <Col span={24} className="p-0 ml-md-2 payment-config">
                {renderPaymentConfig()}
              </Col>
            </Col>
          </>
        }
      </Row>
      {renderDialog()}
      <FnbNotifyDialog
        className="notify-dialog"
        title={pageData.notificationTitle}
        open={isModalNotificationVisible}
        okText={pageData.button.stop}
        cancelText={pageData.button.ignore}
        onOk={() => {
          onActivePersonalPaymentMethod(selectedPaymentMethod ,false);
          setIsModalNotificationVisible(false);
        }}
        onCancel={() => {
          setIsModalNotificationVisible(false);
        }}
        content={() => {
          return (
            <>
              <div
                className="text-content-notification-product-dependencies"
                dangerouslySetInnerHTML={{
                  __html: pageData.notificationMessage,
                }}
              />
            </>
          );
        }}
      />
    </>
  );
}
