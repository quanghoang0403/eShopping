import { Modal } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import { EmailCampaignSendingStatus } from "constants/email-campaign.constants";
import { CloseModalPurpleIcon } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { formatDate, formatTextNumber } from "utils/helpers";
import "./view-email-campaign.style.scss";

export const EmailCampaignSendingDetailComponent = forwardRef((props, ref) => {
  const { t, emailCampaignDataService, showModalSendingDetail, onCancel } = props;
  const [dataSource, setDataSource] = useState([]);
  const [emailCampaignId, setEmailCampaignId] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useImperativeHandle(ref, () => ({
    fetchData(emailCampaignId) {
      setEmailCampaignId(emailCampaignId);
      fetchDataTableAsync(currentPageNumber, tableSettings.pageSize, emailCampaignId);
    },
  }));

  useEffect(() => {}, []);

  const fetchDataTableAsync = async (pageNumber, pageSize, emailCampaignId) => {
    const responseData = await emailCampaignDataService?.getEmailCampaignSendingDetailAsync(
      pageNumber,
      pageSize,
      emailCampaignId
    );

    if (responseData) {
      const { sendingDetails, total, pageNumber } = responseData;
      const records = sendingDetails?.map((item) => mappingRecordToColumns(item));
      setDataSource(records);
      setTotalRecords(total);
      setCurrentPageNumber(pageNumber);
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      email: item?.customerEmail,
      sendingStatus: item?.status,
      numberOfTimeSent: formatTextNumber(item?.numberOfTimeSent ?? 1),
      lastSendingTime: formatDate(item?.lastSendingTime, DateFormat.DD_MM_YYYY_HH_MM),
    };
  };

  const pageData = {
    no: t("table.no"),
    title: t("marketing.emailCampaign.sendingDetail.title"),
    email: t("marketing.emailCampaign.sendingDetail.email"),
    sendingStatus: t("marketing.emailCampaign.sendingDetail.sendingStatus"),
    lastSendingTime: t("marketing.emailCampaign.sendingDetail.lastSendingTime"),
    numberOfTimeSent: t("marketing.emailCampaign.sendingDetail.numberOfTimeSent"),
    successSent: t("marketing.emailCampaign.summary.successSent"),
    resentSuccessfully: t("marketing.emailCampaign.summary.resentSuccessfully"),
    failedSent: t("marketing.emailCampaign.summary.failedSent"),
  };

  const tableSettings = {
    page: currentPageNumber,
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: "index",
        key: "index",
        width: "102px",
      },
      {
        title: pageData.email,
        dataIndex: "email",
        key: "email",
        width: "398px",
      },
      {
        title: pageData.sendingStatus,
        dataIndex: "sendingStatus",
        key: "sendingStatus",
        width: "333px",
        render: (_, record) => {
          return (
            <>
              <div
                className={`badge-sending-status ${
                  record?.sendingStatus === EmailCampaignSendingStatus.Failed ? "status-failed" : "status-success"
                }`}
              >
                <span className="text-status">
                  {record?.sendingStatus === EmailCampaignSendingStatus.Failed
                    ? pageData.failedSent
                    : record?.sendingStatus === EmailCampaignSendingStatus.SuccessfullySent
                    ? pageData.successSent
                    : pageData.resentSuccessfully}
                </span>
              </div>
            </>
          );
        },
      },
      {
        title: pageData.numberOfTimeSent,
        dataIndex: "numberOfTimeSent",
        key: "numberOfTimeSent",
        width: "265px",
        render: (_, record) => {
          return <div className="text-center">{record?.numberOfTimeSent}</div>;
        },
      },
      {
        title: pageData.lastSendingTime,
        dataIndex: "lastSendingTime",
        key: "lastSendingTime",
        width: "217px",
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, emailCampaignId);
    },
  };

  return (
    <Modal
      width={1380}
      className="modal-sending-detail"
      open={showModalSendingDetail}
      closeIcon={<CloseModalPurpleIcon />}
      footer={(null, null)}
      onCancel={onCancel}
      forceRender={true}
      centered
    >
      <div className="title-container">
        <h3 className="modal-title mb-0">{pageData.title}</h3>
      </div>

      {/* Table sending detail */}
      <FnbTable
        className="table-sending-detail"
        columns={tableSettings.columns}
        dataSource={dataSource}
        onChangePage={tableSettings.onChangePage}
        pageSize={tableSettings.pageSize}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        scrollY={96 * 5}
      />
    </Modal>
  );
});
