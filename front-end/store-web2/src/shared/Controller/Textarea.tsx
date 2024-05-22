import React, { TextareaHTMLAttributes } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import ErrorForm from './ErrorForm'
import Label from './Label'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name?: string
  label?: string | JSX.Element | null
  customOptions?: JSX.Element[]
  patternValidate?: object
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
  placeholder?: string
  hideLabel?: boolean
  // value?: string
}

// eslint-disable-next-line react/display-name
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ register, patternValidate, className = '', children, rows = 4, errors, name = '', label, hideLabel, ...args }, ref) => {
    return (
      <>
        {label && !hideLabel && (
          <Label htmlFor={name} className="text-sm mb-1.5 inline-block">
            {' '}
            {label}
          </Label>
        )}
        {register && patternValidate ? (
          <textarea
            {...register(name, {
              ...patternValidate,
            })}
            ref={ref}
            className={`block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 ${className}`}
            rows={rows}
            {...args}
          >
            {children}
          </textarea>
        ) : (
          <textarea
            ref={ref}
            className={`block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 ${className}`}
            rows={rows}
            {...args}
          >
            {children}
          </textarea>
        )}

        {errors && <ErrorForm name={name} label={label} errors={errors} />}
      </>
    )
  }
)

export default Textarea
