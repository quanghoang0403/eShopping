import { memo } from 'react'
import CustomInputText, { CustomInputTextArea, INPUT_TYPES, InputCustomProps } from './CustomInputText'
import ErrorForm from './ErrorForm'

const Input = (props: InputCustomProps) => {
  let Input: null | typeof CustomInputText | typeof CustomInputTextArea = null

  const { inputType, name, label, errors } = props
  switch (inputType) {
    case INPUT_TYPES.TEXT:
      Input = CustomInputText
      break
    case INPUT_TYPES.TEXTAREA:
      Input = CustomInputTextArea
      break
    default:
      break
  }

  if (Input !== null) {
    return (
      <>
        <Input {...props} />
        {errors && <ErrorForm name={name} label={label} errors={errors} />}
      </>
    )
  }
  return null
}

export default memo(Input)
