import { useMutation, useQuery } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

// Use throughout your app instead of plain `useMutation` and `useAppQuery`
export const useAppMutation = (request: any, onSuccessRequest?: any) => {
  return useMutation(request, {
    onSuccess: async (res: AxiosResponse) => {
      onSuccessRequest(res.data)
    },
    onError: (error: AxiosError) => {
      toast.error(error.message)
      // if (error.response?.status == HttpStatus.BadRequest) notifyError('Yêu cầu không hợp lệ')
      // else if (error.response?.status == HttpStatus.Unauthorized) notifyError('Vui lòng đăng nhập để tiếp tục')
      // else if (error.response?.status == HttpStatus.Forbidden) notifyError('Bạn không có quyền sử dụng tính năng này')
      // else if (error.response?.status == HttpStatus.NotFound) notifyError('Không tìm thấy yêu cầu')
      // else if (error.response?.status == HttpStatus.MethodNotAllowed) notifyError('Phương thức không hợp lệ')
      // else if (error.response?.status == HttpStatus.InternalServerError) notifyError(error.message)
      // else notifyError(error.message)
    },
  })
}

// export const useAppQuery = (key: string[], request: any, onSuccessRequest?: any) => {
//   return useQuery(key, () => request, {
//     onSuccess: async (res) => {
//       onSuccessRequest && onSuccessRequest(res)
//     },
//     onError: (error: any) => {
//       notifyError(error.message)
//     },
//   })
// }

export const useAppQuery = (key: string[], request: any, initialData?: any, onSuccessRequest?: any) => {
  return useQuery({
    queryKey: key,
    queryFn: request,
    initialData: initialData,
    // enabled: !initialData,
    onSuccess: async (res: AxiosResponse) => {
      onSuccessRequest && onSuccessRequest(res.data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })?.data
}
