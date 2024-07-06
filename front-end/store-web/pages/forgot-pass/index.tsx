import React, { useCallback, useState } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import Link from 'next/link'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useAppDispatch } from '@/hooks/useRedux'
import { useRouter } from 'next/router'
import AuthService from '@/services/auth.service'
import { useAppMutation } from '@/hooks/useQuery'
import Input from '@/shared/Controller/Input'
import toast from 'react-hot-toast'

const ForgotPassPage = ({}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })
  const dispatch = useAppDispatch()
  const router = useRouter()
  const query = router.query

  const handleForgotPassword = async (data: any) => {
    const res = await AuthService.forgotPassword(data)
    if(res){
      toast.success(`Đã gửi mail xác nhận đến ${data.email}`)
      router.push('./signin')
    }
  }

  const mutation = useAppMutation(handleForgotPassword, async (res: any) => {
    if (query?.email) {
      router.push('/')
    } else {
      router.push(router.asPath)
    }
    console.log(res)
  })

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => handleForgotPassword(data)
  return (
    <div className="container mb-24 lg:mb-32">
      <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20">
        <h2 className="mt-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Quên mật khẩu
        </h2>
        <span className="block text-sm mt-4 text-neutral-700 sm:text-base dark:text-neutral-200">
          Nhập email để chúng mình gửi mật khẩu mới về toàn khoản của bạn nhé!
        </span>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        {/* FORM */}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email tạo tài khoản"
            register={register}
            patternValidate={{
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ',
              },
            }}
            name="email"
            errors={errors}
          />
          <ButtonPrimary type="submit">Xác nhận</ButtonPrimary>
        </form>

        {/* ==== */}
        <span className="block text-center text-neutral-700 dark:text-neutral-300">
          Quay lại {` `}
          <Link href="/signin" className="text-green-600">
            Đăng nhập
          </Link>
          {` / `}
          <Link href="/signup" className="text-green-600">
            Đăng ký
          </Link>
        </span>
      </div>
    </div>
  )
}

export default ForgotPassPage
