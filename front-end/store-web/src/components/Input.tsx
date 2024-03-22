import { ErrorMessage } from '@hookform/error-message'
import { FieldErrors } from 'react-hook-form'

interface IProps {
  name: string
  errors: FieldErrors
}

export default function ErrorForm(props: IProps) {
  const { name, errors } = props
  return <ErrorMessage errors={errors} name={name} render={({ message }) => <p className="text-red-500 pt-2 error">{message}</p>} />
}
