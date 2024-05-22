import Label from '@/shared/Controller/Label'
import React from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useAppMutation } from '@/hooks/useQuery'
import CustomerService from '@/services/customer.service'
import Input from '@/shared/Controller/Input'

const AccountPass = () => {
  const {
    handleSubmit: handleSubmitUpdatePassword,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })
  const mutationUpdatePassword = useAppMutation(async (data: IUpdatePasswordRequest) => CustomerService.updatePassword(data))
  const onSubmitUpdatePassword: SubmitHandler<FieldValues> = (data: any) => mutationUpdatePassword.mutate(data)
  return (
    <div className="space-y-10 sm:space-y-12 flex items-center flex-col">
      {/* HEADING */}
      <h2 className="text-2xl sm:text-3xl font-semibold">Thay đổi mật khẩu</h2>
      <div className=" max-w-xl space-y-6 w-full">
        <form onSubmit={handleSubmitUpdatePassword(onSubmitUpdatePassword)} className="space-y-6">
          <div>
            <Input
              label="Mật khẩu hiện tại"
              password
              name="currentPassword"
              register={register}
              patternValidate={{
                required: true,
              }}
              errors={errors}
            />
          </div>
          <div>
            <Input
              label="Mật khẩu mới"
              password
              name="currentPassword"
              register={register}
              patternValidate={{
                required: true,
              }}
              errors={errors}
            />
          </div>
          <div>
            <Input
              label="Nhập lại mật khẩu mới"
              password
              name="confirmPassword"
              register={register}
              patternValidate={{
                required: true,
              }}
              errors={errors}
            />
          </div>
          <ButtonPrimary className="mt-24 w-full">Cập nhật mật khẩu</ButtonPrimary>
        </form>
      </div>
    </div>
  )
}

export default AccountPass
