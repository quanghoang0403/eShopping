interface ICustomer {
  id: string
  accountId: string
  cityId: number | null
  districtId: number | null
  wardId: number | null
  address: string
  note: string
  email: string
  emailConfirmed: boolean
  phoneNumber: string
  fullName: string
  thumbnail: string
  birthday: string | null
  gender: number
  code: number,
  orders: IOrder[]
}

interface ICustomerGeneral{
  fullName : string,
  phoneNumber? : string,
  thumbnail? : string
}
interface ICreateCustomerRequest {
  password: string
  fullName: string
  phoneNumber: string
  email: string
  thumbnail: string
  birthday?: string
  gender: number
  cityId?: number
  districtId?: number
  wardId?: number
  address: string
}

interface IUpdateCustomerRequest {
  fullName: string
  phoneNumber: string
  thumbnail: string
  email: string
  gender: number
  birthday?: string
  address: string
  cityId?: number
  districtId?: number
  wardId?: number
}

interface IUpdatePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
