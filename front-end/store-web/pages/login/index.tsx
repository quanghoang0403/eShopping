import React, { FC, useState } from 'react'
import googleSvg from '@/assets/images/Google.svg'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import Image from 'next/image'
import Link from 'next/link'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useAppDispatch } from '@/hooks/useRedux'
import { useRouter } from 'next/router'
import { useAppMutation } from '@/hooks/useQuery'
import { trackPromise } from 'react-promise-tracker'
import { sessionActions } from '@/redux/features/sessionSlice'
import AuthService from '@/services/auth.service'
import Input from '@/shared/Controller/Input'
import toast from 'react-hot-toast'
import { PermissionIdConstants } from '@/constants/default.constants'

// const loginSocials = [
//   {
//     name: 'Continue with Google',
//     href: '#',
//     icon: googleSvg,
//   },
// ]

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { from } = router.query

  const mutation = useAppMutation(
    async (data: ISignInRequest) => trackPromise(AuthService.signIn(data)),
    async (res: ISignInResponse) => {
      if (res && res.customerId && res.accountId && res.token && res.refreshToken && 
        res.permissions && res.permissions.length > 0 && res.permissions.some(p => p.id == PermissionIdConstants.STORE_WEB)
      ) {
        dispatch(sessionActions.signInSuccess(res))
        router.push(`/${from ?? ''}`)
      }
      else {
        toast.error('Đăng nhập thất bại')
      }
    }
  )

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => mutation.mutate(data)
  return (
    <div className={`nc-LoginPage`} data-nc-id="LoginPage">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Đăng nhập
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image className="flex-shrink-0" src={item.icon} alt={item.name} sizes="40px" />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">{item.name}</h3>
              </a>
            ))}
          </div> */}
          {/* OR */}
          {/* <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">Hoặc</span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div> */}
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
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
            <Input label="Password" register={register} patternValidate={{ required: true }} name="password" errors={errors} password />
            <ButtonPrimary type="submit">Đăng nhập</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Chưa có tài khoản? {` `}
            <Link className="text-green-600" href="/signup">
              Tạo tài khoản
            </Link>
          </span>
          <Link className="block text-center text-green-600" href="/forgot-pass">
            Quên mật khẩu
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
