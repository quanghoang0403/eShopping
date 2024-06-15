import { Input, Tag } from 'antd';
import './badge-keyword-SEO.component.scss'
import { useEffect, useState } from 'react';
import { PermissionKeys } from 'constants/permission-key.constants';
import { useTranslation } from 'react-i18next';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';

export function BadgeSEOKeyword(props) {
  const { value, onChange } = props
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isKeywordSEOChange, setIsKeywordSEOChange] = useState(false)
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [t] = useTranslation()
  const pageData={
    SEO: {
      SEOKeywordsPlaceholder: t('form.SEOKeywordsPlaceholder'),
      SEOKeywordsTooltip: t('form.SEOKeywordsTooltip'),
      keyword: {
        label: t('form.SEOKeywords'),
        placeholder: t('form.SEOKeywordsPlaceholder'),
        tooltip: t('form.SEOKeywordsTooltip'),
        btnAdd: t('form.AddSEOKeywords')
      }
    }
  }
  useEffect(()=>{
    setKeywordSEOList(value?.split(',').map(kw => { return { id: kw, value: kw } }) || [])
  },[value])

  const addSEOKeywords = () => {
    if (keywordSEO.value.trim() === '') return; // Prevent adding empty keywords
    setKeywordSEOList(list => {
      const updatedList = !list.find(kw => kw.id === keywordSEO.id) ? [...list, keywordSEO] : [...list];
      if (onChange) onChange(updatedList.map(kw => kw.value).join(',')); // Notify parent about the change
      return updatedList;
    });
    setKeywordSEO({ id: '', value: '' });
    setIsKeywordSEOChange(false);
  };

  const removeSEOKeyword = keyword => {
    setKeywordSEOList(list => list.filter(kw => kw.id !== keyword.id));
    if (onChange) onChange(keywordSEOs.filter(kw => kw.id !== keyword.id).map(kw => kw.value).join(',')); // Notify parent about the change
  };

  return (
    <>
      <div className='keyword-SEO-tag'>
        {
          keywordSEOs?.map(keyword => {
            return (
              <>
                { keywordSEOs.length > 0 ? <Tag key={keyword.id} closable onClose={() => removeSEOKeyword(keyword)}><span>{keyword.value}</span></Tag>  : ''}
              </>
            );
          })
        }
        <div className='d-flex mt-2 w-100'>
          <Input
            className="shop-input-with-count"
            showCount
            value={keywordSEO?.value || ''}
            placeholder={pageData.SEO.SEOKeywordsPlaceholder}
            onChange={e => {
              if (e.target.value !== '') {
                setKeywordSEO({
                  id: e.target.value,
                  value: e.target.value.trim()
                })
                setIsKeywordSEOChange(true)
              }
            }}
          />
          <ShopAddNewButton
            permission={PermissionKeys.CREATE_BLOG}
            disabled={!isKeywordSEOChange}
            text={pageData.SEO.keyword.btnAdd}
            className={'mx-4'}
            onClick={addSEOKeywords}
          />
        </div>
      </div>
    </>
  );
}
