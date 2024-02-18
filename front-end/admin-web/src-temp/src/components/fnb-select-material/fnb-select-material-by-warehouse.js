import { Col, Row, Select, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { ImageMaterialDefault, SearchIcon } from "constants/icons.constants";
import "./fnb-select-material.scss";

const { Option } = Select;
const { Text } = Typography;

export default function FnbSelectMaterialByWareHouseComponent(props) {
    const { t, onChangeEvent, materialList, className, controlId, status, fromWareHouseId } = props;

    const pageData = {
        searchMaterial: t("transferMaterial.searchMaterial"),
        table: {
            inventory: t("table.inventory"),
        },
    };

    const getValueQuantity = (item) => {
        let valueQuantity = 0;
        if (fromWareHouseId && item?.materialInventoryBranches) {
            const newRecordQuantity = item?.materialInventoryBranches.find(x => x?.branchId === fromWareHouseId);
            valueQuantity = newRecordQuantity ? newRecordQuantity?.quantity : 0;
        }
        return valueQuantity;
    }

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
                            <Col xs={0} sm={0} md={0} lg={3}>
                                {item?.thumbnail ? (
                                    <div className="table-img-box">
                                        <Thumbnail src={item?.thumbnail} width={80} height={80} />
                                    </div>
                                ) : (<ImageMaterialDefault width={80} height={80} />)}
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={0}>
                                {item?.thumbnail ? (
                                    <div className="table-img-box">
                                        <Thumbnail src={item?.thumbnail} width={44} height={44} />
                                    </div>
                                ) : (<ImageMaterialDefault width={44} height={44} />)}
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
                                                <Text strong>{`${getValueQuantity(item)} (${item?.unitName
                                                    })`}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={19} sm={19} md={19} lg={0}>
                                <Row className="group-information-material group-information-material-by-warehouse">
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
                                                <Text strong>{`${getValueQuantity(item)} (${item?.unitName
                                                    })`}</Text>
                                            </Col>
                                        </Row>
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
