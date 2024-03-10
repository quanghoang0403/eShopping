import { AxiosResponse } from 'axios'
import APIService, { APIServiceUpload } from './base'


export interface IDeleteImageResponse {
  message: string
  url: string
}

export interface ISearchImageResponse {
  id: number
  url: string
}

export default class ImageService {
  static async deleteImage(body: {
    id: number,
    url: string
  }): Promise<AxiosResponse<IDeleteImageResponse>> {
    return APIService.post('/delete_image', body)
  }

  static async searchByImage(file: File): Promise<AxiosResponse<ISearchImageResponse[]>> {
    const formData = new FormData()
    formData.append('image', file)
    return APIServiceUpload.post('/search_by_image', formData)
  }

  static async searchByText(body: {
    text: string
  }): Promise<AxiosResponse<ISearchImageResponse[]>> {
    return APIService.post('/search_by_text', body)
  }

  static async uploadImage(file: File): Promise<AxiosResponse<any>> {
    const formData = new FormData()
    formData.append('image', file)
    console.log(formData);
    return await APIServiceUpload.post('/upload_image', formData)
  }
}
