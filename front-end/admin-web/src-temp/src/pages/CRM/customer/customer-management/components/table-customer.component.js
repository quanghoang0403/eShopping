import { Col, Form, Image, message, Row, Space } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { images } from "constants/images.constants";
import { OtherFoodyPlatformString } from "constants/other-foody-platform.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { EnDash } from "constants/string.constants";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import customerDataService from "data-services/customer/customer-data.service";
import membershipDataService from "data-services/membership/membership-data.service";
import storeDataService from "data-services/store/store-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link, useHistory } from "react-router-dom";
import { executeAfter, formatNumber } from "utils/helpers";
import { platformNames } from "../../../../../constants/platform.constants";
import FilterCustomer from "./filter-customer.component";
import "./index.scss";

export default function TableCustomer(props) {
  const [t] = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showPopover, setShowPopover] = useState(false);
  const [countFilter, setCountFilter] = useState(0);
  const [dataFilter, setDataFilter] = useState(null);
  const [keySearch, setKeySearch] = useState("");
  const clearFilterFunc = React.useRef(null);
  const history = useHistory();
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const [requestingPlatform, setIsRequestingPlatform] = useState(true);
  const [listPlatforms, setListPlatforms] = useState([]);
  const [listCustomerMembershipLevels, setListCustomerMembershipLevels] = useState([]);
  const [listCustomerSegmets, setListCustomerSegments] = useState([]);
  const [listTags, setListTags] = useState([]);
  const DEFAULT_PAGESIZE = 20;
  const DEFAULT_PAGENUMBER = 1;
  const DEFAULT_KEYSEARCH = "";
  const DEFAULT_ID_ALL = "";

  const pageData = {
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    searchPlaceholder: t("customer.searchbyNamePhone"),
    no: t("customer.no"),
    name: t("customer.name"),
    phone: t("customer.phone"),
    rank: t("customer.rank"),
    action: t("customer.action"),
    point: t("customer.point"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteCustomerMessage: t("customer.confirmDeleteCustomerMessage"),
    customerDeleteSuccess: t("customer.customerDeleteSuccess"),
    customerDeleteFail: t("customer.customerDeleteFail"),
    platform: t("platform.title"),
    filter: {
      title: t("customerManagement.filter.title"),
      all: t("customerManagement.filter.all"),
    },
  };

  const tableSettings = {
    pageSize: DEFAULT_PAGESIZE,
    columns: [
      {
        title: pageData.no,
        dataIndex: "index",
        key: "index",
        width: "10%",
        align: "center",
      },
      {
        title: pageData.name,
        dataIndex: "name",
        key: "name",
        width: "25%",
        className: "table-text-membership-name-overflow",
        render: (_, record) => {
          return (
            <div>
              <Link to={`/customer/detail/${record?.id}`}>
                <Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: record.name }}
                  color="#50429B"
                >
                  <a> {record.name}</a>
                </Paragraph>
              </Link>
            </div>
          );
        },
      },
      {
        title: pageData.phone,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: "16%",
      },
      {
        title: pageData.platform,
        dataIndex: "platformId",
        key: "platformId",
        width: "15%",
        render: (_, record) => {
          return <div className="platform-detail">{renderCustomerPlatform(record)}</div>;
        },
      },
      {
        title: pageData.rank,
        dataIndex: "rank",
        key: "rank",
        width: "27%",
        render: (_, record) => {
          if (!record?.rank && record?.point === EnDash) {
            return (
              <>
                <Row>
                  <Col span={24}>{EnDash}</Col>
                </Row>
              </>
            );
          } else {
            return (
              <>
                <Row className="membership-rank-margin">
                  <Col span={12}>
                    <span className="float-left membership-rank-title-margin">{pageData.rank}</span>
                  </Col>
                  <Col span={12}>
                    <p className="float-left membership-rank" style={{ background: record?.color }}>
                      {record?.rank}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span className="float-left">{pageData.point}</span>
                  </Col>
                  <Col span={12}>
                    <span className="float-left font-weight-700">{record?.point}</span>
                  </Col>
                </Row>
              </>
            );
          }
        },
      },
      {
        title: pageData.action,
        key: "action",
        width: "7%",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            {
              <EditButtonComponent
                className="mr-3"
                onClick={() => onEditItem(record)}
                permission={PermissionKeys.EDIT_CUSTOMER}
              />
            }
            {
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(record?.name)}
                okText={pageData.btnDelete}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.DELETE_CUSTOMER}
                onOk={() => handleDeleteItem(record.id)}
              />
            }
          </Space>
        ),
      },
    ],

    onSearch: async (value) => {
      executeAfter(500, async () => {
        setKeySearch(value);
        await fetchDatableAsync(1, tableSettings.pageSize, value, dataFilter);
      });
    },

    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, keySearch, dataFilter);
    },
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteCustomerMessage, { name: name });
    return mess;
  };

  const handleDeleteItem = async (id) => {
    await customerDataService.deleteCustomerByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.customerDeleteSuccess);
      } else {
        message.error(pageData.customerDeleteFail);
      }
    });
    await fetchDatableAsync(DEFAULT_PAGENUMBER, DEFAULT_PAGESIZE, keySearch, dataFilter);
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, DEFAULT_PAGESIZE, DEFAULT_KEYSEARCH);
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch, dataFilter = null) => {
    const response = await customerDataService.getCustomersAsync(
      keySearch,
      pageNumber,
      pageSize,
      dataFilter?.platformId ?? "",
      dataFilter?.customerMembershipId ?? "",
      dataFilter?.customerSegmentId ?? "",
      dataFilter?.tagIds ?? "",
    );
    const data = response?.customers?.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(pageNumber);
    setCountFilter(dataFilter?.count);
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      id: item?.id,
      name: item?.fullName,
      phoneNumber: item?.phoneNumber,
      point: item?.point === 0 ? EnDash : formatNumber(item?.point),
      rank: item?.rank,
      color: item?.color ?? "#efbb00",
      platformId: item?.platformId,
      otherCustomerPlatform: {
        id: item?.otherCustomerPlatform?.id,
        name: item?.otherCustomerPlatform?.name,
        logo: item?.otherCustomerPlatform?.logo,
        foodyPlatformId: item?.otherCustomerPlatform?.foodyPlatformId,
      },
    };
  };

  const onEditItem = (item) => {
    return history.push(`/customer/edit/${item?.id}`);
  };

  const getOtherCustomerPlatformIcon = (foodyPlatformId, foodyPlatformLogo) => {
    switch (foodyPlatformId) {
      case OtherFoodyPlatformString.GrabFood:
        return <Image preview={false} src={images.grabFoodLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.GoFood:
        return <Image preview={false} src={images.goFoodLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.BeFood:
        return <Image preview={false} src={images.beFoodLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.Baemin:
        return <Image preview={false} src={images.baeminLogo} style={{ width: 24, height: 24 }} />;
      case OtherFoodyPlatformString.ShopeeFood:
        return <Image preview={false} src={images.shopeeFoodLogo} style={{ width: 24, height: 24 }} />;
      default:
        if (foodyPlatformLogo) {
          return (
            <Image
              preview={false}
              src={foodyPlatformLogo ?? images.defaultFoodyPlatformLogo}
              style={{ width: 24, height: 24 }}
            />
          );
        }
        return <Image preview={false} src={images.defaultFoodyPlatformLogo} style={{ width: 24, height: 24 }} />;
    }
  };

  const renderCustomerPlatform = (data) => {
    if (data?.platformId) {
      var platform = platformNames.find((obj) => obj.id?.toLowerCase() === data.platformId?.toLowerCase());
      return (
        <>
          {platform?.icon}
          <span>{platform?.name}</span>
        </>
      );
    } else {
      if (data?.otherCustomerPlatform) {
        return (
          <>
            {getOtherCustomerPlatformIcon(
              data?.otherCustomerPlatform?.foodyPlatformId?.toLowerCase(),
              data?.otherCustomerPlatform?.logo,
            )}
            <span>{data?.otherCustomerPlatform?.name}</span>
          </>
        );
      }
      return null;
    }
  };

  /* Filter Region */
  const [requestingCustomerMembership, setRequestingCustomerMembership] = useState(false);
  const [paginationCustomerMembership, setPaginationCustomerMembership] = useState({
    pageSize: DEFAULT_PAGESIZE,
    pageNumber: DEFAULT_PAGENUMBER,
  });
  const [isLoadDoneMembership, setIsLoadDoneMembership] = useState(false);

  const [requestingCustomerSegment, setRequestingCustomerSegment] = useState(false);
  const [paginationCustomerSegment, setPaginationCustomerSegment] = useState({
    pageSize: DEFAULT_PAGESIZE,
    pageNumber: DEFAULT_PAGENUMBER,
    keySearch: DEFAULT_KEYSEARCH,
  });
  const [isLoadDoneCustomerSegment, setIsLoadDoneCustomerSegment] = useState(false);

  const [all, setAll] = useState(pageData.filter.all);

  const getListCustomerSegment = async (pagination, isLoadmore = false) => {
    setRequestingCustomerSegment(true);
    setPaginationCustomerSegment(pagination);
    const resSegments = await customerSegmentDataService.getCustomerSegmentsAsync(
      pagination.pageNumber,
      pagination.pageSize,
      pagination.keySearch,
    );
    if (resSegments) {
      if (isLoadmore) {
        setListCustomerSegments([...listCustomerSegmets, ...resSegments.customerSegments]);
      } else {
        setListCustomerSegments(resSegments.customerSegments);
      }
      if (resSegments.customerSegments.length < DEFAULT_PAGESIZE) {
        setIsLoadDoneCustomerSegment(true);
      } else {
        setIsLoadDoneCustomerSegment(false);
      }
    }
    setRequestingCustomerSegment(false);
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
      if (listPlatforms.length === 0) {
        setIsRequestingPlatform(true);
        const resPlatforms = await storeDataService.getAllPlatformActivatedAsync();
        if (resPlatforms) {
          setListPlatforms([
            {
              id: DEFAULT_ID_ALL,
              name: pageData.filter.all,
            },
            ...resPlatforms.platforms,
          ]);
          setIsRequestingPlatform(false);
        }
      }

      if (listCustomerMembershipLevels.length == 0) {
        setPaginationCustomerMembership({
          ...paginationCustomerMembership,
          pageNumber: DEFAULT_PAGENUMBER,
        });
        const resMemeberShipLevels = await membershipDataService.getMembershipsAsync(
          DEFAULT_PAGENUMBER,
          DEFAULT_PAGESIZE,
        );
        if (resMemeberShipLevels) {
          setListCustomerMembershipLevels([
            {
              id: DEFAULT_ID_ALL,
              name: pageData.filter.all,
            },
            ...resMemeberShipLevels.customerMemberships,
          ]);

          if (resMemeberShipLevels.customerMemberships.length < DEFAULT_PAGESIZE) {
            setIsLoadDoneMembership(true);
          }
        }
      } else {
        // Reload language when component render
        if (pageData.filter.all !== all) {
          setAll(pageData.filter.all);
          if (listCustomerMembershipLevels.length > 0) {
            setListCustomerMembershipLevels((prev) =>
              prev.map((item) => {
                if (item.id === DEFAULT_ID_ALL) return { ...item, name: pageData.filter.all };
                return item;
              }),
            );
          }
          if (listPlatforms.length > 0) {
            setListPlatforms((prev) =>
              prev.map((item) => {
                if (item.id === DEFAULT_ID_ALL) return { ...item, name: pageData.filter.all };
                return item;
              }),
            );
          }
        }
      }

      if (listCustomerSegmets.length === 0) {
        await getListCustomerSegment({
          pageSize: DEFAULT_PAGESIZE,
          pageNumber: DEFAULT_PAGENUMBER,
          keySearch: DEFAULT_KEYSEARCH,
        });
      }

      if (listTags.length === 0) {
        const resTags = await customerDataService.getCustomerTagAsync();
        if (resTags) {
          setListTags(resTags.tags);
        }
      }

      if (isMobile) {
        window.scrollTo(0, 0);
      }
    }
  };

  const onClearFilter = (_e) => {
    if (clearFilterFunc.current) {
      clearFilterFunc.current();
      setShowPopover(false);
    } else {
      setCountFilter(0);
      setShowPopover(false);
      setDataFilter(null);
      fetchDatableAsync(DEFAULT_PAGENUMBER, DEFAULT_PAGESIZE, keySearch, null);
    }
  };

  const onCloseFilter = () => {
    setShowPopover(false);
  };

  const handleScrollDownCustomerMembership = async (event) => {
    var target = event.target;
    if (
      !requestingCustomerMembership &&
      target.scrollTop + target.offsetHeight === target.scrollHeight &&
      !isLoadDoneMembership
    ) {
      setRequestingCustomerMembership(true);
      const newPagination = {
        ...paginationCustomerMembership,
        pageNumber: paginationCustomerMembership.pageNumber + 1,
      };
      setPaginationCustomerMembership(newPagination);

      const resMemeberShipLevels = await membershipDataService.getMembershipsAsync(
        newPagination.pageNumber,
        newPagination.pageSize,
      );
      if (resMemeberShipLevels) {
        setListCustomerMembershipLevels([...listCustomerMembershipLevels, ...resMemeberShipLevels.customerMemberships]);
        if (resMemeberShipLevels.customerMemberships.length < DEFAULT_PAGESIZE) {
          setIsLoadDoneMembership(true);
        }
      }

      setRequestingCustomerMembership(false);
    }
  };

  const handleScrollDownCustomerSegment = async (event) => {
    var target = event.target;
    if (
      !requestingCustomerSegment &&
      target.scrollTop + target.offsetHeight === target.scrollHeight &&
      !isLoadDoneCustomerSegment
    ) {
      await getListCustomerSegment(
        {
          ...paginationCustomerSegment,
          pageNumber: paginationCustomerSegment.pageNumber + 1,
        },
        true,
      );
    }
  };

  const typingSegmentTimeoutRef = React.useRef(null);

  const onSearchCustomerSegment = async (val) => {
    if (typingSegmentTimeoutRef.current) {
      clearTimeout(typingSegmentTimeoutRef.current);
    }
    typingSegmentTimeoutRef.current = setTimeout(async () => {
      await getListCustomerSegment({
        pageSize: DEFAULT_PAGESIZE,
        pageNumber: DEFAULT_PAGENUMBER,
        keySearch: val,
      });
    }, 600);
  };

  const onClearCustomerSegment = async () => {
    await getListCustomerSegment({
      pageSize: DEFAULT_PAGESIZE,
      pageNumber: DEFAULT_PAGENUMBER,
      keySearch: DEFAULT_KEYSEARCH,
    });
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterCustomer
          tableFuncs={clearFilterFunc}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
          handleFilterCustomer={fetchDatableAsync}
          keySearch={keySearch}
          pageSize={tableSettings.pageSize}
          onCloseFilter={onCloseFilter}
          requestingPlatform={requestingPlatform}
          listPlatforms={listPlatforms}
          listCustomerMembershipLevels={listCustomerMembershipLevels}
          setListCustomerMembershipLevels={setListCustomerMembershipLevels}
          listCustomerSegmets={listCustomerSegmets}
          listTags={listTags}
          handleScrollDownCustomerMembership={handleScrollDownCustomerMembership}
          handleScrollDownCustomerSegment={handleScrollDownCustomerSegment}
          onSearchCustomerSegment={onSearchCustomerSegment}
          onClearCustomerSegment={onClearCustomerSegment}
        />
      )
    );
  };
  /* End Filter Region */
  return (
    <>
      <Form className="form-staff form-filter-customer-manager">
        <Row>
          <FnbTable
            className="mt-4"
            columns={tableSettings.columns}
            pageSize={tableSettings.pageSize}
            dataSource={dataSource}
            currentPageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableSettings.onChangePage}
            search={{
              placeholder: pageData.searchPlaceholder,
              onChange: tableSettings.onSearch,
            }}
            editPermission={PermissionKeys.EDIT_CUSTOMER}
            deletePermission={PermissionKeys.DELETE_CUSTOMER}
            filter={{
              onClickFilterButton: onClickFilterButton,
              totalFilterSelected: countFilter,
              onClearFilter: onClearFilter,
              buttonTitle: pageData.filter.title,
              component: filterComponent(),
              filterClassName: "popover-filter-customer-manager",
              showPopover: isMobile && showPopover,
            }}
          />
        </Row>
      </Form>
    </>
  );
}
