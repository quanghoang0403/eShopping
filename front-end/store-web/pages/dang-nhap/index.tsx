import LayoutLogin from '@/components/Layout/LayoutLogin'
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FiEyeOff, FiEye } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from 'react-query'
import { ISignInRequest, ISignInResponse } from '@/services/auth.service'
import AuthService from '@/services/auth.service'
import { useAppDispatch } from '@/hooks/reduxHook'
import { authActions } from '@/redux/features/authSlice'
import { notifyError } from '@/components/Notification'
import ErrorForm from '@/components/Input/ErrorForm'
import Link from 'next/link'
import { useAppMutation, useAppQuery } from '@/hooks/queryHook'
import ControlledInput from '@/components/Input/ControlledInput'
import { INPUT_TYPES } from '@/components/Input/type'
import SEO from '@/components/Layout/SEO'

export default function SignInPage() {
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

  const handleSignIn = useCallback(async (data: ISignInRequest) => {
    return AuthService.signIn(data)
  }, [])

  const mutation = useAppMutation(handleSignIn, async (res: ISignInResponse) => {
    if (query?.email) {
      router.push('/')
    } else {
      router.push(router.asPath)
    }
    console.log(res)
  })

  // useAppQuery(
  //   ['getNewsById'],
  //   () => handleSignIn({ email: 'customer@gmail.com', password: '1' }),
  //   () => console.log(1)
  // )

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => mutation.mutate(data)
  return (
    <>
      <SEO title="Đăng nhập" />
      <LayoutLogin title="Đăng nhập" description="Chào mừng bạn quay lại với Cúc Hoạ Mi, mời bạn đăng nhập để tiếp tục mua sắm!">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <ControlledInput
              inputType={INPUT_TYPES.TEXT}
              label="Email"
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
              Password
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
            <button
              type="submit"
              className="mt-2 w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-700 text-center">
          <p>
            Chưa có tài khoản?{' '}
            <Link href="/dang-ky" className="text-black hover:underline font-semibold">
              Đăng ký
            </Link>
          </p>
        </div>
      </LayoutLogin>
    </>
  )
}
