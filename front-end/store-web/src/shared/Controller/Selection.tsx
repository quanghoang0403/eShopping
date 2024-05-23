import { cx } from '@/utils/string.helper'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import ErrorForm from './ErrorForm'
import { SelectHTMLAttributes } from 'react'
import Label from './Label'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  sizeClass?: string
  defaultValue?: any
  disable?: boolean
  onChange?: (value: any) => void
  options: IOption[] | IArea[]
  label?: string
  hideLabel?: boolean
  name: string
  isFullWidth?: boolean
  patternValidate?: object
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
}

export default function Selection(props: SelectProps) {
  const {
    defaultValue,
    onChange,
    options,
    label,
    hideLabel,
    name,
    isFullWidth,
    register,
    patternValidate,
    errors,
    disable,
    className = '',
    sizeClass = 'h-11',
    children,
    ...args
  } = props

  const handleOnChange = (value: string | number | null | undefined) => {
    onChange && onChange(value)
  }
  const isEmpty = !(options?.length > 0)
  const classCSS = `nc-Select ${sizeClass} ${className} block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900`
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
      {label && !hideLabel && (
        <Label htmlFor={name} className="text-sm mb-1.5 inline-block">
          {' '}
          {label}
        </Label>
      )}
      <div className={cx('relative text-left', isFullWidth ? '' : 'inline-block')}>
        {register && patternValidate ? (
          <select
            className={classCSS}
            {...register(name, {
              ...patternValidate,
            })}
            onChange={(e) => handleOnChange(e.target.value)}
            name={name}
            defaultValue={defaultValue}
            disabled={disable || isEmpty}
            {...args}
          >
            {renderOptions()}
          </select>
        ) : (
          <select
            className={classCSS}
            onChange={(e) => handleOnChange(e.target.value)}
            name={name}
            defaultValue={defaultValue}
            disabled={disable || isEmpty}
            {...args}
          >
            {renderOptions()}
          </select>
        )}
      </div>
      {errors && <ErrorForm name={name} label={label} errors={errors} />}
    </>
  )
}
