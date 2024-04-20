import { useMutation, useQuery } from 'react-query'
import { notifyError } from '@/components/Common/Notification'
import { AxiosResponse } from 'axios'

// Use throughout your app instead of plain `useMutation` and `useAppQuery`
export const useAppMutation = (request: any, onSuccessRequest?: any) => {
  return useMutation(request, {
    onSuccess: async (res: AxiosResponse) => {
      onSuccessRequest(res.data)
    },
    onError: (error: any) => {
      notifyError(error.message)
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
      notifyError(error.message)
    },
  })?.data
}
