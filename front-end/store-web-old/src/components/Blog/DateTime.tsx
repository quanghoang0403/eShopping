import { parseISO, format } from 'date-fns'

interface IProps {
  date: string
  className: string
}

export default function DateTime(props: IProps) {
  const { date, className } = props
  return (
    <time className={className} dateTime={date}>
      {format(parseISO(date), 'MMMM dd, yyyy')}
    </time>
  )
}
