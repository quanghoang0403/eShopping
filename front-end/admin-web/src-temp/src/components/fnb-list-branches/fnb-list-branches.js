import { Button, Col, Popover, Radio, Row, Typography } from "antd";
import { BranchIcon, DownIcon } from "constants/icons.constants";
import branchDataService from "data-services/branch/branch-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./fnb-list-branches.scss";

const { Text } = Typography;

export function FnbListBranches({ onChangeEvent, showAllBranch = true, initSelectedBranchId = null }) {
  const [t] = useTranslation();
  const [visible, setVisible] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState();
  const pageData = {
    allBranch: t("dashboard.allBranch"),
  };

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    getBranches();
  }, [initSelectedBranchId]);

  const getBranches = async () => {
    const branchesResponse = await branchDataService.getAllBranchsAsync();
    if (branchesResponse) {
      setBranches(branchesResponse.branchs);
      if (initSelectedBranchId) {
        handleInitSelectedBranch(branchesResponse.branchs);
      }
    }
  };

  const listBranch = (
    <>
      <Row className="branch-content">
        <Col span={24}>
          <Radio.Group onChange={(e) => handleChangeBranch(e)} className="group-branch">
            {showAllBranch ? (
              <Row>
                <Col span={24}>
                  <Radio.Button key={null} value={null} className="branch-option">
                    {pageData.allBranch}
                  </Radio.Button>
                </Col>
              </Row>
            ) : null}

            {branches?.map((item, index) => {
              return (
                <Row key={index}>
                  <Col span={24}>
                    <Radio.Button key={item?.id} value={item?.id} className="branch-option">
                      {item?.name}
                    </Radio.Button>
                  </Col>
                </Row>
              );
            })}
          </Radio.Group>
        </Col>
      </Row>
    </>
  );

  const handleChangeBranch = (e) => {
    let branchIdSelected = e?.target?.value;
    if (branchIdSelected !== null) {
      let branchInfo = branches.find((b) => b.id === branchIdSelected);
      setBranchName(branchInfo?.name);
    } else {
      branchIdSelected = "";
      setBranchName(null);
    }

    if (onChangeEvent) {
      onChangeEvent(branchIdSelected);
    }

    setVisible(false);
  };

  const handleInitSelectedBranch = (listBranches) => {
    if (initSelectedBranchId) {
      let branchInfo = listBranches.find((b) => b.id === initSelectedBranchId);
      setBranchName(branchInfo?.name);
      if (onChangeEvent) {
        onChangeEvent(initSelectedBranchId);
      }
      setVisible(false);
    }
  };

  return (
    <Popover
      placement="bottom"
      overlayClassName="dashboard-branch"
      content={listBranch}
      trigger="click"
      visible={visible}
      onVisibleChange={(isClick) => setVisible(isClick)}
      className="branch-popover"
    >
      <Button className="btn-branch">
        <Row>
          <Col span={22} className="div-branch-name">
            <div className="icon-branch">
              <BranchIcon />
            </div>
            <Text className="branch-name text-line-description-clamp-1">{branchName ?? pageData.allBranch}</Text>
          </Col>
          <Col span={2} className="div-icon-down">
            <DownIcon />
          </Col>
        </Row>
      </Button>
    </Popover>
  );
}
