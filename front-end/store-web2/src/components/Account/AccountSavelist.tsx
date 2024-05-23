import ButtonSecondary from '@/shared/Button/ButtonSecondary'

const AccountSavelist = () => {
  return (
    <div className="space-y-10 sm:space-y-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">Sản phẩm yêu thích</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 ">{/* <ProductList data={data}/> */}</div>
      <div className="flex !mt-20 justify-center items-center">
        <ButtonSecondary loading>Show me more</ButtonSecondary>
      </div>
    </div>
  )
}

export default AccountSavelist
