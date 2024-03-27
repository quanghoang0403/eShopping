interface ISEO {
  id: string
  name: string
  titleSEO?: string
  content?: string
  keywordSEO?: string
  urlSEO: string
  descriptionSEO?: string
  description: string
}

interface IArea {
  id: number
  name: string
  lat: number | null
  lng: number | null
}

interface ICity extends IArea {
  code: string
}

interface IDistrict {
  cityId: number
  prefix: string
}

interface IWard {
  cityId: number
  districtId: number
  prefix: string
}
