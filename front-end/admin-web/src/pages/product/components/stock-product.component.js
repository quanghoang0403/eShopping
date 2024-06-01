/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Popconfirm, Button, Checkbox, Row, Col, Form, DatePicker, InputNumber, Card, Table, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import './stock-product.component.scss';
import { CalendarNewIconBold } from 'constants/icons.constants';
import moment from 'moment';
import { inputNumberRangeOneTo999999999 } from 'constants/default.constants';
import { currency } from 'constants/string.constants'
import { DateFormat } from 'constants/string.constants';
import { roundNumber } from 'utils/helpers';
import { PermissionKeys } from 'constants/permission-key.constants'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconBtnAdd } from 'constants/icons.constants';
import { FnbDeleteIcon } from 'components/shop-delete-icon/shop-delete-icon';
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component';
export default function StockProductTable({ productSizes, form }) {
  const { t } = useTranslation();
  const pageData = {
    productVariant: {
      title: t('product.variantInfo'),
      addVariant: t('product.addVariant'),
      label: t('product.labelVariant'),
      placeholder: t('product.placeholderVariant'),
      validateVariant: t('product.validateVariant')
    },
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
  const [count, setCount] = useState(1);
  // const [productVariants, setProductVariants] = useState([{
  //   key: 1,
  //   thumbnail: null,
  //   name: 'Product Variant 1',
  //   isUseBasePrice: true,
  //   priceOriginal: 200000.00,
  //   priceValue: 140000.00,
  //   priceDiscount: 130000.00,
  //   startDate: moment(),
  //   endDate: moment().add(7, 'days'),
  //   stocks: productSizes?.map(size => ({
  //     sizeId: size.id,
  //     name: size.name,
  //     quantityLeft: 0
  //   }))
  // },
  // {
  //   key: 2,
  //   thumbnail: 'https://eshoppingblob.blob.core.windows.net/uploaddev/29052024112449.jpg',
  //   name: 'Product Variant 2',
  //   isUseBasePrice: false,
  //   priceOriginal: 180000.00,
  //   priceValue: 140000.00,
  //   priceDiscount: 130000.00,
  //   startDate: moment(),
  //   endDate: moment().add(6, 'days'),
  //   stocks: productSizes?.map(size => ({
  //     sizeId: size.id,
  //     name: size.name,
  //     quantityLeft: 0
  //   }))
  // },
  // {
  //   key: 3,
  //   thumbnail: null,
  //   name: 'Product Variant 3',
  //   isUseBasePrice: true,
  //   priceOriginal: 160000.00,
  //   priceValue: 140000.00,
  //   priceDiscount: 130000.00,
  //   startDate: moment(),
  //   endDate: moment().add(4, 'days'),
  //   stocks: productSizes?.map(size => ({
  //     sizeId: size.id,
  //     name: size.name,
  //     quantityLeft: 0
  //   }))
  // }])
  const [productVariants, setProductVariants] = useState([{
    key: 1,
    thumbnail: null,
    name: 'Default',
    isUseBasePrice: true,
    stocks: productSizes?.map(size => ({
      sizeId: size.id,
      name: size.name,
      quantityLeft: 0
    }))
  }])

  const tableSettings = {
    columns: [
      {
        title: '',
        dataIndex: 'delete',
        width: 100,
        fixed: 'left',
        render: (_, record) =>
          productVariants.length >= 1 ? (
            <Popconfirm title="Bạn có chắc muỗn xoá biến thể này?" onConfirm={() => handleDelete(record.key)}>
              <a className="m-4">
                <FnbDeleteIcon />
              </a>
            </Popconfirm >
          ) : null
      },
      {
        title: 'Biến thể',
        dataIndex: 'name',
        position: 'name',
        align: 'center',
        width: 172,
        fixed: 'left',
        render: (value, record, index) => {
          return (
            <>
              <Form.Item
                name={['productVariants', index, 'name']}
                rules={[
                  {
                    required: true,
                    message: pageData.productVariant.validateVariant
                  }
                ]}
              >
                <Input
                  className="shop-input"
                  placeholder={pageData.productVariant.placeholder}
                  id={`product-productVariants-${index}-name`}
                  value={value}
                />
              </Form.Item>
            </>
          )
        }
      },
      {
        title: 'Thumbnail',
        dataIndex: 'thumbnail',
        position: 'thumbnail',
        align: 'center',
        width: 140,
        render: (value, record, index) => {
          return (
            <>
              <Form.Item
                name={['productVariants', index, 'thumbnail']}
                className='variant-thumbnail'
              >
                <FnbImageSelectComponent
                  isShowBestDisplay={false}
                  isShowTextNonImage={false}
                  customTextNonImageClass={'create-edit-product-text-non-image'}
                  customNonImageClass={'create-edit-product-non-image'}
                />
              </Form.Item >
            </>
          )
        }
      },
      {
        title: 'Quản lý giá',
        align: 'center',
        children: [
          {
            title: '$ cơ sở',
            dataIndex: 'isUseBasePrice',
            position: 'isUseBasePrice',
            align: 'center',
            minWidth: 100,
            width: 80,
            render: (value, record, index) => {
              return (
                <Form.Item
                  name={['productVariants', index, 'isUseBasePrice']}
                  valuePropName="checked"
                  rules={[]}
                >
                  <Checkbox checked={value} />
                </Form.Item>
              )
            }
          },
          {
            title: 'Giá gốc',
            dataIndex: 'priceOriginal',
            position: 'priceOriginal',
            align: 'center',
            width: 124,
            render: (value, record, index) => (
              <Form.Item
                name={['productVariants', index, 'priceOriginal']}
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
                      if (value > getFieldValue(['productVariants', index, 'priceValue'])) {
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
                  id={`product-variants-${index}-price-original`}
                />
              </Form.Item>
            )
          },
          {
            title: 'Giá bán',
            dataIndex: 'priceValue',
            position: 'priceValue',
            align: 'center',
            width: 124,
            render: (value, record, index) => (
              <Form.Item
                name={['productVariants', index, 'priceValue']}
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
                        if (value <= getFieldValue(['productVariants', index, 'priceDiscount'])) {
                          return Promise.reject(new Error(pageData.pricing.priceDiscount.numeric.validateMessage))
                        }
                        if (value < getFieldValue(['productVariants', index, 'priceOriginal'])) {
                          return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                        }
                        return Promise.resolve()
                      }
                    }
                  )
                ]}
              >
                <InputNumber
                  onChange={value => onDiscountChange(false, index)}
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
                  id={`product-variants-${index}-price-value`}
                />
              </Form.Item>
            )
          },
          {
            title: 'Giá khuyến mãi',
            dataIndex: 'priceDiscount',
            position: 'priceDiscount',
            align: 'center',
            width: 124,
            render: (value, record, index) => (
              <Form.Item
                name={['productVariants', index, 'priceDiscount']}
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
                        if (value >= getFieldValue(['productVariants', index, 'priceValue'])) {
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
                  id={`product-variants-${index}-price-value`}
                />
              </Form.Item>
            )
          },
          {
            title: '%',
            dataIndex: 'percentNumber',
            position: 'percentNumber',
            align: 'center',
            width: 72,
            render: (value, record, index) => (
              <Form.Item
                name={['productVariants', index, 'percentNumber']}
                rules={[
                  {
                    pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                    message: pageData.pricing.priceDiscount.percentage.validateMessage
                  }
                ]}
              >
                <InputNumber
                  onChange={value => onDiscountChange(true, index)}
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
                  id={`product-variants-${index}-percent-number`}
                />
              </Form.Item>
            )
          },
          {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            position: 'startDate',
            align: 'center',
            width: 176,
            render: (value, record, index) => (
              <Form.Item
                valuePropName={'date'}
                name={['productVariants', index, 'startDate']}
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
                  disabled={record.isUseBasePrice}
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
            width: 176,
            render: (value, record, index) => (
              <Form.Item
                valuePropName={'date'}
                name={['productVariants', index, 'endDate']}
                rules={[]}
              >
                <DatePicker
                  suffixIcon={<CalendarNewIconBold />}
                  placeholder={pageData.pricing.priceDate.endDate.placeholder}
                  className="shop-date-picker w-100"
                  disabledDate={e => disabledDateByStartDate(e, record.startDate)}
                  format={DateFormat.DD_MM_YYYY}
                  disabled={!record.startDate || record.isUseBasePrice}
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
        children: productSizes?.map((size, indexSize) => ({
          title: size.name,
          dataIndex: size.id,
          position: size.id,
          align: 'center',
          width: 60,
          render: (_, record, index) => {
            return (
              <Form.Item
                name={['productVariants', index, 'stocks', indexSize, 'quantityLeft']}
                rules={[]}
              >
                <InputNumber
                  className="shop-input-number w-100"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  precision={0}
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) &&
                      event.key !== 'Backspace' &&
                      event.key !== 'Delete') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            );
          }
        }))
      }
    ],
    rows: (props) => {
      const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key']
      });
      const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
        ...(isDragging
          ? {
            position: 'relative',
            zIndex: 9999
          }
          : {})
      };
      return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
    }
  };

  const handleSyncData = (newData) => {
    setProductVariants(newData);
    form.setFieldValue('productVariants', newData)
  }

  const handleDelete = (key) => {
    const oldData = form.getFieldValue('productVariants')
    const newData = oldData.filter((item) => item.key !== key);
    handleSyncData(newData)
  };

  const handleAdd = () => {
    const fields = form.getFieldsValue();
    const newDataRow = {
      key: count + 1,
      thumbnail: null,
      name: '',
      isUseBasePrice: true,
      priceOriginal: fields.priceOriginal,
      priceValue: fields.priceValue,
      priceDiscount: fields.priceDiscount,
      startDate: fields.startDate,
      endDate: fields.endDate,
      stocks: productSizes?.map(size => ({
        sizeId: size.id,
        name: size.name,
        quantityLeft: 0
      }))
    }
    const oldData = form.getFieldValue('productVariants')
    const newData = [...oldData, newDataRow]
    handleSyncData(newData)
    setCount(count + 1);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1
      }
    }),
  );

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldData = form.getFieldValue('productVariants')
      const activeIndex = oldData.findIndex((i) => i.key === active.id);
      const overIndex = oldData.findIndex((i) => i.key === over?.id);
      const newData = arrayMove(oldData, activeIndex, overIndex);
      handleSyncData(newData)
    }
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

  useEffect(() => {
    form.setFieldValue('productVariants', productVariants)
  }, [])


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
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={productVariants.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            className='stock-table shop-table form-table mt-4'
            columns={tableSettings.columns}
            editPermission={PermissionKeys.ADMIN}
            deletePermission={PermissionKeys.ADMIN}
            dataSource={productVariants}
            rowKey="key"
            scroll={{ x: 1600 }}
            pagination={false}
            components={{
              body: {
                row: tableSettings.rows
              }
            }}
          />
        </SortableContext>
      </DndContext>
      <Button
        onClick={handleAdd}
        type="primary"
        icon={<IconBtnAdd className="icon-btn-add-price" />}
        className="mt-4 btn-add-price"
      >
        {pageData.productVariant.addVariant}
      </Button>
    </Card>
  );
}
