import { Flex, Tag } from 'antd';
import './badge-keyword-SEO.component.scss'
import { useEffect } from 'react';

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];
export const SEO_KEYWORD_COLOR_LENGTH = colors.length
export function BadgeSEOKeyword(props){
    const {keywords,onClose} = props
    return(
        <>
           <div className='keyword-SEO-tag'>
                {
                    keywords?.map(keyword=>{
                        return (
                            <Tag key={keyword.id} closable onClose={()=>onClose(keyword)} color={colors[keyword.colorIndex]}>
                             <span className='word-wrap'>{keyword.value}</span>   
                            </Tag>
                        );
                    })
                }
           </div>
                
            
        </>
    );
}