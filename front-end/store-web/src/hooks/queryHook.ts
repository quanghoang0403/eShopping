import { useMutation, useQuery } from 'react-query'
import { notifyError } from '@/components/Notification'

export const useAppMutation = (request: any, onSuccessRequest: any) => {
  return useMutation(request, {
    onSuccess: async (res) => onSuccessRequest(res),
    onError: (error: any) => {
      notifyError(error.message)
    },
  })
}

// export const useAppQuery = <TData = any, TVariables = any>(
//   query: Request<TData, TVariables>,
//   onSuccessRequest: Function
// ) => {
//   return useQuery<TData, any, TVariables>(query, {
//     // Set default options here, e.g., staleTime, refetchInterval, etc.
//     ...options, // Apply any additional options passed in
//   });
// };
