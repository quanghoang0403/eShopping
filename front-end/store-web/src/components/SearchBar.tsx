import React from 'react'
import { CiSearch } from 'react-icons/ci'

interface IProps {
  onChange?: () => void
  placeholder?: string
  defaultValue?: string
}

export default function SearchBar(props: IProps) {
  const { onChange, placeholder, defaultValue } = props
  return (
    <div className="relative">
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        name="q"
        id="q"
        className="w-full px-3 py-2 border rounded-md outline-none focus:border-gray-300 focus:shadow-sm dark:bg-gray-900 dark:border-gray-600 dark:focus:border-white"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <CiSearch className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}
