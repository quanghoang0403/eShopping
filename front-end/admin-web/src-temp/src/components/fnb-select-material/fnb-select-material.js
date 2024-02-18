import { Col, Row, Select, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { ImageMaterialDefault, SearchIcon } from "constants/icons.constants";
import { formatTextNumber } from "utils/helpers";
import "./fnb-select-material.scss";

const { Option } = Select;
const { Text } = Typography;

export default function FnbSelectMaterialComponent(props) {
  const { t, onChangeEvent, materialList, className, controlId, status } = props;

  const pageData = {
    searchMaterial: t("purchaseOrder.searchMaterial"),
    table: {
      inventory: t("table.inventory"),
    },
  };

  return (
    <>
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        value={null}
        placeholder={pageData.searchMaterial}
        showSearch
        onChange={onChangeEvent}
        className={`search-material-information ${className}`}
        suffixIcon=""
        filterOption={(input, option) => {
          const inputStr = input.removeVietnamese().trim().toLowerCase();
          return (
            option?.sku?.removeVietnamese().trim().toLowerCase().indexOf(inputStr) >= 0 ||
            option?.name?.removeVietnamese().trim().toLowerCase().indexOf(inputStr) >= 0
          );
        }}
        listHeight={500}
        placement="bottomLeft"
        id={controlId}
        status={status}
      >
        {materialList?.map((item) => (
          <Option key={item?.id} sku={item?.sku} name={item?.name} className="material-option-purchase-order">
            <Row>
              <Col xs={9} sm={9} md={9} lg={3}>
                {item?.thumbnail ? (
                  <div className="table-img-box">
                    <Thumbnail src={item?.thumbnail} width={80} height={80} />
                  </div>
                ) : (
                  <ImageMaterialDefault />
                )}
              </Col>
              <Col xs={0} sm={0} md={0} lg={21}>
                <Row className="group-information-material">
                  <Col span={16} className="item-information-material">
                    <Row>
                      <Col span={24} className="item-material-end text-bold">
                        <Text strong className="text-material-name">
                          <Paragraph
                            ellipsis={{
                              rows: 1,
                              tooltip: item?.name,
                            }}
                          >
                            {item?.name}
                          </Paragraph>
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className="item-material-start text-normal">
                        <Text>{item?.sku}</Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col offset={2} span={6} className="item-information-material">
                    <Row>
                      <Col span={24} className="item-material-end justify-right text-normal">
                        <Text>{pageData.table.inventory}:</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className="item-material-start justify-right text-bold">
                        <Text strong>{`${item?.quantity ? formatTextNumber(item?.quantity) : 0} (${
                          item?.unitName
                        })`}</Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs={15} sm={15} md={15} lg={0} style={{ textAlign: "left" }}>
                <Row align="middle" justify="start">
                  <Col span={24}>
                    <Text strong className="text-material-name">
                      <Paragraph
                        ellipsis={{
                          rows: 1,
                          tooltip: item?.name,
                        }}
                        className="title-detail-combo"
                      >
                        {item?.name}
                      </Paragraph>
                    </Text>
                  </Col>
                </Row>
                <Row align="middle" justify="start">
                  <Col span={24}>
                    <Text italic>{item?.sku}</Text>
                  </Col>
                </Row>
                <Row align="middle" justify="start" className="padding-top">
                  <Col span={24}>
                    <Text>{pageData.table.inventory}:</Text>
                  </Col>
                </Row>
                <Row align="middle" justify="start">
                  <Col span={24}>
                    <Text strong>{`${item?.quantity ? formatTextNumber(item?.quantity) : 0} (${item?.unitName})`}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Option>
        ))}
      </Select>
      <div className="icon-search-material">
        <SearchIcon />
      </div>
    </>
  );
}
