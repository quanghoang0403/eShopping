import { FieldErrors, FieldValues, UseFormRegister, UseFormReset } from 'react-hook-form'
import AddressService from '@/services/address.service'
import { useEffect, useState } from 'react'
import Input from '@/shared/Controller/Input'
import Selection from '@/shared/Controller/Selection'

interface IProps {
  isShipping?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  customer: ICustomer
  reset : UseFormReset<FieldValues>
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
  const [cities, setCities] = useState<IArea[]>([])
  const [districts, setDistricts] = useState<IArea[]>([])
  const [wards, setWards] = useState<IArea[]>([])
  const [cityId,setCityId] = useState<number>()
  const [districtId,setDistrictId] = useState<number>()

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    fetchDistricts(cityId as number ?? customer?.cityId as number)
  }, [customer, cityId])

  useEffect(() => {
    fetchWards(districtId as number ?? customer?.districtId as number)
  }, [customer, districtId])

  const fetchCities = async () => {
    const res = await AddressService.getCities()
    if (res) {
      setCities(res)
    }
  }

  const fetchDistricts = async (cityId: number) => {
    const res = await AddressService.getDistricts(cityId)
    if (res) {
      setDistricts(res)
    }
  }

  const fetchWards = async (districtId: number) => {
    const res = await AddressService.getWards(districtId)
    if (res) {
      setWards(res)
    }
  }

  const onChangeCity = (cityId: number)=>{
    setCityId(cityId)
    props.reset({wardId: 0, districtId : 0})
  }

  const onChangeDistrict = (districtId: number)=>{
    setDistrictId(districtId)
    props.reset({wardsId: 0})
  }

  return (
    <>
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row items-start p-6 ">
          <span className="hidden sm:block">
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-300 flex ">
              <span className="uppercase tracking-tight">Thông tin giao hàng</span>
            </h3>
          </div>
        </div>
        <div className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 block`}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="md:w-1/2">
              <Input
                
                label="Tên"
                name={isShipping ? 'ShipName' : 'fullName'}
                register={register}
                patternValidate={{ required: true }}
                errors={errors}
              />
            </div>
            <div className="md:w-1/2">
              <Input
                
                label="Số điện thoại"
                name={isShipping ? 'ShipPhoneNumber' : 'phoneNumber'}
                register={register}
                patternValidate={{
                  required: true,
                  pattern: {
                    value: /(03[2-9]|05[2689]|07[06-9]|08[1-9]|09[0-49])+([0-9]{7})\b/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                }}
                errors={errors}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="md:w-1/2">
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
                name={isShipping ? 'ShipEmail' : 'email'}
                errors={errors}
              />
            </div>
            <div className="md:w-1/2">
              <Selection
                isFullWidth
                label="Tỉnh/Thành"
                options={cities}
                onChange={e=>onChangeCity(e)}
                name={isShipping ? 'ShipCityId' : 'cityId'}
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
                onChange={e=>onChangeDistrict(e)}
                label="Quận/Huyện"
                options={districts}
                name={isShipping ? 'ShipDistrictId' : 'districtId'}
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
                name={isShipping ? 'ShipWardId' : 'wardId'}
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
              label="Địa chỉ giao hàng"
              name={isShipping ? 'ShipAddress' : 'address'}
              register={register}
              patternValidate={{
                required: true,
              }}
              errors={errors}
            />
          </div>
          <div>
            <Input value={customer?.note} register={register} label="Ghi chú" name="note" />
          </div>
        </div>
      </div>
    </>
  )
}
