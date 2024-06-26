import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './shop-change-active-status-button.component.scss'
export default function ChangeStatusButton(props){
  const {value, onChange} = props
  const {t} = useTranslation()
  const [activate, setActivate] = useState(null)
  const pageData = {
    activate: t('product.activate'),
    deactivate: t('product.deactivate')
  }
  useEffect(()=>{
    console.log(value)
    setActivate(value ? pageData.deactivate : pageData.activate)
  },[value])
  return(
    // <button
    //   className={`${activate === pageData.deactivate ? 'action-activate' : 'action-deactivate'} ${className}`}
    //   onClick={() => {
    //     onClick(value)
    //     if(onChange){
    //       onChange(activate === pageData.deactivate ? false : true)
    //     }
    //   }}
    // >
    //   {activate}
    // </button>
    <div className="checkbox-wrapper-63">
      <label className="switch">
        <input type="checkbox" onChange={()=>onChange(activate === pageData.deactivate ? true : false)} checked={activate === pageData.deactivate}/>
        <span className="slider"></span>
      </label>
    </div>
  );
}