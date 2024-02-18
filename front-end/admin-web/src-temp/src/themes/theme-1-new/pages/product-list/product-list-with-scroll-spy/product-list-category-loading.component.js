import {Spin } from 'antd';
const ProductListCategoryLoadingComponent=({isLoading=false})=>{
    if(!isLoading) return null;
    return <div style={{position:"absolute",bottom:-10,left:5, display:'flex',justifyContent:'center'}}>
        {/*{isLoading ? 'isLoading' : ''}*/}
        <Spin size={"small"}/>
        <span style={{marginLeft:10, fontSize:14}}>Loading...</span>
    </div>
}
export default ProductListCategoryLoadingComponent