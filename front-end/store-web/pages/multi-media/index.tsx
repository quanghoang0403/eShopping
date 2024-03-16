import React, { useState } from 'react'
import { ImageService } from '@/services'
import { ISearchImageResponse } from '@/services/image.service'

export default function MultiMediaPage() {
  const [text, setText] = useState<string>('')
  const [listImg, setListImg] = useState<ISearchImageResponse[]>()
  const [imageURL, setImageURL] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)
  const onChange = ({ target }: any) => setText(target.value)
  const onSearchText = async () => {
    try {
      setImageURL('')
      setLoading(true)
      const res = await ImageService.searchByText({ text })
      setListImg(res.data)
    } catch (err) {
      alert(err)
    }
    setLoading(false)
  }

  const onSearchUpload = async (event: any) => {
    const files = event.target.files

    if (files && files[0]) {
      try {
        const reader = new FileReader()
        setImageURL(URL.createObjectURL(event.target.files[0]))
        setLoading(true)
        const res = await ImageService.searchByImage(files[0])
        setListImg(res.data)
      } catch (err) {
        alert(err)
      }
    } else {
      console.log('Not choose file')
    }
    setLoading(false)
  }

  const onUpload = async (event: any) => {
    console.log('onUpload')
    const files = event.target.files

    if (files && files[0]) {
      try {
        setLoading(true)
        await ImageService.uploadImage(files[0])
        alert('Successfully uploaded')
      } catch (err) {
        alert(err)
      }
    } else {
      console.log('Not choose file')
    }
    setLoading(false)
  }

  const onDelete = async (id: number, url: string) => {
    try {
      setLoading(true)
      await ImageService.deleteImage({ id, url })
      setListImg(listImg?.filter((img) => img.id !== id))
      alert('Successfully deleted')
    } catch (err) {
      alert(err)
    }
    setLoading(false)
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onSearchText()
    }
  }

  return (
    <main>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      <div className="container mx-auto px-4 mt-20">
        <h1 className="mb-12 text-6xl font-bold mb-4 text-blue-500 text-center">
          Search Image Engine
        </h1>
        <div className="w-full w-1000 mx-auto">
          <div className="relative">
            <input
              type="text"
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              className="absolute inset-y-0 right-0 px-3 py-2 bg-blue-500 text-white rounded-md"
              onClick={onSearchText}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-2 flex">
        <div className="mr-4" style={{ flexGrow: 0.7 }}>
          <label
            htmlFor="search-file"
            className="flex flex-col items-center justify-center w-full h-14 border-2 border-blue-400 border-solid rounded-lg cursor-pointer bg-blue-50 dark:hover:bg-blue-200 bg-blue-100 hover:bg-blue-100 dark:border-blue-400 dark:hover:border-blue-500 dark:hover:bg-blue-600"
          >
            <div className="flex flex-row items-center pt-5 pb-6">
              <svg
                className="h-8 w-8 mr-4 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {' '}
                <circle cx="11" cy="11" r="8" />{' '}
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm text-blue-500 dark:text-blue-400">
                <span className="font-semibold">Search by image</span>
              </p>
            </div>
            <input
              onChange={onSearchUpload}
              id="search-file"
              type="file"
              accept="image/*"
              className="hidden"
              multiple={false}
            />
          </label>
        </div>
        <div style={{ flexGrow: 0.3 }}>
          <label
            htmlFor="upload-file"
            className="flex flex-col items-center justify-center w-full h-14 border-2 border-blue-400 border-solid rounded-lg cursor-pointer bg-blue-50 dark:hover:bg-blue-200 bg-blue-100 hover:bg-blue-100 dark:border-blue-400 dark:hover:border-blue-500 dark:hover:bg-blue-600"
          >
            <div className="flex flex-row items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mr-4 text-blue-500 dark:text-blue-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="text-sm text-blue-500 dark:text-blue-400">
                <span className="font-semibold">Upload image</span> to library
              </p>
            </div>
            <input
              onChange={onUpload}
              id="upload-file"
              type="file"
              accept="image/*"
              className="hidden"
              multiple={false}
            />
          </label>
        </div>
      </div>
      {/* Display uploaded image */}
      {imageURL && (
        <div className="mt-8 flex justify-center">
          <img src={imageURL} alt="Uploaded" className="max-w-full h-auto" />
        </div>
      )}
      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-6 gap-6">
          {listImg &&
            listImg.map((img, index) => (
              <div
                key={index}
                className="relative border border-solid border-blue-400 p-4"
              >
                <img
                  src={`/imgs/${img.url}`}
                  alt="Image"
                  className="relative object-contain"
                />
                <svg
                  onClick={() => onDelete(img.id, img.url)}
                  className="cursor-pointer absolute top-0 right-0 w-10 h-10 h-8 w-8 text-red-500"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {' '}
                  <path stroke="none" d="M0 0h24v24H0z" />{' '}
                  <line x1="18" y1="6" x2="6" y2="18" />{' '}
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            ))}
        </div>
      </div>
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
