import React, { memo } from 'react'
import { InputCustomProps } from './type'

type IProps = InputCustomProps

export const CustomInputText: React.FC<IProps> = (props) => {
  const { name, label, register, patternValidate, hideLabel, value } = props

  return (
    <>
      {label && !hideLabel && (
        <label htmlFor={name} className="block text-base font-medium text-gray-700">
          {label}
        </label>
      )}
      {register && patternValidate ? (
        <input
          type={'text'}
          id={name}
          className="px-3 py-2 mt-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          {...register(name, {
            ...patternValidate,
          })}
          name={name}
          defaultValue={value || ''}
        />
      ) : (
        <input
          type={'text'}
          id={name}
          className="px-3 py-2 mt-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          name={name}
          defaultValue={value || ''}
        />
      )}
    </>
  )
}

export const CustomInputTextArea: React.FC<IProps> = (props) => {
  const { name, label, register, patternValidate, hideLabel, value } = props
  return (
    <>
      {label && !hideLabel && (
        <label className="block text-base font-medium text-gray-700" htmlFor={name}>
          {label}
        </label>
      )}
      {register && patternValidate ? (
        <textarea
          id={name}
          className="relative px-3 py-2 mt-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          {...register(name, {
            ...patternValidate,
          })}
          name={name}
          defaultValue={value || ''}
        ></textarea>
      ) : (
        <textarea
          id={name}
          className="relative h-100 px-3 py-2 mt-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          name={name}
          defaultValue={value || ''}
        ></textarea>
      )}
    </>
  )
}

export default memo(CustomInputText)
