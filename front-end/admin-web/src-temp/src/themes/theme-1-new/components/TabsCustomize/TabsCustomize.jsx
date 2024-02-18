import React from 'react'
import "./TabsCustomize.scss"
import { Tabs } from 'antd';

function TabsCustomize({tabBarGutter = 80, ...props}) {
  return (
    <Tabs className='fnb-tabs-theme1' tabBarGutter={tabBarGutter} {...props} />
  )
}

export default TabsCustomize;
