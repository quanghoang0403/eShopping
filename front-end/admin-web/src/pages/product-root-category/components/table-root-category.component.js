import { Form, Row, Tooltip, message } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/shop-table/shop-table";
import { PermissionKeys } from "constants/permission-key.constants";
import { ProductGender } from "constants/product-status.constants";
import RootCategoryDataService from "data-services/product-category/product-root-category-data.service";
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { executeAfter, getAllPermissions } from "utils/helpers";

export default function TableRootCategory() {
    const history = useHistory()
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [dataSource, setDataSource] = useState(null)
    const [totalRecords, setTotalRecords] = useState(0)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const permissions = getAllPermissions()
    const [t] = useTranslation()
    const pageData = {
        btnFilter: t('button.filter'),
        btnDelete: t('button.delete'),
        btnIgnore: t('button.ignore'),
        confirmDelete: t('dialog.confirmDelete'),
        confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
        productCategoryDeleteSuccess: t('productCategory.productCategoryDeleteSuccess'),
        productCategoryUpdateSuccess: t('productCategory.productCategoryUpdateSuccess'),
        productCategoryDeleteFail: t('productCategory.productCategoryDeleteFail'),
        table: {
            searchPlaceholder: t('table.searchPlaceholder'),
            no: t('table.no'),
            name: t('table.name'),
            priority: t('table.priority'),
            product: t('table.product'),
            action: t('table.action')
        },
        product: {
            title: t('productCategory.titleProduct'),
            placeholder: t('productCategory.placeholderProduct')
        },
        productCategory: {
            title: t('root-category.productCategoryTitle')
        }
    }

    const fetchDataTableAsync = async (pageNumber, pageSize, keySearch = '', gender = ProductGender.All) => {
        const response = await RootCategoryDataService.GetProductRootCategoryAsync(pageNumber, pageSize, keySearch, gender);
        const data = response?.result?.map((s) => mappingRecordToColumns(s));
        setDataSource(data);
        setTotalRecords(response?.paging?.total);
        setCurrentPageNumber(response?.paging?.pageIndex);
    }

    const mappingRecordToColumns = item => {
        return {
            key: item?.id,
            index: item?.no,
            id: item?.id,
            name: item?.name,
            priority: item?.priority,
            numberOfProduct: item?.numberOfProduct,
            products: item?.products,
            numberOfProductCategory: item?.numberOfProductCategory,
            productCategories: item?.productCategories
        }
    }
    useEffect(() => {
        fetchDataTableAsync(currentPageNumber, tableConfigs.pageSize)
    }, [])

    const onSelectedRowKeysChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys)
    }

    const onRemoveItem = async (id) => {
        try {
            const res = await RootCategoryDataService.DeleteRootCategoryAsync(id);
            if (res) {
                message.success(pageData.productCategoryDeleteSuccess);

                // Recount selected items after delete
                const newSelectedRowKeys = selectedRowKeys?.filter((x) => x !== id);
                if (newSelectedRowKeys) {
                    setSelectedRowKeys(newSelectedRowKeys);
                }
            } else {
                message.error(pageData.productCategoryDeleteFail);
            }
            await fetchDataTableAsync(currentPageNumber, tableConfigs.pageSize, "");
        } catch (error) {
            console.error(error);
        }
    }

    const formatDeleteMessage = (name) => {
        const mess = t(pageData.confirmDeleteMessage, { name })
        return mess
    }

    const onEditItem = (item) => {
        return history.push(`/product-root-category/edit/${item?.id}`)
    }
    const tableConfigs = {
        pageSize: 20,
        columns: [
            {
                title: pageData.table.no,
                dataIndex: 'index',
                key: 'index',
                width: '10%',
                align: 'right'
            },
            {
                title: pageData.table.name,
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                className: 'category-name-column',
                ellipsis: {
                    showTitle: false
                },
                render: (_, record) => <Tooltip title={record?.name}>{record?.name}</Tooltip>
            },
            {
                title: pageData.table.priority,
                dataIndex: 'priority',
                key: 'priority',
                width: '15%',
                align: 'right'
            },
            {
                title: pageData.table.product,
                dataIndex: 'numberOfProduct',
                key: 'numberOfProduct',
                width: '15%',
                align: 'right',
                render: (_, record) => (
                    <div>
                        {/* <a
                    onClick={() => {
                      onHandleSelectedProductCategory(record, '')
                    }}
                  > */}
                        {record?.numberOfProduct}
                        {/* </a> */}
                    </div>
                )
            },
            {
                title: pageData.productCategory.title,
                dataIndex: 'numberOfProductCategory',
                key: 'numberOfProductCategory',
                width: '15%',
                align: 'right',
                render: (_, record) => (
                    <div>
                        {/* <a
                    onClick={() => {
                      onHandleSelectedProductCategory(record, '')
                    }}
                  > */}
                        {record?.numberOfProductCategory}
                        {/* </a> */}
                    </div>
                )
            },
            {
                title: pageData.table.action,
                key: 'action',
                width: '15%',
                align: 'center',
                render: (_, record) => {
                    return (
                        <>
                            {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.EDIT_PRODUCT_CATEGORY) && (
                                <EditButtonComponent
                                    className="mr-3"
                                    onClick={() => onEditItem(record)}
                                    permission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
                                />
                            )}

                            {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.EDIT_PRODUCT_CATEGORY) && (
                                <DeleteConfirmComponent
                                    title={pageData.confirmDelete}
                                    content={formatDeleteMessage(record?.name)}
                                    okText={pageData.btnDelete}
                                    cancelText={pageData.btnIgnore}
                                    permission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
                                    onOk={() => onRemoveItem(record?.id)}
                                    productCategoryId={record?.id}
                                    productCategoryName={record?.name}
                                />
                            )}
                        </>
                    )
                }
            }
        ],
        onChangePage: async (page, pageSize) => {
            await fetchDataTableAsync(page, pageSize, '')
        },
        onSearch: async (keySearch) => {
            executeAfter(500, async () => {
                await fetchDataTableAsync(1, tableConfigs.pageSize, keySearch)
            })
        }
    }
    return (
        <>
            <Form className="form-staff">
                <Row>
                    <FnbTable
                        className="mt-4"
                        columns={tableConfigs.columns}
                        pageSize={tableConfigs.pageSize}
                        dataSource={dataSource}
                        currentPageNumber={currentPageNumber}
                        total={totalRecords}
                        onChangePage={tableConfigs.onChangePage}
                        editPermission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
                        deletePermission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys,
                            onChange: onSelectedRowKeysChange,
                            columnWidth: 40
                        }}
                        search={{
                            placeholder: pageData.table.searchPlaceholder,
                            onChange: tableConfigs.onSearch
                        }}
                    />
                </Row>
            </Form>
        </>
    )
}