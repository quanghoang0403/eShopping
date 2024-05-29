import { Card, Col, Form, Row, Tooltip, message } from 'antd';
import { ShopTable } from 'components/shop-table/shop-table';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { PermissionKeys } from 'constants/permission-key.constants';
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component';
import { EditButtonComponent } from 'components/edit-button/edit-button.component';
import { useSelector } from 'react-redux';
import { tableSettings } from 'constants/default.constants';
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service';
import { useHistory } from 'react-router-dom';
import TableBlog from './blog-in-category.modal';
import BlogDataService from 'data-services/blog/blog-data.service';
import { executeAfter, getAllPermissions } from 'utils/helpers';

export default function TableBlogCategory() {
  const [t] = useTranslation();
  const permissions = getAllPermissions();
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [dataSource, setDataSource] = useState([]);
  const [blogCategory, setBlogCategory] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const history = useHistory()
  const fetchTableData = async (keySearch = '') => {
    const data = {
      pageNumber: currentPageNumber,
      pageSize: tableSettings.pageSize,
      keySearch: keySearch
    }
    const res = await BlogCategoryDataService.getBlogCategoriesAsync(data)
    if (res) {
      setDataSource(res?.result)
    }
    else {
      message.error(pageData.fetchFail)
    }
  }
  const onOpenModal = (record) => {
    setIsOpenModal(true)
    setBlogCategory(record)
  }
  const getBlogs = async () => {
    const blogs = await BlogDataService.getAllBlogsAsync()
    const allBlog = blogs
    if (allBlog) {
      setBlogs(allBlog)
    }
  }
  useEffect(() => {
    fetchTableData();
    getBlogs();
  }, [])
  const pageData = {
    table: {
      searchPlaceholder: t('table.searchPlaceholder'),
      no: t('table.no'),
      name: t('table.name'),
      priority: t('table.priority'),
      product: t('table.product'),
      action: t('table.action'),
      fetchFail: t('table.noDataFound')
    },
    updateSuccess: t('blogCategory.categoryUpdateSuccess'),
    updateFail: t('blogCategory.categoryUpdateFail'),
    confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
    btnDelete: t('button.delete'),
    btnIgnore: t('button.ignore'),
    confirmDelete: t('dialog.confirmDelete'),
    no: t('table.no'),
    creator: t('table.creator'),
    action: t('table.action'),
    blog: t('table.blog'),
    title: t('table.title'),
    lastUpdated: t('table.lastUpdated'),
    priority: t('table.priority'),
    searchPlaceholder: t('table.searchPlaceholder'),
    blogCategoryDeleteSuccess: t('blogCategory.blogCategoryDeletedSuccess'),
    blogCategoryDeleteFail: t('blogCategory.blogCategoryDeletedFailed'),
    addBlogFail: t('blogCategory.addBlogFail')
  };
  const onRemoveItem = async (id, categoryName) => {
    try {
      const res = await BlogCategoryDataService.deleteBlogCategoryAsync(id)
      if (res) {
        message.success(formatDeleteMessage(pageData.blogCategoryDeleteSuccess, categoryName));
        await fetchTableData();
      }
    } catch (err) {
      message.error(formatDeleteMessage(pageData.blogCategoryDeleteSuccess, categoryName))
    }
  }
  const onEditItem = (record) => {
    history.push(`/blog-category/edit/${record?.id}`)
  }
  const tableConfigs = {
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchTableData(keySearch)
      })
    }
  }
  const getColumns = () => {
    const columns = [
      {
        key: 'no',
        title: pageData.no,
        dataIndex: 'no',
        width: '5%'
      },
      {
        key: 'name',
        title: pageData.title,
        dataIndex: 'name',
        width: '60%'
      },
      {
        key: 'priority',
        title: pageData.priority,
        dataIndex: 'priority',
        width: '15%'
      },
      {
        key: 'numberOfBlogs',
        title: pageData.blog,
        dataIndex: 'numberOfBlogs',
        width: '10%',
        render: (text, record) => {
          return <a onClick={() => onOpenModal(record)}>{text}</a>
        }
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
                  content={formatDeleteMessage(pageData.confirmDeleteMessage, record?.name)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  permission={PermissionKeys.ADMIN}
                  onOk={() => onRemoveItem(record?.id, record?.name)}
                />
              )}
            </>
          )
        }
      }
    ].filter(item => !item.hidden)
    return columns
  }
  const formatDeleteMessage = (text, name) => {
    const mess = t(text, { name })
    return mess
  }
  const onHandleRemoveModalBlog = (id) => {
    const tempCategory = { ...blogCategory, blogs: blogCategory.blogs.filter(b => b.id !== id) }
    setBlogCategory(tempCategory)
  }
  const onSelectModalBlog = (name) => {
    const blog = blogs?.find(b => b.name === name)
    if (blog) {
      const tempCategory = { ...blogCategory, blogs: [...blogCategory.blogs, blog] }
      setBlogCategory(tempCategory)
    }
    else {
      message.error(pageData.addBlogFail)
    }

  }
  const reload = async () => {
    await fetchTableData();
  }
  const onCloseModal = () => {
    setBlogCategory(null)
    setIsOpenModal(false)
  }
  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const onSubmitModal = async () => {
    const updateModel = {
      blogCategoryId: blogCategory?.id,
      blogIds: blogCategory?.blogs?.map(b => b.id) || []
    }
    try {
      const res = await BlogCategoryDataService.updateBlogListAsync(updateModel)
      if (res) {
        message.success(pageData.updateSuccess)
        await reload()
        onCloseModal()
      }
    } catch (err) {
      message.error(pageData.updateFail)
      message.error(err)
    }


  }
  return (
    <Form>
      <Card className="w-100 shop-card-full">
        <Row className="total-cost-amount-row">
          <Col span={24}>
            <ShopTable
              className="mt-5"
              columns={getColumns()}
              editPermission={PermissionKeys.ADMIN}
              deletePermission={PermissionKeys.ADMIN}
              dataSource={dataSource}
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
            <TableBlog
              isOpen={isOpenModal}
              onCancel={onCloseModal}
              record={blogCategory}
              blogs={blogs}
              onHandleRemoveItem={onHandleRemoveModalBlog}
              onSelectBlog={onSelectModalBlog}
              onSubmitModal={onSubmitModal}
            />
          </Col>
        </Row>
      </Card>
    </Form>
  );
}
