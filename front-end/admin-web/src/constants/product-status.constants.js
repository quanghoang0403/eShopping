export const ProductStatus = {
  Activate: true,
  Deactivate: false
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


export const ProductGenderList = Object.keys(ProductGender).map(gender => {
  return {
    id: ProductGender[gender],
    name: genderTranslations[gender]
  }
});

