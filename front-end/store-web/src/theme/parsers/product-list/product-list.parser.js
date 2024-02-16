class ProductListParser {
    _productCategories = [];
    _products = [];
    _combos = [];
    _dataPaging = undefined;
    _productByCategories = undefined;
    _categories = undefined;

    constructor() {
        this._productCategories = [];
        this._products = [];
        this._combos = [];
        this._dataPaging = undefined;
        this._productByCategories = undefined;
        this._categories = undefined;
    }

    setProductCategories(productCategories) {
        this._productCategories = productCategories;
        return this;
    }

    get dataPaging() {
        return this._dataPaging;
    }

    get productByCategories() {
        return this._productByCategories;
    }

    get categories() {
        return this._categories
    }

    setProducts(products) {
        this._products = products;
        return this;
    }

    setCombos(combos) {
        this._combos = combos;
        return this;
    }

    parse() {
        const comboCategories = [];
        const allProducts = this._products.reduce(function (r, a) {
            r[a.productCategoryId] = r[a.productCategoryId] || [];
            r[a.productCategoryId].push(a);
            return r;
        }, Object.create(null));
        this._combos && this._combos.forEach(comboCategory => {
            comboCategories.push({
                id: comboCategory.id,
                name: comboCategory.name,
                isCombo: true,
                ...comboCategory
            })
            allProducts[comboCategory.id] = comboCategory?.comboPricings || []
        });
        this._categories = [
            ...comboCategories,
            ...this._productCategories];
        const page = {};
        this._categories.forEach(_cate => {
            let totalItem = 0
            const items = allProducts[_cate.id] || undefined;
            if (items?.length) {
                totalItem = items.length;
            }
            page[_cate.id] = {totalItem, page: -1};
        })
        this._dataPaging = page;
        this._productByCategories = allProducts;
    }
}

export default ProductListParser;