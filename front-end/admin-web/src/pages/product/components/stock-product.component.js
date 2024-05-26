import React from 'react';
import { ShopTable } from 'components/shop-table/shop-table';
import { Checkbox, Input, Row, Col, Form, DatePicker, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { PermissionKeys } from 'constants/permission-key.constants';
import './stock-product.component.scss';
import { formatCurrency } from 'utils/helpers';
import { CalendarNewIconBold } from 'constants/icons.constants';
import moment from 'moment';
import { inputNumberRangeOneTo999999999 } from 'constants/default.constants';
import { currency } from 'constants/string.constants'
import { DateFormat } from "constants/string.constants";

export default function StockProductTable() {
    const sizes = [{ id: '1', name: 'S' }, { id: '2', name: 'M' }, { id: '3', name: 'L' }, { id: '4', name: 'XL' }, { id: '5', name: 'XXL' }, { id: '1', name: 'S' }, { id: '2', name: 'M' }, { id: '3', name: 'L' }, { id: '4', name: 'XL' }, { id: '5', name: 'XXL' }]
    const stockData = [
        {
            key: '1',
            name: 'Product Variant 1',
            isUseBasePrice: true,
            priceOriginal: 150000.00,
            priceValue: 140000.00,
            priceDiscount: 130000.00,
            startDate: '2023-01-01',
            endDate: '2023-01-31',
            Small: 10,
            Medium: 15,
            Large: 5,
        },
        {
            key: '2',
            name: 'Product Variant 2',
            isUseBasePrice: false,
            priceOriginal: 150000.00,
            priceValue: 140000.00,
            priceDiscount: 130000.00,
            startDate: '2023-02-01',
            endDate: '2023-02-28',
            Small: 8,
            Medium: 12,
            Large: 7,
        },
        {
            key: '3',
            name: 'Product Variant 3',
            isUseBasePrice: true,
            priceOriginal: 150000.00,
            priceValue: 140000.00,
            priceDiscount: 130000.00,
            startDate: '2023-03-01',
            endDate: '2023-03-31',
            Small: 6,
            Medium: 10,
            Large: 4,
        },
    ];
    const price = {
        priceOriginal: 150000.00,
        priceValue: 140000.00,
        priceDiscount: 130000.00,
        percentNumber: 0,
        startDate: moment(),
        endDate: moment().add(7, "days")
    }
    const { t } = useTranslation();
    const pageData = {
        pricing: {
            title: t('product.priceInfo'),
            discountCheck: t('product.labelDiscountCheck'),
            addPrice: t('product.addPrice'),
            price: {
                label: t('product.labelPrice'),
                placeholder: t('product.placeholderPrice'),
                required: true,
                max: 999999999,
                min: 0,
                format: '^[1-9]*$',
                validateMessage: t('product.validatePriceNegative'),
                validateMessageValue: t('product.validateOriginalOverPrice'),
                validateMessageDiscount: t('product.validateDiscountOverPrice')
            },
            priceOriginal: {
                label: t('product.labelPriceOriginal'),
                placeholder: t('product.placeholderPriceOriginal'),
                required: true,
                max: 999999999,
                min: 0,
                format: '^[0-9]*$',
                validateMessage: t('product.validatePriceNegative'),
                validateMessageValue: t('product.validateOriginalOverPrice')
            },
            priceDiscount: {
                numeric: {
                    label: t('product.labelPriceDiscount'),
                    placeholder: t('product.placeholderPriceDiscount'),
                    validateMessage: t('product.validateDiscountOverPrice')
                },
                percentage: {
                    label: t('product.labelPriceDiscountPercentage'),
                    placeholder: t('product.placeholderPriceDiscountPercentage'),
                    max: 100,
                    min: 0,
                    format: '^[0-9]*$',
                    validateMessage: t('product.validateDiscountPercentage')
                }
            },
            priceName: {
                label: t('product.labelPriceName'),
                placeholder: t('product.placeholderPriceName'),
                required: true,
                maxLength: 100,
                validateMessage: t('product.validatePriceName')
            },
            quantity: {
                sold: {
                    label: t('product.labelQuantitySold'),
                    placeholder: t('product.placeholderQuantitySold'),
                },
                remaining: {
                    label: t('product.labelQuantityLeft'),
                    placeholder: t('product.placeholderQuantityLeft'),
                    validateMessage: t('product.validateQuantity')
                }
            },
            priceDate: {
                startDate: {
                    label: t('product.startDate'),
                    placeholder: t('product.placeholderStartDate'),
                    validateMessage: t('product.validateStartDate')
                },
                endDate: {
                    label: t('product.endDate'),
                    placeholder: t('product.placeholderEndDate'),
                    validateMessage: t('product.validateEndDate')
                }
            }
        },
        productCategory: {
            label: t('product.labelCategory'),
            placeholder: t('product.placeholderCategory'),
            validateMessage: t('product.validateProductCategory')
        },
        productNameExisted: t('product.productNameExisted'),
        productAddedSuccess: t('product.productAddedSuccess'),
        mediaNotExisted: t('product.validateImage'),
        file: {
            uploadImage: t('file.uploadImage'),
            title: t('file.title'),
            textNonImage: t('file.textNonImage'),
            // addFromUrl: t('file.addFromUrl'),
            bestDisplayImage: t('file.bestDisplayImage'),
        },
        leaveDialog: {
            confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
            confirmLeaveContent: t('dialog.confirmLeaveContent'),
            confirmLeave: t('dialog.confirmLeave')
        },
        table: {
            name: t('table.name'),
            action: t('table.action')
        }
    }
    const tableSettings = {
        columns: [
            {
                title: "Biến thể",
                dataIndex: 'name',
                key: 'name',
                align: 'left',
                width: 100,
                render: (value) => <>{value}</>
            },
            {
                title: "Quản lý giá",
                align: 'center',
                children: [
                    {
                        title: 'Giá cơ sở',
                        dataIndex: 'isUseBasePrice',
                        key: 'isUseBasePrice',
                        align: 'center',
                        width: 50,
                        render: (value) => <Checkbox checked={value} />
                    },
                    {
                        title: 'Giá gốc',
                        dataIndex: 'priceOriginal',
                        key: 'priceOriginal',
                        align: 'center',
                        width: 100,
                    },
                    {
                        title: 'Giá bán',
                        dataIndex: 'priceValue',
                        key: 'priceValue',
                        align: 'center',
                        width: 100,
                    },
                    {
                        title: 'Giá khuyến mãi',
                        dataIndex: 'priceDiscount',
                        key: 'priceDiscount',
                        align: 'center',
                        width: 100,
                    },
                    {
                        title: 'Ngày bắt đầu',
                        dataIndex: 'startDate',
                        key: 'startDate',
                        align: 'center',
                        width: 100,
                    },
                    {
                        title: 'Ngày kết thúc',
                        dataIndex: 'endDate',
                        key: 'endDate',
                        align: 'center',
                        width: 100,
                    },
                ]
            },
            {
                title: "Quản lý tồn kho",
                align: 'center',
                children: sizes.map((size) => ({
                    title: size.name,
                    dataIndex: size.name,
                    key: size.id,
                    align: 'center',
                    width: 50,
                    render: (value) => <Input value={value} />
                }))
            }
        ],
        scroll: {
            x: 'max-content',
        },
    };

    const disabledDate = (current) => {
        // Can not select days before today
        return current && current < moment().startOf("day");
    };

    const disabledDateByStartDate = (current, price) => {
        // Can not select days before today and today
        return current && current < price.startDate;
    };

    return (
        <>
            <h4 className="title-group">{pageData.pricing.title}</h4>
            <Row className='mt-3' gutter={[8, 16]}>
                <Col xs={24} lg={3}>
                    <h3>
                        {pageData.pricing.priceOriginal.label}
                    </h3>
                </Col>
                <Col xs={24} lg={3}>
                    <h3>
                        {pageData.pricing.price.label}
                    </h3>
                </Col>
                <Col xs={24} lg={3}>
                    <h3>{pageData.pricing.priceDiscount.numeric.label}</h3>
                </Col>
                <Col xs={24} lg={5}>
                    <h3>{pageData.pricing.priceDiscount.percentage.label}</h3>
                </Col>
                <Col xs={24} lg={5}>
                    <h3>
                        {pageData.pricing.priceDate.startDate.label}
                    </h3>
                </Col>
                <Col xs={24} lg={5}>
                    <h3>
                        {pageData.pricing.priceDate.endDate.label}
                    </h3>
                </Col>
            </Row>
            <Row className='mt-3' gutter={[8, 16]}>
                <Col xs={24} lg={3}>
                    <Form.Item
                        name={['product', 'prices', 'priceOriginal']}
                        rules={[
                            {
                                required: true,
                                message: pageData.pricing.price.validateMessage
                            },
                            {
                                pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                                message: pageData.pricing.price.validateMessage
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value > getFieldValue(['product', 'prices', 'priceValue'])) {
                                        return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                                    }
                                    return Promise.resolve()
                                }
                            })
                        ]}
                    >

                        <InputNumber
                            className="shop-input-number w-100"
                            placeholder={pageData.pricing.priceOriginal.placeholder}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            addonAfter={currency}
                            precision={0}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault()
                                }
                            }}
                            id={`product-prices-${price.position}-price-original`}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} lg={3}>
                    <Form.Item
                        name={['product', 'prices', 'priceValue']}
                        rules={[
                            {
                                required: true,
                                message: pageData.pricing.price.validateMessage
                            },
                            {
                                pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                                message: pageData.pricing.price.validateMessage
                            },
                            ({ getFieldValue }) => (
                                {
                                    validator(_, value) {
                                        if (value < getFieldValue(['product', 'prices', 'priceDiscount'])) {
                                            return Promise.reject(new Error(pageData.pricing.priceDiscount.numeric.validateMessage))
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ),
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value < getFieldValue(['product', 'prices', 'priceOriginal'])) {
                                        return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                                    }
                                    return Promise.resolve()
                                }
                            })
                        ]}
                    >
                        <InputNumber
                            onChange={value => setPrices(p => p.map((pr, i) => i == index ? { ...pr, priceValue: value } : pr))}
                            className="shop-input-number w-100"
                            placeholder={pageData.pricing.price.placeholder}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            addonAfter={currency}
                            precision={0}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault()
                                }
                            }}
                            id={`product-prices-${price.position}-price`}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} lg={3}>
                    <Form.Item
                        name={['product', 'prices', 'priceDiscount']}
                        rules={[
                            {
                                required: true,
                                message: pageData.pricing.price.validateMessage
                            },
                            {
                                pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                                message: pageData.pricing.price.validateMessage
                            },
                            ({ getFieldValue }) => (
                                {
                                    validator(_, value) {
                                        if (value < getFieldValue(['product', 'prices', 'priceDiscount'])) {
                                            return Promise.reject(new Error(pageData.pricing.priceDiscount.numeric.validateMessage))
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ),
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value < getFieldValue(['product', 'prices', 'priceOriginal'])) {
                                        return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                                    }
                                    return Promise.resolve()
                                }
                            })
                        ]}
                    >
                        <InputNumber
                            onChange={value => setPrices(p => p.map((pr, i) => i == index ? { ...pr, priceValue: value } : pr))}
                            className="shop-input-number w-100"
                            placeholder={pageData.pricing.price.placeholder}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            addonAfter={currency}
                            precision={0}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault()
                                }
                            }}
                            id={`product-prices-${price.position}-price`}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} lg={5}>
                    <Form.Item
                        name={['product', 'prices', 'percentNumber']}
                        rules={[
                            {
                                pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                                message: pageData.pricing.priceDiscount.percentage.validateMessage
                            }
                        ]}
                    >
                        <InputNumber
                            onChange={value => onDiscountChange(0, value, index)}
                            className="shop-input-number w-100"
                            placeholder={pageData.pricing.priceDiscount.percentage.placeholder}
                            formatter={(value) => `${value}%`}
                            parser={(value) => value?.replace('%', '')}
                            min={0}
                            max={100}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault()
                                }
                            }}
                            id={`product-prices-price-discount-percentage`}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} lg={5}>
                    <Form.Item
                        name={['product', "prices", "startDate"]}
                        rules={[
                            {
                                required: true,
                                message: pageData.pricing.priceDate.startDate.validateMessage,
                            },
                        ]}
                    >
                        <DatePicker
                            suffixIcon={<CalendarNewIconBold />}
                            placeholder={pageData.pricing.priceDate.startDate.placeholder}
                            className="shop-date-picker w-100"
                            // disabledDate={disabledDate}
                            format={DateFormat.DD_MM_YYYY}
                            disabledDate={disabledDate}
                            onChange={(date) => {
                                price.startDate = date
                                // Clear end date after select start date if endate < startdate only
                                const formValues = form.getFieldsValue();
                                const { product } = formValues
                                product.prices[index].startDate = date
                                if (product.prices[index]?.endDate != null && product.prices[index]?.endDate.isBefore(date)) {
                                    product.prices[index].endDate = null
                                    product.prices[index].endTime = null

                                }
                                form.setFieldsValue(formValues);
                                console.log(product)
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} lg={5}>
                    <Form.Item
                        name={['product', "prices", "endDate"]}
                        rules={[]}
                    >
                        <DatePicker
                            suffixIcon={<CalendarNewIconBold />}
                            placeholder={pageData.pricing.priceDate.endDate.placeholder}
                            className="shop-date-picker w-100"
                            disabledDate={e => disabledDateByStartDate(e, price)}
                            format={DateFormat.DD_MM_YYYY}
                            disabled={price.startDate ? false : true}
                            onChange={(date) => {
                                const formValues = form.getFieldsValue();
                                const { product } = formValues
                                product.prices[index].endDate = date
                                form.setFieldsValue(formValues)
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <ShopTable
                className='stock-table'
                columns={tableSettings.columns}
                editPermission={PermissionKeys.ADMIN}
                deletePermission={PermissionKeys.ADMIN}
                dataSource={stockData}
            />
        </>

    );
}