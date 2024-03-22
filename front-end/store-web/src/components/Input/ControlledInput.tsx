import React, { memo } from 'react'
import { InputCustomProps } from './type'
import UncontrolledInput from './UnControlledInput'
import ErrorForm from './ErrorForm'

const ControlledInput = (props: InputCustomProps) => {
  const { name, label, errors } = props

  return (
    <>
      <UncontrolledInput {...props} />
      {errors && <ErrorForm name={name} label={label} errors={errors} />}
    </>
  )
}

export default memo(ControlledInput)
