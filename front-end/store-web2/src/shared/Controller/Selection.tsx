import { cx } from '@/utils/string.helper'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import ErrorForm from './ErrorForm'

interface IProps {
  defaultValue?: any
  disable?: boolean
  onChange?: (value: string | number | null | undefined) => void
  options: IOption[] | IArea[]
  label?: string
  name: string
  className?: string
  isFullWidth?: boolean
  patternValidate?: object
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
}

export default function Selection(props: IProps) {
  const { defaultValue, onChange, options, label, name, className, isFullWidth, register, patternValidate, errors, disable } = props

  const handleOnChange = (value: string | number | null | undefined) => {
    onChange && onChange(value)
  }
  const isEmpty = !(options?.length > 0)
  const classCSS =
    'px-3 py-2 w-full pr-7 appearance-none rounded-md shadow cursor-pointer border border-gray-400 focus:outline-none focus:ring focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-auto'
  const renderOptions = () => {
    return (
      <>
        {!defaultValue && <option disabled selected hidden value=""></option>}
        {!isEmpty &&
          options.map((option, index) => (
            <option key={index} value={option.id} selected={option.id == defaultValue}>
              {option.name ?? option.id}
            </option>
          ))}
      </>
    )
  }
  return (
    <>
      {label && (
        <label htmlFor={name} className="block text-base font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className={cx('relative text-left', isFullWidth ? '' : 'inline-block')}>
        {register && patternValidate ? (
          <select
            className={cx(classCSS, className)}
            {...register(name, {
              ...patternValidate,
            })}
            onChange={(e) => handleOnChange(e.target.value)}
            name={name}
            defaultValue={defaultValue}
            disabled={disable || isEmpty}
          >
            {renderOptions()}
          </select>
        ) : (
          <select
            className={cx(classCSS, className)}
            onChange={(e) => handleOnChange(e.target.value)}
            name={name}
            defaultValue={defaultValue}
            disabled={disable || isEmpty}
          >
            {renderOptions()}
          </select>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {errors && <ErrorForm name={name} label={label} errors={errors} />}
    </>
  )
}
