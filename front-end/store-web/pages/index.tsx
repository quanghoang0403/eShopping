import { Typography, Image, Input, Space, List } from 'antd'
import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { ImageService } from '@/services'

export default function HomePage() {
  const [listUrl, setListUrl] = useState<string[]>()
  const onSearch = async (text: string) => {
    // const res = await ImageService.searchByText({ text })
    // setListUrl(res.data)
  }
  const maxWidth = window.innerWidth
  const imgWidth = (maxWidth - 82) / 5
  return (
    <main>
      <Space
        direction="vertical"
        style={{ width: 'calc(100% - 80px)', margin: 40 }}
        align="center"
      >
        <div>
          <Typography.Title style={{ textAlign: 'center', color: '#1677ff' }}>
            Search Image
          </Typography.Title>
          <Input.Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            suffix={<UploadOutlined />}
            onSearch={onSearch}
          />
          <List
            style={{ marginTop: 20, justifyContent: 'center' }}
            grid={{
              gutter: 2,
            }}
            dataSource={[1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]}
            renderItem={(item) => (
              <List.Item>
                <Image
                  width={imgWidth}
                  alt=""
                  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                />
              </List.Item>
            )}
          />
        </div>
      </Space>
    </main>
  )
}

// import SEO from '@/components/Layout/SEO'
// import React from 'react'
// import { Input, Space } from 'antd'
// import { counterActions } from '@/redux/features/counterSlice'
// import { useAppSelector, useAppDispatch } from '@/redux/hooks'
// import Search from 'antd/es/transfer/search'
// const HomePage = () => {
//   const count = useAppSelector((state) => state.counter.value)
//   const dispatch = useAppDispatch()
//   return (
//     <>
//       <SEO title="Home Page" description="Describe the home page" />
//       <h1>Home Page</h1>
//       <h1>Counter: {count}</h1>
//       <button onClick={() => dispatch(counterActions.decrement())}>
//         Decrement
//       </button>
//       <button onClick={() => dispatch(counterActions.increment())}>
//         Increment
//       </button>
//     </>
//   )
// }
// export default HomePage
