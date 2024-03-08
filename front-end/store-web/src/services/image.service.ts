import { AxiosResponse } from 'axios'
import APIService, { APIServiceUpload } from './base'

// Define interfaces for request and response bodies
export interface IUploadImagesResponse {
  message: string
  filenames: string[]
}

export interface IDeleteImageResponse {
  message: string
  url: string
}

export default class ImageService {
  static async uploadImages(
    files: File[]
  ): Promise<AxiosResponse<IUploadImagesResponse>> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files[]', file)
    })
    return await APIServiceUpload.post('/upload_images', formData)
  }

  static async deleteImage(body: {
    url: string
  }): Promise<AxiosResponse<IDeleteImageResponse>> {
    return APIService.delete('/delete_image', body)
  }

  static async searchByImage(file: File): Promise<AxiosResponse<string[]>> {
    const formData = new FormData()
    formData.append('image', file)
    return APIServiceUpload.post('/search_by_image', formData)
  }

  static async searchByText(body: {
    text: string
  }): Promise<AxiosResponse<string[]>> {
    return APIService.post('/search_by_text', body)
  }
}
