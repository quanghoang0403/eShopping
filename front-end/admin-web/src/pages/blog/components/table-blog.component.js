import { Card, Col, Form, Image, Row, Tooltip, message } from 'antd'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { EditButtonComponent } from 'components/edit-button/edit-button.component'
import { FnbTable } from 'components/shop-table/shop-table'
import { tableSettings } from 'constants/default.constants'
import { images } from 'constants/images.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { formatDate, hasPermission } from 'utils/helpers'
import '../blog.page.scss'
import { FilterBlogPopover } from './filter-popover.component'

export const TableBlog = () => {
  const [t] = useTranslation()
  const history = useHistory()
  const pageData = {
    btnDelete: t('button:delete'),
    btnIgnore: t('button:ignore'),
    btnFilter: t('button:filter'),

    blogs: t('blog:blogs'),
    category: t('table:category'),
    creator: t('table:creator'),
    action: t('table:action'),
    no: t('table:no'),
    author: t('table:author'),
    title: t('table:title'),
    lastUpdated: t('table:lastUpdated'),
    thumbnail: t('table:thumbnail'),
    searchPlaceholder: t('table:searchPlaceholder'),

    confirmDelete: t('dialog:confirmDelete'),
    blogConfirmDeleteMessage: t('blog:blogConfirmDeleteMessage'),
    blogDeletedSuccess: t('blog:blogDeletedSuccess'),
    blogDeletedFailed: t('blog:blogDeletedFailed')
  }

  const [totalBlog, setTotalBlog] = useState(0)
  const [listBlog, setListBlog] = useState([])
  const [keySearch, setKeySearch] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [countFilter, setCountFilter] = useState(0)
  const [exportFilter, setExportFilter] = useState({})
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [showPopover, setShowPopover] = useState(true)
  const [dataFilter, setDataFilter] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    initDataTableBlogs(tableSettings.page, tableSettings.pageSize, keySearch)
  }, [])

  const initDataTableBlogs = (pageNumber, pageSize, keySearch) => {
    /// get list blogs
    // setIsLoading(true)
    // blogDataService.getBlogManagementsAsync(pageNumber, pageSize, keySearch).then((res) => {
    //   const blogs = mappingToDataTableBlogs(res.blogs)
    //   setListBlog(blogs)
    //   setTotalBlog(res.total)
    //   setCurrentPageNumber(pageNumber)
    //   setIsLoading(false)
    // })
  }

  const onChangePage = (page, pageSize) => {
    initDataTableBlogs(page, pageSize, '')
  }

  const mappingToDataTableBlogs = (blogs) => {
    return blogs?.map((i, index) => {
      return {
        ...i,
        index: index + 1,
        id: i.id,
        title: i.title,
        bannerImageUrl: i.bannerImageUrl,
        blogCategory: i.blogCategory,
        creator: i.creator,
        date: formatDate(i?.lastSavedTime, DateFormat.DD_MM_YYYY),
        time: formatDate(i?.lastSavedTime, DateFormat.HH_MM)
      }
    })
  }

  // Insert the name into the message
  const formatConfirmDeleteMessage = (textContent, textReplace) => {
    const mess = t(textContent, { blogName: textReplace })
    return mess
  }

  const onEditItem = async (id) => {
    history.push(`/blog/edit/${id}`)
  }

  const onDeleteItem = async (blogId, blogName) => {
    // const res = await blogDataService.deleteBlogByIdAsync(blogId)
    // if (res) {
    //   message.success(formatConfirmDeleteMessage(pageData.blogDeletedSuccess, blogName))
    //   onChangePage(1, tableSettings.pageSize)
    // } else {
    //   message.error(formatConfirmDeleteMessage(pageData.blogDeletedFailed, blogName))
    // }
  }

  const getColumns = () => {
    const columns = [
      {
        title: pageData.no,
        dataIndex: 'index',
        width: '5%',
        render: (_, row) => {
          return <div>{row.index + (currentPageNumber - 1) * tableSettings.pageSize}</div>
        }
      },
      {
        title: pageData.thumbnail,
        dataIndex: 'bannerImageUrl',
        width: '15%',
        render: (value) => {
          return (
            <div className="boxImage">
              <Image
                preview={false}
                className="thumbnail"
                width={160}
                height={110}
                src={value ?? 'error'}
                fallback={images.defaultImageBlog}
              />
            </div>
          )
        }
      },
      {
        title: pageData.title,
        dataIndex: 'title',
        width: '30%',
        render: (_, record) => {
          return (
            <div>
              <Tooltip
                placement="top"
                title={record.title.replace(/<.*?>/gm, '')}
              >
                <div className="titleBlog">
                  <span>{record.title.replace(/<.*?>/gm, '')}</span>
                </div>
              </Tooltip>
              <div className="boxContent">
                <span
                  className="contentBlog"
                  style={{
                    maxHeight: '100px',
                    overflow: 'hidden'
                  }}
                  dangerouslySetInnerHTML={{ __html: record.description }}
                />
              </div>
            </div>
          )
        }
      },
      {
        title: pageData.category,
        dataIndex: 'blogCategory',
        width: '10%',
        render: (value) => {
          return <div>{value === '' ? '-' : value}</div>
        }
      },
      {
        title: pageData.author,
        dataIndex: 'creator',
        width: '10%',
        render: (value) => {
          return <div>{value}</div>
        }
      },
      {
        title: pageData.lastUpdated,
        dataIndex: 'lastSavedTime',
        width: '10%',
        render: (_, record) => {
          return (
            <div className="lastSavedTime">
              <span>{record.time}</span>
              <span className="lastSavedTimeDate">{record.date}</span>
            </div>
          )
        }
      },
      {
        title: pageData.action,
        dataIndex: 'action',
        align: 'center',
        width: '10%',
        hidden: !hasPermission(PermissionKeys.EDIT_BLOG) && !hasPermission(PermissionKeys.DELETE_BLOG),
        render: (_, record) => {
          return (
            <div className="action-column">
              {hasPermission(PermissionKeys.EDIT_BLOG) && (
                <EditButtonComponent
                  className="action-button-space"
                  onClick={() => onEditItem(record?.id)}
                  permission={PermissionKeys.EDIT_BLOG}
                />
              )}
              {hasPermission(PermissionKeys.DELETE_BLOG) && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatConfirmDeleteMessage(pageData.blogConfirmDeleteMessage, record?.title)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  permission={PermissionKeys.DELETE_BLOG}
                  onOk={() => onDeleteItem(record?.id, record?.title)}
                />
              )}
            </div>
          )
        }
      }
    ].filter((item) => !item.hidden)

    return columns
  }

  const onSearch = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch)
        searchKeyAndFilterBlogs(tableSettings.page, tableSettings.pageSize, keySearch, exportFilter)
      }, 500)
    )
  }

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true)
    }
    // const dataFilter = await blogDataService.getBlogFilterAsync()
    // setDataFilter(dataFilter)
  }

  const searchKeyAndFilterBlogs = (pageNumber, pageSize, keySearch, filter) => {
    // blogDataService
    //   .getBlogManagementsAsync(pageNumber, pageSize, keySearch, filter?.categoryId || '', filter?.creatorId || '')
    //   .then((res) => {
    //     const blogs = mappingToDataTableBlogs(res.blogs)
    //     setListBlog(blogs)
    //     setTotalBlog(res.total)
    //   })
  }

  const handleFilterBlog = (data) => {
    setExportFilter(data)
    // blogDataService
    //   .getBlogManagementsAsync(tableSettings.page, tableSettings.pageSize, keySearch, data?.categoryId, data?.creatorId)
    //   .then((res) => {
    //     const blogs = mappingToDataTableBlogs(res.blogs)
    //     setListBlog(blogs)
    //     setTotalBlog(res.total)
    //     setCountFilter(Object.values(data).filter((e) => e !== '').length)
    //   })
  }

  const onClearFilter = (e) => {
    setCountFilter(0)
    setShowPopover(false)
  }

  const filterComponent = () => {
    return showPopover && dataFilter && dataFilter.blogAuthors && dataFilter.blogCatetories
      ? (
      <FilterBlogPopover
        dataFilter={dataFilter}
        onChangeFilter={(data) => {
          handleFilterBlog(data)
        }}
      />
        )
      : null
  }

  return (
    <>
      <Form className="blog-management-list">
        <Card className="w-100 shop-card-full">
          <Row className="total-cost-amount-row">
            <Col span={24}>
              <FnbTable
                className="mt-4 blogTable"
                columns={getColumns()}
                pageSize={tableSettings.pageSize}
                dataSource={listBlog}
                currentPageNumber={currentPageNumber}
                total={totalBlog}
                onChangePage={onChangePage}
                search={{
                  placeholder: pageData.searchPlaceholder,
                  onChange: onSearch,
                  maxLength: 100
                }}
                filter={{
                  onClickFilterButton,
                  totalFilterSelected: countFilter,
                  onClearFilter,
                  buttonTitle: pageData.btnFilter,
                  component: filterComponent()
                }}
                rowKey={'id'}
                loading={isLoading}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  )
}
