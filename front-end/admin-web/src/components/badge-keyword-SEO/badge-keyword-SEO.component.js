import { Tag } from 'antd';
import './badge-keyword-SEO.component.scss'

export function BadgeSEOKeyword(props) {
  const { keywords, onClose } = props
  return (
    <>
      <div className='keyword-SEO-tag'>
        {
          keywords?.map(keyword => {
            return (
              <Tag key={keyword.id} closable onClose={() => onClose(keyword)}>
                <span>{keyword.value}</span>
              </Tag>
            );
          })
        }
      </div>
    </>
  );
}
