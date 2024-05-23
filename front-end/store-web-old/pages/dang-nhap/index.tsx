import LayoutLogin from '@/components/Layout/LayoutLogin'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FiEyeOff, FiEye } from 'react-icons/fi'
import { useRouter } from 'next/router'
import AuthService from '@/services/auth.service'
import { useAppDispatch } from '@/hooks/reduxHook'
import { sessionActions } from '@/redux/features/sessionSlice'
import ErrorForm from '@/components/Controller/ErrorForm'
import Link from 'next/link'
import { useAppMutation } from '@/hooks/queryHook'
import Input from '@/components/Controller/Input'
import SEO from '@/components/Layout/SEO'
import { INPUT_TYPES } from '@/components/Controller/CustomInputText'
import { trackPromise } from 'react-promise-tracker'

export default function SignInPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { from } = router.query
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const mutation = useAppMutation(
    async (data: ISignInRequest) => trackPromise(AuthService.signIn(data)),
    async (res: ISignInResponse) => {
      dispatch(sessionActions.signInSuccess(res))
      router.push(`/${from ?? ''}`)
    }
  )

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => mutation.mutate(data)
  return (
    <>
      <SEO title="Đăng nhập" />
      <LayoutLogin title="Đăng nhập" description="Chào mừng bạn quay lại với Cúc Hoạ Mi, mời bạn đăng nhập để tiếp tục mua sắm!">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Input
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
            <Input
              inputType={INPUT_TYPES.TEXT}
              label="Password"
              register={register}
              patternValidate={{ required: true }}
              name="password"
              errors={errors}
              password
            />
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
