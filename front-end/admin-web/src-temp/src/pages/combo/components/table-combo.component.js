import React from "react";
import { List } from "antd";
export default function BranchComboDetail(props) {
  const { branchDetail } = props;

  return (
    <>
      {branchDetail && branchDetail.length > 0 && (
        <List
          size="large"
          bordered
          dataSource={branchDetail}
          renderItem={(item) => <List.Item>{item?.branch?.name}</List.Item>}
        />
      )}
    </>
  );
}
