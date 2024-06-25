import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ChangeStatusButton(props){
  const {value, onChange, onClick, className} = props
  const {t} = useTranslation()
  const [activate, setActivate] = useState(null)
  const pageData = {
    activate: t('product.activate'),
    deactivate: t('product.deactivate')
  }
  useEffect(()=>{
    setActivate(value ? pageData.deactivate : pageData.activate)
  },[value])
  return(
    <button
      className={`${activate === pageData.deactivate ? 'action-activate' : 'action-deactivate'} ${className}`}
      onClick={() => {
        onClick(value)
        if(onChange){
          onChange(activate === pageData.deactivate ? false : true)
        }
      }}
    >
      {activate}
    </button>
  );
}