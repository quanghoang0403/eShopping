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
  code: number
}
