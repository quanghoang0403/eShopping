import React from "react";
import { Table, Button, message } from "antd";
import Flags from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function TableLanguageConfig(props) {
  const { languageDataService, initDataTable } = props;
  const { t } = useTranslation();
  const languageSession = useSelector(state => state.session?.languageSession);

  const pageData = {
    languages: t("languageConfig.languages"),
    publish: t("languageConfig.publish"),
    unpublish: t("languageConfig.unpublish"),
    updateSuccess: t("messages.updateSuccess"),
  };

  const onPublishItem = (record) => {
    languageDataService.updateIsPublishByIdAsync(record).then(res => {
      if (res) {
        message.success(pageData.updateSuccess);
        initDataTable();
      }
      if (window.reloadLang) {
        window.reloadLang();
      }
    });
  };

  const tableConfigs = [
    {
      title: pageData.languages,
      align: "left",
      dataIndex: "emoji",
      key: "emoji",
      width: "10%",
      colSpan: 3,
      render: (_, record) => {
        var Flag = Flags[record.emoji];
        return <Flag className="flag-icon" />;
      },
    },
    {
      dataIndex: "name",
      key: "name",
      width: "60%",
      colSpan: 0,
      render: (text, data) => {
        return <>{t(data.name)}</>;
      },
    },
    {
      dataIndex: "isPublishName",
      colSpan: 0,
      key: "isPublish",
      width: "30%",
      render: (isPublishName, record) => {
        if (!record.isDefault) {
          return (
            <Button
              className="width-120"
              type="primary"
              onClick={() => onPublishItem(record)}
              disabled={languageSession.default && record &&
                languageSession.default.name === record.name}
            >
              {t(isPublishName)}
            </Button>
          );
        }
      },
    },
  ];

  return (
    <Table
      className="form-table"
      columns={tableConfigs}
      dataSource={props.dataSource}
      pagination={false}
    ></Table>
  );
}
