import Index from "../../index";
import {ProductDetailComponent} from "./components/product-detail.component";

export default function ProductDetailPage(props) {
    window.showDeliveryAddressSelector = true;


    return (
        <Index
            {...props}
            contentPage={(props) => {
                return <ProductDetailComponent {...props} />
            }}
        />
    );
}
