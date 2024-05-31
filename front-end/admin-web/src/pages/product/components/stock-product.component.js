/* eslint-disable no-undef */
import React from 'react';
import { ShopTable } from 'components/shop-table/shop-table';
import { Checkbox, Row, Col, Form, DatePicker, InputNumber, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import './stock-product.component.scss';
import { CalendarNewIconBold } from 'constants/icons.constants';
import moment from 'moment';
import { inputNumberRangeOneTo999999999 } from 'constants/default.constants';
import { currency } from 'constants/string.constants'
import { DateFormat } from 'constants/string.constants';
import { roundNumber } from 'utils/helpers';
import { PermissionKeys } from 'constants/permission-key.constants'

export default function StockProductTable({ productSizes, form, productVariants }) {
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
      quantity: {
        sold: {
          label: t('product.labelQuantitySold'),
          placeholder: t('product.placeholderQuantitySold')
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
    }
  }

  const tableSettings = {
    columns: [
      {
        title: 'Biến thể',
        dataIndex: 'name',
        position: 'name',
        align: 'center',
        width: 120,
        fixed: 'left'
      },
      {
        title: 'Quản lý giá',
        align: 'center',
        children: [
          {
            title: 'Giá cơ sở',
            dataIndex: 'isUseBasePrice',
            position: 'isUseBasePrice',
            align: 'center',
            minWidth: 100,
            width: 100,
            render: (value, record) => {
              return (
                <Form.Item
                  name={['productVariants', record.position, 'isUseBasePrice']}
                  valuePropName="checked"
                  rules={[]}
                >
                  <Checkbox onChange={(e) => handleRadioChange(e.target.checked, record.position)} checked={value} />
                </Form.Item>
              )
            }
          },
          {
            title: 'Giá gốc',
            dataIndex: 'priceOriginal',
            position: 'priceOriginal',
            align: 'center',
            width: 160,
            render: (value, record) => (
              <Form.Item
                name={['productVariants', record.position, 'priceOriginal']}
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
                      if (value > getFieldValue(['productVariants', record.position, 'priceValue'])) {
                        return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                      }
                      return Promise.resolve()
                    }
                  })
                ]}
              >
                <InputNumber
                  className="shop-input-number w-100"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter={currency}
                  precision={0}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) &&
                      event.key !== 'Backspace' &&
                      event.key !== 'Delete') {
                      event.preventDefault()
                    }
                  }}
                  value={value}
                  disabled={record.isUseBasePrice}
                  id={`product-variants-${record.position}-price-original`}
                />
              </Form.Item>
            )
          },
          {
            title: 'Giá bán',
            dataIndex: 'priceValue',
            position: 'priceValue',
            align: 'center',
            width: 160,
            render: (value, record) => (
              <Form.Item
                name={['productVariants', record.position, 'priceValue']}
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
                        if (value <= getFieldValue(['productVariants', record.position, 'priceDiscount'])) {
                          return Promise.reject(new Error(pageData.pricing.priceDiscount.numeric.validateMessage))
                        }
                        if (value < getFieldValue(['productVariants', record.position, 'priceOriginal'])) {
                          return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                        }
                        return Promise.resolve()
                      }
                    }
                  )
                ]}
              >
                <InputNumber
                  onChange={value => onDiscountChange(false, record.position)}
                  className="shop-input-number w-100"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter={currency}
                  precision={0}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) &&
                      event.key !== 'Backspace' &&
                      event.key !== 'Delete') {
                      event.preventDefault()
                    }
                  }}
                  value={value}
                  disabled={record.isUseBasePrice}
                  id={`product-variants-${record.position}-price-value`}
                />
              </Form.Item>
            )
          },
          {
            title: 'Giá khuyến mãi',
            dataIndex: 'priceDiscount',
            position: 'priceDiscount',
            align: 'center',
            width: 160,
            render: (value, record) => (
              <Form.Item
                name={['productVariants', record.position, 'priceDiscount']}
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
                        if (value >= getFieldValue(['productVariants', record.position, 'priceValue'])) {
                          return Promise.reject(new Error(pageData.pricing.priceDiscount.numeric.validateMessage))
                        }
                        return Promise.resolve();
                      }
                    }
                  )
                ]}
              >
                <InputNumber
                  className="shop-input-number w-100"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter={currency}
                  precision={0}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) &&
                      event.key !== 'Backspace' &&
                      event.key !== 'Delete') {
                      event.preventDefault()
                    }
                  }}
                  value={value}
                  disabled={record.isUseBasePrice}
                  id={`product-variants-${record.position}-price-value`}
                />
              </Form.Item>
            )
          },
          {
            title: '%',
            dataIndex: 'percentNumber',
            position: 'percentNumber',
            align: 'center',
            width: 102,
            render: (value, record) => (
              <Form.Item
                name={['productVariants', record.position, 'percentNumber']}
                rules={[
                  {
                    pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                    message: pageData.pricing.priceDiscount.percentage.validateMessage
                  }
                ]}
              >
                <InputNumber
                  onChange={value => onDiscountChange(true, record.position)}
                  className="shop-input-number w-100"
                  placeholder={pageData.pricing.priceDiscount.percentage.placeholder}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value?.replace('%', '')}
                  min={0}
                  max={100}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) &&
                      event.key !== 'Backspace' &&
                      event.key !== 'Delete') {
                      event.preventDefault()
                    }
                  }}
                  value={value}
                  disabled={record.isUseBasePrice}
                  id={`product-variants-${record.position}-percent-number`}
                />
              </Form.Item>
            )
          },
          {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            position: 'startDate',
            align: 'center',
            width: 206,
            render: (value, record) => (
              <Form.Item
                valuePropName={'date'}
                name={['productVariants', record.position, 'startDate']}
                rules={[
                  {
                    required: true,
                    message: pageData.pricing.priceDate.startDate.validateMessage
                  }
                ]}
              >
                <DatePicker
                  suffixIcon={<CalendarNewIconBold />}
                  placeholder={pageData.pricing.priceDate.startDate.placeholder}
                  className="shop-date-picker w-100"
                  format={DateFormat.DD_MM_YYYY}
                  disabledDate={disabledDate}
                  onChange={(date) => {
                    record.startDate = date
                    // Clear end date after select start date if endate < startdate only
                    const formValues = form.getFieldsValue();
                    formValues.startDate = date
                    if (formValues.endDate != null && formValues.endDate.isBefore(date)) {
                      formValues.endDate = null
                      formValues.endTime = null

                    }
                    form.setFieldsValue(formValues);
                  }}
                />
              </Form.Item>
            )
          },
          {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            position: 'endDate',
            align: 'center',
            width: 206,
            render: (value, record) => (
              <Form.Item
                valuePropName={'date'}
                name={['productVariants', record.position, 'endDate']}
                rules={[]}
              >
                <DatePicker
                  suffixIcon={<CalendarNewIconBold />}
                  placeholder={pageData.pricing.priceDate.endDate.placeholder}
                  className="shop-date-picker w-100"
                  disabledDate={e => disabledDateByStartDate(e, record.startDate)}
                  format={DateFormat.DD_MM_YYYY}
                  disabled={record.startDate ? false : true}
                  onChange={(date) => {
                    const formValues = form.getFieldsValue();
                    formValues.endDate = date
                    form.setFieldsValue(formValues)
                  }}
                />
              </Form.Item>
            )
          }
        ]
      },
      {
        title: 'Quản lý tồn kho',
        align: 'center',
        children: productSizes.map((size, index) => ({
          title: size.name,
          dataIndex: size.id,
          position: size.id,
          align: 'center',
          width: 90,
          render: (_, record) => {
            // Find the size in the stocks array of the current record
            const stock = record.stocks.find(stock => stock.sizeId === size.id);
            // If the size is found, return its quantityLeft, otherwise return 0
            const quantityLeft = stock ? stock.quantityLeft : 0;
            return (
              <Form.Item
                name={['productVariants', record.position, 'stocks', index, 'quantityLeft']}
                rules={[]}
              >
                <InputNumber
                  className="shop-input-number w-100"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  precision={0}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  value={quantityLeft}
                />
              </Form.Item>
            );
          }
        }))
      }
    ]
  };

  const handleRadioChange = (isChecked, position) => {
    const fields = form.getFieldsValue();
    if (isChecked) {
      fields.productVariants[position].priceOriginal = fields.priceOriginal;
      fields.productVariants[position].priceValue = fields.priceValue;
      fields.productVariants[position].priceDiscount = fields.priceDiscount;
      fields.productVariants[position].startDate = fields.startDate;
      fields.productVariants[position].endDate = fields.endDate;
    }
    form.setFieldsValue(fields);
  };

  const priceToPercentage = (num, total) => {
    return roundNumber(total === 0 ? 0 : (total - num) * 100 / total)
  }

  const percentageToPrice = (num, total) => {
    return roundNumber((100 - num) / 100 * total)
  }

  const onDiscountChange = (isPercentage, position = -1) => {
    if (position == -1) {
      const total = form.getFieldValue('priceValue')
      if (isPercentage) {
        const percentage = form.getFieldValue('percentNumber')
        const num = percentageToPrice(percentage, total)
        form.setFieldValue('priceDiscount', num)
      }
      else {
        const numeric = form.getFieldValue('priceDiscount')
        const percent = priceToPercentage(numeric, total)
        form.setFieldValue('percentNumber', percent)
      }
    }
    else {
      const total = form.getFieldValue(['productVariants', position, 'priceValue'])
      if (isPercentage) {
        const percentage = form.getFieldValue(['productVariants', position, 'percentNumber'])
        const num = percentageToPrice(percentage, total)
        form.setFieldValue(['productVariants', position, 'priceDiscount'], num)
      }
      else {
        const numeric = form.getFieldValue(['productVariants', position, 'priceDiscount'])
        const percent = priceToPercentage(numeric, total)
        form.setFieldValue(['productVariants', position, 'percentNumber'], percent)
      }
    }
  }

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf('day');
  };

  const disabledDateByStartDate = (current, startDate) => {
    // Can not select days before today and today
    return current && current < startDate;
  };

  return (
    <Card className="w-100 mt-1 shop-card h-auto">
      <h4 className="title-group">{pageData.pricing.title}</h4>
      <Row className='mt-3' gutter={[8, 16]}>
        <Col xs={24} lg={4}>
          <h3>
            {pageData.pricing.priceOriginal.label}
          </h3>
        </Col>
        <Col xs={24} lg={4}>
          <h3>
            {pageData.pricing.price.label}
          </h3>
        </Col>
        <Col xs={24} lg={4}>
          <h3>{pageData.pricing.priceDiscount.numeric.label}</h3>
        </Col>
        <Col xs={24} lg={4}>
          <h3>{pageData.pricing.priceDiscount.percentage.label}</h3>
        </Col>
        <Col xs={24} lg={4}>
          <h3>
            {pageData.pricing.priceDate.startDate.label}
          </h3>
        </Col>
        <Col xs={24} lg={4}>
          <h3>
            {pageData.pricing.priceDate.endDate.label}
          </h3>
        </Col>
      </Row>
      <Row className='mt-3' gutter={[8, 16]}>

        <Col xs={24} lg={4}>
          <Form.Item
            name={['priceOriginal']}
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
                  if (value > getFieldValue(['priceValue'])) {
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
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) &&
                  event.key !== 'Backspace' &&
                  event.key !== 'Delete') {
                  event.preventDefault()
                }
              }}
              id={'product-price-original'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item
            name={['priceValue']}
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
                  if (value < getFieldValue(['priceOriginal'])) {
                    return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                  }
                  if (value <= getFieldValue(['priceDiscount'])) {
                    return Promise.reject(new Error(pageData.pricing.priceDiscount.numeric.validateMessage))
                  }
                  return Promise.resolve()
                }
              })
            ]}
          >
            <InputNumber
              onChange={value => onDiscountChange(false, record.position)}
              className="shop-input-number w-100"
              placeholder={pageData.pricing.price.placeholder}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              addonAfter={currency}
              precision={0}
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) &&
                  event.key !== 'Backspace' &&
                  event.key !== 'Delete') {
                  event.preventDefault()
                }
              }}
              id={'product-price-value'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item
            name={['priceDiscount']}
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
                    if (value >= getFieldValue(['priceValue'])) {
                      return Promise.reject(new Error(pageData.pricing.priceDiscount.numeric.validateMessage))
                    }
                    return Promise.resolve();
                  }
                }
              )
            ]}
          >
            <InputNumber
              onChange={value => onDiscountChange(false)}
              className="shop-input-number w-100"
              placeholder={pageData.pricing.price.placeholder}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              addonAfter={currency}
              precision={0}
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) &&
                  event.key !== 'Backspace' &&
                  event.key !== 'Delete') {
                  event.preventDefault()
                }
              }}
              id={'product-price-discount'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item
            name={['percentNumber']}
            rules={[
              {
                pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                message: pageData.pricing.priceDiscount.percentage.validateMessage
              }
            ]}
          >
            <InputNumber
              onChange={value => onDiscountChange(true)}
              className="shop-input-number w-100"
              placeholder={pageData.pricing.priceDiscount.percentage.placeholder}
              formatter={(value) => `${value}%`}
              parser={(value) => value?.replace('%', '')}
              min={0}
              max={100}
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) &&
                  event.key !== 'Backspace' &&
                  event.key !== 'Delete') {
                  event.preventDefault()
                }
              }}
              id={'product-percent-number'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item
            name={['startDate']}
            rules={[
              {
                required: true,
                message: pageData.pricing.priceDate.startDate.validateMessage
              }
            ]}
          >
            <DatePicker
              suffixIcon={<CalendarNewIconBold />}
              placeholder={pageData.pricing.priceDate.startDate.placeholder}
              className="shop-date-picker w-100"
              format={DateFormat.DD_MM_YYYY}
              disabledDate={disabledDate}
              onChange={(date) => {
                // Clear end date after select start date if endate < startdate only
                const formValues = form.getFieldsValue();
                formValues.startDate = date
                if (formValues.endDate != null && formValues.endDate.isBefore(date)) {
                  formValues.endDate = null
                  formValues.endTime = null
                }
                form.setFieldsValue(formValues);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item
            name={['endDate']}
            rules={[]}
          >
            <DatePicker
              suffixIcon={<CalendarNewIconBold />}
              placeholder={pageData.pricing.priceDate.endDate.placeholder}
              className="shop-date-picker w-100"
              disabledDate={e => {
                const formValues = form.getFieldsValue();
                disabledDateByStartDate(e, formValues.startDate)
              }}
              format={DateFormat.DD_MM_YYYY}
              //disabled={basePrice.startDate ? false : true}
              onChange={(date) => {
                const formValues = form.getFieldsValue();
                formValues.endDate = date
                form.setFieldsValue(formValues)
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <ShopTable
        className='stock-table mt-4'
        columns={tableSettings.columns}
        editPermission={PermissionKeys.ADMIN}
        deletePermission={PermissionKeys.ADMIN}
        dataSource={productVariants}
        scrollX={1600}
      />
    </Card>
  );
}
