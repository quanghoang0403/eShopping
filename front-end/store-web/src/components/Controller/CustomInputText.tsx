import React, { memo, useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export enum INPUT_TYPES {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  PASSWORD = 'PASSWORD',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
}

export type InputCustomProps = {
  inputType: INPUT_TYPES
  name: string
  label?: string | JSX.Element | null
  customOptions?: JSX.Element[]
  ref: any
  patternValidate?: object
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
  placeholder?: string
  hideLabel?: boolean
  value?: string
  password?: boolean
}
type IProps = InputCustomProps

export const CustomInputText: React.FC<IProps> = (props) => {
  const { name, label, register, patternValidate, hideLabel, value, password } = props
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      {label && !hideLabel && (
        <label htmlFor={name} className="block text-base font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {register && patternValidate ? (
          <input
            type={password && showPassword ? 'password' : 'text'}
            id={name}
            className="mt-2 px-3 py-2 w-full rounded-md shadow border border-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            {...register(name, {
              ...patternValidate,
            })}
            name={name}
            defaultValue={value || ''}
          />
        ) : (
          <input
            type={password && showPassword ? 'password' : 'text'}
            id={name}
            className="mt-2 px-3 py-2 mt-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            name={name}
            defaultValue={value || ''}
          />
        )}
        {password && (
          <button type="button" className="absolute my-3 right-3 transform translate-y-1/2" onClick={togglePasswordVisibility}>
            {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
          </button>
        )}
      </div>
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
