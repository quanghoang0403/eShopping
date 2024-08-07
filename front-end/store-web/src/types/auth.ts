interface ISignUpRequest {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

interface ISignInWithGoogleRequest {
  email: string
  fullName: string
  thumbnail?: string
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