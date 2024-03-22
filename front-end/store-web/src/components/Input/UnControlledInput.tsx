import { memo } from 'react'
import { INPUT_TYPES, InputCustomProps } from './type'
import CustomInputText, { CustomInputTextArea } from './CustomInputText'

const UncontrolledInput = (props: InputCustomProps) => {
  let Input: null | typeof CustomInputText | typeof CustomInputTextArea = null

  const { inputType } = props

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
      </>
    )
  }
  return null
}

export default memo(UncontrolledInput)
