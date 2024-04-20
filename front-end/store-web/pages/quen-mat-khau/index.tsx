import LayoutLogin from '@/components/Layout/LayoutLogin'
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FiEyeOff, FiEye } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import AuthService from '@/services/auth.service'
import { useAppDispatch } from '@/hooks/reduxHook'
import { sessionActions } from '@/redux/features/sessionSlice'
import { notifyError } from '@/components/Common/Notification'
import ErrorForm from '@/components/Controller/ErrorForm'
import Link from 'next/link'
import { useAppMutation } from '@/hooks/queryHook'
import Input from '@/components/Controller/Input'
import SEO from '@/components/Layout/SEO'
import { INPUT_TYPES } from '@/components/Controller/CustomInputText'

export default function ForgotPasswordPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })
  const dispatch = useAppDispatch()
  const router = useRouter()
  const query = router.query
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPassword = useCallback(async (data: IForgotPasswordRequest) => {
    return AuthService.forgotPassword(data)
  }, [])

  const mutation = useAppMutation(handleForgotPassword, async (res: any) => {
    if (query?.email) {
      router.push('/')
    } else {
      router.push(router.asPath)
    }
    console.log(res)
  })

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => mutation.mutate(data)
  return (
    <>
      <SEO title="Quên mật khẩu" />
      <LayoutLogin title="Bạn đã quên mật khẩu" description="Mời bạn điền thông tin để Cúc Họa Mi hỗ trợ bạn tạo mật khẩu mới!">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Input
              inputType={INPUT_TYPES.TEXT}
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
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-700">
              Nhập mật khẩu mới
            </label>
            <div className="relative">
              <input
                {...register('password', { required: 'Vui lòng điền mật khẩu' })}
                type={showPassword ? 'text' : 'password'}
                className="px-3 py-2 mt-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <button type="button" className="absolute my-3 right-3 transform translate-y-1/2" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
              </button>
            </div>
            <ErrorForm errors={errors} name="password" />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="block text-base font-medium text-gray-700">
              Nhập lại mật khẩu mới
            </label>
            <div className="relative">
              <input
                {...register('passwordConfirm', { required: 'Vui lòng điền mật khẩu' })}
                type={showPassword ? 'text' : 'password'}
                className="px-3 py-2 mt-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <button type="button" className="absolute my-3 right-3 transform translate-y-1/2" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
              </button>
            </div>
            <ErrorForm errors={errors} name="passwordConfirm" />
          </div>
          <div>
            <button
              type="submit"
              className="mt-2 w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
            >
              Lấy lại mật khẩu
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-700 text-center">
          <p>
            Đã có tài khoản?{' '}
            <Link href="/dang-nhap" className="text-black hover:underline font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
        <div className="mt-4 text-sm text-gray-700 text-center">
          <p>
            Chưa có tài khoản?{' '}
            <Link href="/dang-nhap" className="text-black hover:underline font-semibold">
              Đăng ký
            </Link>
          </p>
        </div>
      </LayoutLogin>
    </>
  )
}
