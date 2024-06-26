interface ISignUpRequest {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

interface ISignInRequest {
  email: string
  password?: string
  token?: string
}

interface ISignInResponse {
  token: string
  refreshToken: string
  customerId: string
  accountId: string
  permissions: IPermission[]
}
