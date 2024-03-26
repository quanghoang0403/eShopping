import { ErrorMessage } from '@hookform/error-message'
import { FieldErrors, FieldValues } from 'react-hook-form'
interface IProps {
  name: string
  label?: string | JSX.Element | null
  errors: FieldErrors<FieldValues>
}

export default function ErrorForm(props: IProps) {
  const { name, label, errors } = props
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => <p className="text-red-500 pt-2 error">{errors[name]?.type === 'required' && label ? `Nhập ${label}` : message}</p>}
    />
  )
}
