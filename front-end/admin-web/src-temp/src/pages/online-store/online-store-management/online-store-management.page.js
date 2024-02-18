import { Button, Card, Col, Image, message, Modal, Row, Space } from "antd";
import OnlineStoreBackground from "assets/images/online-store-background.png";
import PageTitle from "components/page-title";
import { BackIcon } from "constants/icons.constants";
import { EnumStoreThemeStatus } from "constants/store-theme.constants";
import { DateFormat } from "constants/string.constants";
import onlineStoreDataService from "data-services/online-store/online-store-data.service";
import storeDataService from "data-services/store/store-data.service";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { getThemeThumbnail } from "services/theme.service";
import { convertUtcToLocalTime } from "utils/helpers";
import { default as allOriginalThemes } from "../../theme-customize/themes";
import { StoreThemeList } from "./components/store-theme-list.component";
import "./online-store-management.scss";

export default function OnlineStoreManagementPage(props) {
  const [t] = useTranslation();
  const myThemeRef = useRef(null);
  const allThemes = allOriginalThemes;

  const pageData = {
    title: t("onlineStore.title"),
    selectTheme: t("onlineStore.selectTheme"),
    notSelectTheme: t("onlineStore.notSelectTheme"),
    theme: t("onlineStore.theme"),
    themeStore: t("onlineStore.themeStore"),
    currentTheme: t("onlineStore.currentTheme"),
    themeDetail: t("onlineStore.themeDetail"),
    apply: t("onlineStore.apply"),
    preview: t("onlineStore.preview"),
    includesSupport: t("onlineStore.includesSupport"),
    add: t("button.apply"),
    addThemeSuccess: t("onlineStore.addThemeSuccess"),
    customize: t("onlineStore.myTheme.button.customize"),
    lastSave: t("onlineStore.myTheme.lastSave"),
    publishFailMessage: t("theme.publish.failMessage", "Publish website failed, please try again after few minutes!"),
  };

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleDetail, setIsModalVisibleDetail] = useState(false);
  const [themes, setThemes] = useState([]);
  const [selectTheme, setSelectTheme] = useState({});
  const [currentTheme, setCurrentTheme] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await getListMyThemes();
    };

    fetchData();
  }, []);

  const getListMyThemes = async () => {
    const res = await onlineStoreDataService.getStoreThemesAsync();
    const themeData = res.storeThemes;
    const activeTheme = themeData.find((themeData) => themeData.isPublished === true);
    setCurrentTheme(activeTheme);
    const result = themeData.filter((themeData) => themeData.isPublished === false);
    if (result) {
      const storeThemes = result;

      ///Check if have theme is publishing
      let isCurrentThemePublishing = false;
      themeData?.forEach((item) => {
        if (item.statusId === EnumStoreThemeStatus.Publishing) {
          isCurrentThemePublishing = true;
        }
      });

      if (myThemeRef && myThemeRef.current) {
        myThemeRef.current.setMyThemeData(storeThemes, isCurrentThemePublishing);
      }
    }

    if (res?.isPublishedFailed === true) {
      message.error(pageData.publishFailMessage);
    }
  };

  const onShowThemes = async () => {
    setThemes([]);
    const data = await storeDataService.getThemesAsync();
    const listThemes = data.themes?.map((t) => {
      return {
        ...t,
        thumbnail: getThemeThumbnail(t?.id),
      };
    });
    setThemes(listThemes);
    setIsModalVisible(true);
  };

  const onShowDetailTheme = async (id) => {
    var theme = themes.find((x) => x.id === id);
    setSelectTheme(theme);
    setIsModalVisibleDetail(true);
  };

  const onClickAddTheme = async (id) => {
    const themeInfo = allThemes.find((theme) => theme.themeData.id.toLowerCase() === id.toLowerCase());
    let request = {
      themeId: id,
      configuration: JSON.stringify(themeInfo.defaultConfig),
    };

    const res = await onlineStoreDataService.createStoreThemeAsync(request);
    if (res) {
      message.success(pageData.addThemeSuccess);
      setIsModalVisible(false);
      setIsModalVisibleDetail(false);
      getListMyThemes();
    }
  };

  const formatCreateTime = (createdTime) => {
    let timeFormat = "-";
    const d = new Date();
    let day = d.getDate();

    if (createdTime) {
      const utcDate = moment.utc(createdTime).local().date();

      // If day is today, show time only
      if (day === utcDate) {
        timeFormat = convertUtcToLocalTime(createdTime).format(DateFormat.HH_MM);
      } else {
        timeFormat = convertUtcToLocalTime(createdTime).format(DateFormat.DD_MM_YYYY);
      }
    }

    return timeFormat;
  };

  return (
    <>
      <div className="online-store-management">
        <Row className="fnb-row-page-header">
          <Col span={24}>
            <Space className="page-title">
              <PageTitle content={pageData.title} />
            </Space>
          </Col>
        </Row>
        {isTabletOrMobile ? (
          <Card className="online-store-card-mobile">
            <Col span={12}>
              <div className="title">{pageData.theme}</div>
            </Col>
          </Card>
        ) : (
          <Card className="online-store-card">
            <Col span={12}>
              <div className="title">{pageData.theme}</div>
            </Col>
          </Card>
        )}

        <Card className="online-store-card-main">
          {isTabletOrMobile ? (
            currentTheme ? (
              <>
                <Row>
                  <Col span={24}>
                    <p className="current-theme-name-mobile">{currentTheme.name}</p>
                    <img className="img-prop-mobile" src={getThemeThumbnail(currentTheme?.themeId)} alt="" />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="title-mobile">
                      <p>{pageData.currentTheme}</p>
                      <p className="text-time-mobile mb-0">
                        <span>{pageData.lastSave}:</span>
                        <span className="ml-2">
                          {formatCreateTime(
                            currentTheme?.lastSavedTime ? currentTheme?.lastSavedTime : currentTheme?.createdTime
                          )}
                        </span>
                      </p>
                      <a href={`/online-store/theme-customize/${currentTheme?.id}`} target="_blank" rel="noreferrer">
                        <Button className="btn-customize mw-0" type="primary" htmlType="button">
                          {pageData.customize}
                        </Button>
                      </a>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col span={24}>
                    <Image className="img-prop-mobile" src={OnlineStoreBackground} preview={false} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="title-mobile">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: pageData.notSelectTheme,
                        }}
                      ></p>
                      <Button
                        type="primary"
                        className="btn-select-mobile"
                        htmlType="submit"
                        onClick={() => onShowThemes(true)}
                      >
                        {pageData.selectTheme}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </>
            )
          ) : currentTheme ? (
            <>
              <Row>
                <Col span={8}>
                  <div className="title-current">
                    <p>{pageData.currentTheme}</p>
                    <p className="text-time mb-0">
                      <span>{pageData.lastSave}:</span>
                      <span className="ml-2">{formatCreateTime(currentTheme?.createdTime)}</span>
                    </p>
                    <a href={`/online-store/theme-customize/${currentTheme?.id}`} target="_blank" rel="noreferrer">
                      <Button className="btn-customize mw-0" type="primary" htmlType="button">
                        {pageData.customize}
                      </Button>
                    </a>
                  </div>
                </Col>
                <Col span={16}>
                  <div className="img-current-theme-card">
                    <div className="img-current-theme-container">
                      <p className="current-theme-name">{currentTheme.name}</p>
                      <Image
                        className="img-prop-current"
                        src={getThemeThumbnail(currentTheme?.themeId)}
                        preview={false}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row>
                <Col span={12}>
                  <div className="title">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: pageData.notSelectTheme,
                      }}
                    ></p>
                    <Button type="primary" className="btn-select" htmlType="submit" onClick={() => onShowThemes(true)}>
                      {pageData.selectTheme}
                    </Button>
                  </div>
                </Col>
                <Col span={12} className="img-back-ground">
                  <Image className="img-prop" src={OnlineStoreBackground} preview={false} />
                </Col>
              </Row>
            </>
          )}
        </Card>
      </div>

      {/* My theme list */}
      <StoreThemeList ref={myThemeRef} addNewTheme={() => onShowThemes(true)} updateCurrentTheme={getListMyThemes} />

      {/* Modal */}
      <Modal
        onCancel={() => setIsModalVisible(false)}
        className={isTabletOrMobile ? "online-store-modal-mobile" : "online-store-modal"}
        width={1416}
        visible={isModalVisible}
        footer={(null, null)}
      >
        <Row className="online-store-header">
          <h3>{pageData.themeStore}</h3>
        </Row>
        <hr />
        <div className="online-store-list">
          {
            <div className={isTabletOrMobile ? "online-store-wrapper-mobile" : "online-store-wrapper"}>
              {
                <>
                  {themes?.map((theme) => {
                    return (
                      <div className="order-content-card">
                        <div className="order-content-header">
                          <img className="theme-card" src={theme?.thumbnail} alt="" />
                        </div>
                        <div className="order-content" onClick={() => onShowDetailTheme(theme?.id)}>
                          <Row>
                            <p className="title-theme">{theme?.name}</p>
                            {theme?.isDefault && <div className="default-theme">{pageData.currentTheme}</div>}
                          </Row>
                          <Row className="tag-margin">
                            {theme?.tags?.split(",").map((tag) => {
                              return <p className="material-view-branch-select material-view-text">{t(tag)}</p>;
                            })}
                          </Row>
                        </div>
                      </div>
                    );
                  })}
                </>
              }
            </div>
          }
        </div>
      </Modal>

      <Modal
        onCancel={() => setIsModalVisibleDetail(false)}
        className={isTabletOrMobile ? "online-store-modal-mobile" : "online-store-modal"}
        width={1416}
        visible={isModalVisibleDetail}
        footer={(null, null)}
      >
        <Row className="online-store-header">
          <h3>
            {!isTabletOrMobile && <BackIcon className="back-icon" onClick={() => setIsModalVisibleDetail(false)} />}
            {pageData.themeDetail}
          </h3>
        </Row>
        <hr />
        <div className="online-store-list">
          {isTabletOrMobile ? (
            <div className="online-store-wrapper-mobile">
              {
                <>
                  <div className="content-theme-detail-padding">
                    <Row>
                      <Col sm={24} xs={24} lg={14}>
                        <img width={350} height={213} src={selectTheme?.thumbnail} alt="" />
                      </Col>
                      <Col sm={24} xs={24} lg={10}>
                        <Row>
                          <div className="title-theme-detail">{selectTheme?.name}</div>
                        </Row>
                        <Row>
                          <Col span={24} className="content-theme-detail">
                            <div>
                              {t(selectTheme?.description)
                                .split("\n")
                                .map((item, key) => {
                                  return (
                                    <React.Fragment key={key}>
                                      {item}
                                      <br />
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24} className="title-theme-tag">
                            {pageData.includesSupport}
                          </Col>
                        </Row>
                        {selectTheme?.tags?.split(",").map((tag) => {
                          return (
                            <Row>
                              <Col span={24} className="theme-tag">
                                <ul style={{ listStyleType: "disc", paddingLeft: "24px" }}>
                                  <li>{`${t(tag)}`}</li>
                                </ul>
                              </Col>
                            </Row>
                          );
                        })}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <BackIcon className="back-icon" onClick={() => setIsModalVisibleDetail(false)} />
                        <a href={`/theme-preview/${selectTheme?.id}/home`} target="_blank" rel="noreferrer">
                          <Button
                            type="button"
                            className="btn-theme-detail-preview-theme"
                            onClick={() => setIsModalVisible(true)}
                          >
                            {pageData.preview}
                          </Button>
                        </a>
                        <Button
                          type="button"
                          className="btn-theme-detail-change-theme"
                          onClick={() => setIsModalVisible(true)}
                        >
                          {pageData.apply}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </>
              }
            </div>
          ) : (
            <div className="online-store-wrapper">
              {
                <>
                  <div className="content-theme-detail-padding">
                    <Row>
                      <Col span={14}>
                        <Image width={771} height={470} src={selectTheme?.thumbnail} preview={false} />
                      </Col>
                      <Col span={10} className="info-theme-detail">
                        <Row className="title-theme-detail">
                          <div>{selectTheme?.name}</div>
                        </Row>
                        <Row>
                          <Col span={24} className="content-theme-detail">
                            <div>
                              {t(selectTheme?.description)
                                .split("\n")
                                .map((item, key) => {
                                  return (
                                    <React.Fragment key={key}>
                                      {item}
                                      <br />
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24} className="title-theme-tag">
                            {pageData.includesSupport}
                          </Col>
                        </Row>
                        {selectTheme?.tags?.split(",").map((tag) => {
                          return (
                            <Row>
                              <Col span={24} className="theme-tag">
                                <ul style={{ listStyleType: "disc", paddingLeft: "36px" }}>
                                  <li>{`${t(tag)}`}</li>
                                </ul>
                              </Col>
                            </Row>
                          );
                        })}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={14}>
                        <a href={`/theme-preview/${selectTheme?.id}/home`} target="_blank" rel="noreferrer">
                          <Button
                            type="button"
                            className="btn-theme-detail-preview-theme"
                            onClick={() => setIsModalVisible(true)}
                          >
                            {pageData.preview}
                          </Button>
                        </a>
                        <Button
                          type="button"
                          className="btn-theme-detail-change-theme"
                          onClick={() => onClickAddTheme(selectTheme?.id)}
                        >
                          {pageData.add}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </>
              }
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
