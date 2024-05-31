export const ProductStatus = {
  Activate: 1,
  Deactivate: 0
}
export const ProductGender = {
  All: 0,
  Male: 1,
  Female: 2,
  Kid: 3
}

const genderTranslations = {
  All: 'Tất cả',
  Male: 'Nam',
  Female: 'Nữ',
  Kid: 'Trẻ em'
}


export const ProductGenderList = () => {
  return Object.keys(ProductGender).map(gender => {
    return {
      id: ProductGender[gender],
      name: genderTranslations[gender]
    }
  })
}

