import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

/* eslint-disable no-unused-vars */
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
  register?: UseFormRegister<FieldValues>
  patternValidate?: object
  errors?: FieldErrors<FieldValues>
  placeholder?: string
  hideLabel?: boolean
  value?: string
}
