import { Row } from 'antd';
import { ShopTable } from 'components/shop-table/shop-table';
import { Thumbnail } from 'components/thumbnail/thumbnail';
import { useTranslation } from 'react-i18next';
import { formatTextNumber, getCurrency } from 'utils/helpers';
import './table-ordered-products.component.scss'

export default function TableOrderedProducts(props){
  const {orderItems} = props
  const {t} = useTranslation()
  const pageData = {
    table: {
      searchPlaceholder: t('table.searchPlaceholder'),
      no: t('table.no'),
      name: t('table.product'),
      price: t('table.price'),
      quantity:t('table.quantity'),
      total:t('table.total'),
      thumbnail:t('table.thumbnail')
    },
    product:{
      variantInfo:t('product.variantInfo')
    },
    billing:{
      total:t('order.totalBill')
    }
  }
  const mappingProductColumn = (data)=>{
    return {
      no:orderItems.indexOf(data)+1,
      ...data
    }
  }
  const columns = [
    {
      title:pageData.table.no,
      dataIndex:'no',
      className: 'grid-product-name-column',
      align: 'left',
      width: '10%'
    },
    {
      title:pageData.table.name,
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      align: 'left',
      className: 'grid-product-name-column',
      width: '35%',
      render: (value, record) => {
        return (
          <Row className="table-img-box w-100">
            <div className='d-flex w-100'>
              <Thumbnail
                // src={getThumbnailUrl(record?.thumbnail, 'mobile')}
                src={record?.thumbnail}
              />
              <div className='ml-3 product-info'>
                <b>{record?.productName}</b>
                <div className='mt-1'>
                  <p>{record?.productVariantName}</p>
                  <p className={`${!record?.productSizeName && 'd-none'}`}>|{record?.productSizeName}</p>
                </div>
              </div>
            </div>
          </Row>
        )
      }
    },
    {
      title:`${pageData.table.price} (${getCurrency()})`,
      dataIndex: 'priceValue',
      key: 'priceValue',
      width: '20%',
      className: 'grid-price-column',
      align: 'left',
      render: (value,record) =>{
        return(
          <>
            <div className={`grid-price-column-text ${record?.priceDiscount ? 'price-discount' : 'd-none'} mt-1`}>{formatTextNumber(record?.priceDiscount)+getCurrency()|| ''}</div>
            <div className="grid-price-column-text price-value">{formatTextNumber(value)+getCurrency()}</div>
          </>
        );
      }
    },
    {
      title:pageData.table.quantity,
      dataIndex: 'quantity',
      key: 'quantity',
      width: '15%',
      align: 'left'
    },
    {
      title:pageData.billing.total,
      key: 'totalBill',
      width: '20%',
      align: 'left',
      render:(_,record)=><div>{formatTextNumber((record?.priceDiscount || record?.priceValue) * record?.quantity)+getCurrency()}</div>
    }
  ]
  return(
    <ShopTable
      columns={columns}
      dataSource={orderItems?.map(item=>mappingProductColumn(item))}
      className='ordered-products-table'
    />
  );
}