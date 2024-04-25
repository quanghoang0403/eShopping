import { Card, Col, Form, Row, Tooltip, message } from "antd";
import { FnbTable } from "components/shop-table/shop-table";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PermissionKeys } from "constants/permission-key.constants";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { useSelector } from "react-redux";
import { tableSettings } from "constants/default.constants";
import BlogCategoryDataService from "data-services/blog/blog-category-data.service";
import { executeAfter } from "utils/helpers";
import { useHistory } from "react-router-dom";

export default function TableBlogCategory(){
    const [t] = useTranslation();
    const permissions = useSelector((state) => state?.session?.permissions)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [dataSource,setDataSource] = useState([]);
    const history = useHistory()
    const fetchTableData = async(keySearch = '')=>{
        const data={
            pageNumber:currentPageNumber,
            pageSize:tableSettings.pageSize,
            keySearch:keySearch
        }
        const res = await BlogCategoryDataService.getBlogCategoriesAsync(data)
        if(res){
            setDataSource(res?.blogCategories)
        }
        else{
            message.error(pageData.fetchFail)
        }
    }
    useEffect(()=>{
        fetchTableData();
    },[])
    const pageData = {
        table: {
            searchPlaceholder: t('table.searchPlaceholder'),
            no: t('table.no'),
            name: t('table.name'),
            priority: t('table.priority'),
            product: t('table.product'),
            action: t('table.action'),
            fetchFail:t('table.noDataFound')
        },
        confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
        btnDelete: t('button.delete'),
        btnIgnore: t('button.ignore'),
        confirmDelete: t('dialog.confirmDelete'),
        no: t('table.no'),
        creator: t('table.creator'),
        action: t('table.action'),
        no: t('table.no'),
        blog:t('table.blog'),
        title: t('table.title'),
        lastUpdated: t('table.lastUpdated'),
        priority: t('table.priority'),
        searchPlaceholder: t('table.searchPlaceholder'),
        blogCategoryDeleteSuccess:t('blogCategory.blogCategoryDeletedSuccess'),
        blogCategoryDeleteFail:t('blogCategory.blogCategoryDeletedFailed')
    };
    const onRemoveItem = async (id,categoryName)=>{
        try{
            const res = await BlogCategoryDataService.deleteBlogCategoryAsync(id)
            if(res){
                message.success(formatDeleteMessage(pageData.blogCategoryDeleteSuccess,categoryName));
                await fetchTableData();     
            }
        }catch(err){
            message.error(formatDeleteMessage(pageData.blogCategoryDeleteSuccess,categoryName))
        }
    }
    const onEditItem = (record)=>{
        history.push(`/blog-category/edit/${record?.id}`)
    }
    const getColumns = ()=>{
        const columns = [
            {
                key:'no',
                title: pageData.no,
                dataIndex: 'no',
                width: '5%'
            },
            {
                key:'name',
                title: pageData.title,
                dataIndex: 'name',
                width: '60%',
            },
            {
                key:'priority',
                title:pageData.priority,
                dataIndex: 'priority',
                width:'15%'
            },
            {
                key:'numberOfBlogs',
                title: pageData.blog,
                dataIndex: 'numberOfBlogs',
                width:'10%'
            },
            {
                title: pageData.table.action,
                key: 'action',
                width: '20%',
                align: 'center',
                render: (_, record) => {
                  return (
                    <>
                      {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.ADMIN) && (
                        <EditButtonComponent
                          className="mr-3"
                          onClick={() => onEditItem(record)}
                          permission={PermissionKeys.ADMIN}
                        />
                      )}
        
                      {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.ADMIN) && (
                        <DeleteConfirmComponent
                            title={pageData.confirmDelete}
                            content={formatDeleteMessage(pageData.confirmDeleteMessage,record?.name)}
                            okText={pageData.btnDelete}
                            cancelText={pageData.btnIgnore}
                            permission={PermissionKeys.ADMIN}
                            onOk={() => onRemoveItem(record?.id,record?.name)}
                        />
                      )}
                    </>
                  )
                }
              }
        ].filter(item=>!item.hidden)
        return columns
    }
    const formatDeleteMessage = (text,name) => {
        const mess = t(text, { name })
        return mess
      }
    return (
        <Form className="mt-5">
            <Card className="w-100 shop-card-full">
                <Row className="total-cost-amount-row">
                    <Col span={24}>
                        <FnbTable
                            columns={getColumns()}
                            editPermission={PermissionKeys.ADMIN}
                            deletePermission={PermissionKeys.ADMIN}
                            dataSource={dataSource}
                            // rowSelection={{
                            //     type: 'checkbox',
                            //     selectedRowKeys,
                            //     onChange: onSelectedRowKeysChange,
                            //     columnWidth: 40
                            // }}
                        />
                    </Col>
                </Row>
            </Card>
        </Form>
    );
}