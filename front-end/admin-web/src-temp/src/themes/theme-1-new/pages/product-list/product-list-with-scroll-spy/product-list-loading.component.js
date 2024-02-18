import {useMemo} from "react";
import {Space} from 'antd';
import {FnbLoadingSpinner} from "../../../components/fnb-loading-spinner/fnb-loading-spinner.component";
import {StyleLoadingProducts} from './product-list-with-scroll-spy.styled';

const ProductListLoadingComponent = () => {
    const headers = document.querySelectorAll('.theme1-original-header') || [];
    const heightFooter = document.getElementById('themeFooter')?.clientHeight || 0;
    const heightHeader = headers.length > 0 ? headers[0]?.clientHeight || 0 : 0;
    const heightDeliverySection = document.getElementById('deliveryAddressSelector')?.clientHeight || 0;
    const heightContent = useMemo(() => {
        return heightFooter + heightHeader + heightDeliverySection;
    }, [heightFooter, heightHeader, heightDeliverySection])
    return <div style={{height: `calc(100vh - ${heightContent}px)`}}>
        <Space direction="vertical" style={StyleLoadingProducts}>
            <FnbLoadingSpinner/>
        </Space>
    </div>
}
export default ProductListLoadingComponent;