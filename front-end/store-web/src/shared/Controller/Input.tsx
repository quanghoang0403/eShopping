import React, { InputHTMLAttributes, useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import ErrorForm from './ErrorForm'
import { EyeDropperIcon, EyeIcon } from '@heroicons/react/24/solid'
import Label from './Label'

interface InputProps {
  sizeClass?: string
  fontClass?: string
  rounded?: string
  name?: string
  label?: string | JSX.Element | null
  customOptions?: JSX.Element[]
  patternValidate?: object
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
  placeholder?: string
  hideLabel?: boolean
  value?: string
  password?: boolean
  className?: string
  ref?: any
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

// eslint-disable-next-line react/display-name
const Input = ({
  value,
  ref,
  password,
  errors,
  register,
  patternValidate,
  label,
  hideLabel,
  name = '',
  className = '',
  sizeClass = 'h-11 px-4 py-3',
  fontClass = 'text-sm font-normal',
  rounded = 'rounded-2xl',
  onChange,
  ...args
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const type = password && !showPassword ? 'password' : 'text'
  return (
    <>
      <div className="relative">
        {label && !hideLabel && (
          <Label htmlFor={name} className="text-sm mb-1.5 inline-block">
            {' '}
            {label}
          </Label>
        )}
        {register && patternValidate ? (
          <input
            {...register(name, {
              ...patternValidate,
            })}
            defaultValue={value || ''}
            type={type}
            name={name}
            onChange={onChange} 
            className={`block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${rounded} ${fontClass} ${sizeClass} ${className}`}
            {...args}
          />
        ) : (
          <input
            defaultValue={value || ''}
            type={type}
            name={name}
            onChange={onChange} 
            className={`block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${rounded} ${fontClass} ${sizeClass} ${className}`}
            {...args}
          />
        )}
        {password && (
          <button type="button" className="absolute my-3 right-3 transform translate-y-1/2" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeDropperIcon className="text-gray-500" /> : <EyeIcon className="text-gray-500" />}
          </button>
        )}
      </div>
      {errors && <ErrorForm name={name} label={label} errors={errors} />}
    </>
  )
}

export default Input
