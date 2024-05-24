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
  static async deleteImage(body: { id: number; url: string }): Promise<IDeleteImageResponse> {
    return APIService.post('/delete_image', body)
  }

  static async searchByImage(file: File): Promise<ISearchImageResponse[]> {
    const formData = new FormData()
    formData.append('image', file)
    return APIServiceUpload.post('/search_by_image', formData)
  }

  static async searchByText(body: { text: string }): Promise<ISearchImageResponse[]> {
    return APIService.post('/search_by_text', body)
  }

  static async uploadImage(file: File): Promise<any> {
    const formData = new FormData()
    formData.append('image', file)
    console.log(formData)
    return await APIServiceUpload.post('/upload_image', formData)
  }
}
