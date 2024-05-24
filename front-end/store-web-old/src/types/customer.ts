enum EnumGender {
  Male = 1,
  Female = 2,
  Other = 3,
}

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
  gender: EnumGender
  code: number
}

interface ICreateCustomerRequest {
  password: string
  fullName: string
  phoneNumber: string
  email: string
  thumbnail: string
  birthday?: string
  gender: EnumGender
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
  gender: EnumGender
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
