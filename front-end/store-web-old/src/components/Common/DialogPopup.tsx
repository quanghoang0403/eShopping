import { Button, Carousel, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react'
import { PropsWithChildren, ReactNode } from 'react'

interface IProps {
  open: boolean
  title?: string
  content: ReactNode | string
  msgCancel?: string
  msgConfirm?: string
  onCancel?: () => void
  onConfirm?: () => void
  onHandle: () => void
  className?: string
}

export default function DialogPopup(props: IProps) {
  const { open, title, content, msgCancel, msgConfirm, onCancel, onConfirm, onHandle, className } = props

  return (
    <>
      <Dialog open={open} handler={onHandle} className="p-2 ">
        {title && <DialogHeader className="justify-center">{title}</DialogHeader>}
        <DialogBody className="text-center">{content}</DialogBody>
        <DialogFooter className="flex justify-around">
          {msgCancel && (
            <Button variant="text" color="red" onClick={onCancel || onHandle} className="mr-1">
              <span>{msgCancel}</span>
            </Button>
          )}
          {msgConfirm && (
            <Button variant="gradient" color="blue" onClick={onConfirm || onHandle}>
              <span>{msgConfirm}</span>
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </>
  )
}
