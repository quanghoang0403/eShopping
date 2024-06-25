import { ProductStatus } from 'constants/product-status.constants';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ShopActiveStatus(props){
  const {status} = props
  const [statusId, setStatusId] = useState(null)
  const {t} = useTranslation()
  const pageData={
    active: t('common.active'),
    inactive: t('common.inactive')
  }
  useEffect(()=>{
    setStatusId(status)
  },[status])
  return(
    <>
      {statusId === ProductStatus.Activate && (
        <span className="badge-status active ml-3">
          <span> {pageData.active}</span>
        </span>
      )}
      {statusId === ProductStatus.Deactivate && (
        <span className="badge-status default ml-3">
          <span> {pageData.inactive}</span>
        </span>
      )}
    </>
  );
}