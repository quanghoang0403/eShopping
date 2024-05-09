import { cx } from '@/utils/string.helper'
import Input from '../Controller/Input'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import Selection from '../Controller/Selection'
import { INPUT_TYPES } from '../Controller/CustomInputText'
import { useAppQuery } from '@/hooks/queryHook'
import AddressService from '@/services/address.service'
import { useEffect, useState } from 'react'

interface IProps {
  isShipping?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  customer: ICustomerInfo
}

export interface ICustomerInfo {
  name: string
  phoneNumber: string
  email?: string
  address: string
  note?: string
  cityId: number
  districtId: number
  wardId: number
}

export const defaultCustomerInfo: ICustomerInfo = {
  name: '',
  phoneNumber: '',
  email: '',
  address: '',
  note: '',
  cityId: 0,
  districtId: 0,
  wardId: 0,
}

export default function CustomerInfo(props: IProps) {
  const { isShipping, register, errors, customer } = props
  const [cityId, setCityId] = useState<number>(customer.cityId)
  const [districtId, setDistrictId] = useState<number>(customer.districtId)

  const [cities, setCities] = useState<IArea[]>([])
  const [districts, setDistricts] = useState<IArea[]>([])
  const [wards, setWards] = useState<IArea[]>([])

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    fetchDistricts(cityId)
  }, [cityId])

  useEffect(() => {
    fetchWards(districtId)
  }, [districtId])

  const fetchCities = async () => {
    const res = await AddressService.getCities()
    if (res.data) {
      setCities(res.data.cities)
    }
  }

  const fetchDistricts = async (cityId: number) => {
    const res = await AddressService.getDistricts(cityId)
    if (res.data) {
      setDistricts(res.data.districts)
    }
  }

  const fetchWards = async (districtId: number) => {
    const res = await AddressService.getWards(districtId)
    if (res.data) {
      setWards(res.data.wards)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="md:w-1/2">
          <Input
            value={customer.name}
            inputType={INPUT_TYPES.TEXT}
            label="Tên"
            name={isShipping ? 'ShipName' : 'FullName'}
            register={register}
            patternValidate={{ required: true }}
            errors={errors}
          />
        </div>
        <div className="md:w-1/2">
          <Input
            value={customer.phoneNumber}
            inputType={INPUT_TYPES.TEXT}
            label="Số điện thoại"
            name={isShipping ? 'ShipPhoneNumber' : 'PhoneNumber'}
            register={register}
            patternValidate={{ 
              required: true,
              pattern:{
                value:/(03[2-9]|05[2689]|07[06-9]|08[1-9]|09[0-49])+([0-9]{7})\b/,
                message:"Số điện thoại không hợp lệ"

              }
             }}
            errors={errors}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="md:w-1/2">
          <Input
            value={customer.email}
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
            name={isShipping ? 'ShipEmail' : 'Email'}
            errors={errors}
          />
        </div>
        <div className="md:w-1/2">
          <Selection
            isFullWidth
            label="Tỉnh/Thành"
            options={cities}
            onChange={(value: any) => setCityId(value)}
            defaultValue={cityId}
            name={isShipping ? 'ShipCityId' : 'CityId'}
            register={register}
            patternValidate={{
              required: true,
            }}
            errors={errors}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="md:w-1/2">
          <Selection
            isFullWidth
            label="Quận/Huyện"
            options={districts}
            onChange={(value: any) => setDistrictId(value)}
            defaultValue={districtId}
            name={isShipping ? 'ShipDistrictId' : 'DistrictId'}
            register={register}
            patternValidate={{
              required: true,
            }}
            errors={errors}
          />
        </div>
        <div className="md:w-1/2">
          <Selection
            isFullWidth
            label="Phường/Xã"
            options={wards}
            defaultValue={customer.wardId}
            name={isShipping ? 'ShipWardId' : 'WardId'}
            register={register}
            patternValidate={{
              required: true,
            }}
            errors={errors}
          />
        </div>
      </div>
      <div>
        <Input
          value={customer.address}
          inputType={INPUT_TYPES.TEXT}
          label="Địa chỉ giao hàng"
          name={isShipping ? 'ShipAddress' : 'Address'}
          register={register}
          patternValidate={{
            required: true,
          }}
          errors={errors}
        />
      </div>
      <div>
        <Input value={customer.note} inputType={INPUT_TYPES.TEXT} register={register} label="Ghi chú" name="Note" />
      </div>
    </div>
  )
}
