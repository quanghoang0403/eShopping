import { cx } from '@/utils/common.helper'
import Input from './Controller/Input'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import Selection, { IOption } from './Controller/Selection'
import { INPUT_TYPES } from './Controller/CustomInputText'
import { useAppQuery } from '@/hooks/queryHook'

interface IProps {
  isShipping?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

export default function CustomerInfo(props: IProps) {
  const { isShipping, register, errors } = props

  // const cities = useAppQuery(
  //   ['getNewsById'],
  //   () => handleSignIn({ email: 'customer@gmail.com', password: '1' }),
  //   () => console.log(1)
  // )
  const cities: IOption[] = [
    { id: 1, name: 'Hà Nội' },
    { id: 2, name: 'Hồ Chí Minh' },
    { id: 3, name: 'Đà Nẵng' },
  ]
  const districts: IOption[] = [
    { id: 1, name: 'Quận 1' },
    { id: 2, name: 'Quận 2' },
    { id: 3, name: 'Quận Bình Thạnh' },
  ]
  const wards: IOption[] = [
    { id: 1, name: 'Phường 17' },
    { id: 2, name: 'Phường 1' },
    { id: 3, name: 'Phường 2' },
  ]
  return (
    <div className="space-y-3">
      <div className="md:flex gap-2">
        <div className="md:w-1/2">
          <Input
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
            inputType={INPUT_TYPES.TEXT}
            label="Số điện thoại"
            name={isShipping ? 'ShipPhoneNumber' : 'PhoneNumber'}
            register={register}
            patternValidate={{ required: true }}
            errors={errors}
          />
        </div>
      </div>
      <div className="md:flex gap-2">
        <div className="md:w-1/2">
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
            name={isShipping ? 'ShipEmail' : 'Email'}
            errors={errors}
          />
        </div>
        <div className="md:w-1/2">
          <Selection
            isFullWidth
            label="Tỉnh/Thành"
            options={cities}
            name={isShipping ? 'ShipCityId' : 'CityId'}
            register={register}
            patternValidate={{
              required: true,
            }}
            errors={errors}
          />
        </div>
      </div>
      <div className="md:flex gap-2">
        <div className="md:w-1/2">
          <Selection
            isFullWidth
            label="Quận/Huyện"
            options={districts}
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
        <Input inputType={INPUT_TYPES.TEXT} register={register} label="Ghi chú" name="Note" />
      </div>
    </div>
  )
}
