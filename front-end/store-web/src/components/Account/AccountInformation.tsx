import Label from '@/shared/Controller/Label'
import React, { FC, useEffect } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import Textarea from '@/shared/Controller/Textarea'
import { avatarImgs } from '@/constants/fakeData'
import Image from 'next/image'
import Input from '@/shared/Controller/Input'
import CustomerInfo, { defaultCustomerInfo } from '../Common/Customer/CustomerInfo'
import { useAppMutation } from '@/hooks/useQuery'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/hooks/useRedux'
import CustomerService from '@/services/customer.service'
import toast from 'react-hot-toast'
import { getCustomerId } from '@/utils/common.helper'
import { useCustomerContext } from '../../../pages/account'

const AccountInformation = () => {
  const customer = useCustomerContext()
  const {
    handleSubmit: handleSubmitUpdateProfile,
    register,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all'})
  const seftUpdateAsync = async (data :any)=>{
    data.id = await getCustomerId()
    const res = await CustomerService.updateCustomer(data)
    if(res){
      toast.success('Cập nhật thông tin thành công')
    }
  }
  useEffect(()=>{
    reset({...customer})
  },[customer])
  const onSubmitUpdateProfile: SubmitHandler<FieldValues> = (data: any) => seftUpdateAsync(data)
  return (
    <div className={`nc-AccountPage `}>
      <div className="space-y-10 sm:space-y-12">
        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl font-semibold">Thông tin tài khoản</h2>
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 flex items-start">
            {/* AVATAR */}
            <div className="relative rounded-full overflow-hidden flex">
              <Image src={avatarImgs[2]} alt="avatar" width={128} height={128} className="w-32 h-32 rounded-full object-cover z-0" />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mt-1 text-xs">Cập nhật ảnh đại diện</span>
              </div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
          <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
            <form onSubmit={handleSubmitUpdateProfile(onSubmitUpdateProfile)}>
              <CustomerInfo reset={reset} register={register} errors={errors} customer={defaultCustomerInfo} />
              <ButtonPrimary className="mt-8 w-full">Cập nhật thông tin</ButtonPrimary>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountInformation
