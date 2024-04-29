import { Row, Col, Button, Form, Card, Input, InputNumber, Tooltip, Divider, Space, message } from "antd";
import PageTitle from "components/page-title";
import { useTranslation } from "react-i18next";
import BlogCategoryDataService from 'data-services/blog/blog-category-data.service'
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { ExclamationIcon, IconBtnAdd } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { useEffect, useState } from "react";
import { FnbSelectMultiple } from "components/shop-select-multiple/shop-select-multiple";
import FnbFroalaEditor from "components/shop-froala-editor";
import { FnbTextArea } from "components/shop-text-area/shop-text-area.component";
import { ShopAddNewButton } from "components/shop-add-new-button/shop-add-new-button";
import { DELAYED_TIME } from "constants/default.constants";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { useHistory } from "react-router";
import BlogDataService from "data-services/blog/blog-data.service";
export default function CreateBlogCategory(){
    const [t] = useTranslation()
    const [form] = Form.useForm();
    const [isChangeForm, setIsChangeForm] = useState(false)
    const [disableCreateButton,setDisableCreateButton] = useState(true)
    const [blockNavigation, setBlockNavigation] = useState(false)
    const [keywordSEOs,setKeywordSEOList] = useState([]);
    const [keywordSEO,setKeywordSEO] = useState({})
    const [showConfirm, setShowConfirm] = useState(false);
    const [blogs,setBlogs] = useState([])
    const history = useHistory()
    const pageData = {
        title:t('blogCategory.pageTitle'),
        btnDiscard: t('button.discard'),
        createSuccess:t('blogCategory.addBlogCategorySuccess'),
        createFail:t('blogCategory.addBlogCategoryFail'),
        btnSave:t('button.save'),
        btnCancel:t('button.cancel'),
        description:{
            title: t('blogCategory.labelDescription'),
            placeholder: t('blogCategory.placeholderDescription'),
            maxLength:200
        },
        leaveDialog: {
            confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
            confirmLeaveContent: t('dialog.confirmLeaveContent'),
            confirmLeave: t('dialog.confirmLeave')
        },
        generalInformation:{
            title: t('common.generalInformation'),
            name:{
                title:t('blogCategory.blogCategoryTitle'),
                placeholder:t('blogCategory.blogCategoryTitlePlaceholder'),
                validateMessage:t('blogCategory.blogCategoryNameValidation'),
                required:true,
                maxLength:255
            },
            priority:{
                title:t('blogCategory.priority'),
                placeholder:t('blogCategory.placeholderPriority'),
                validateMessage:t('blogCategory.validatePriority'),
                required:true,
                tooltip: t('productCategory.tooltipPriority')
            },
            content:{
                title: t('blogCategory.blogCategoryContent'),
                placeholder: t('blogCategory.placeholderContent')
            },
            blogs:{
                title:t('blogCategory.addBlog'),
                placeholder: t('blogCategory.placeholderAddBlog')
            }
        },
        SEOInformation: {
            title: t('form.SEOConfiguration'),
            keyword: {
              label: t('form.SEOKeywords'),
              placeholder: t('form.SEOKeywordsPlaceholder'),
              tooltip: t('form.SEOKeywordsTooltip'),
              btnAdd:t('form.AddSEOKeywords')
            },
            SEOtitle: {
              label: t('form.SEOTitle'),
              placeholder: t('form.SEOTitlePlaceholder'),
              tooltip: t('form.SEOTitleTooltip'),
              validateMessage: t('form.messageMatchSuggestSEOTitle'),
              minlength: 50
            },
            description: {
              label: t('form.SEODescription'),
              placeholder: t('form.SEODescriptionPlaceholder'),
              validateMessage: t('form.messageMatchSuggestSEODescription'),
              minlength: 150,
              maxLength: 250,
              tooltip: t('form.SEODescriptionTooltip')
            },
        }
    }
    useEffect(()=>{
        const getInitData = async()=>{
            const blogs = await BlogDataService.getAllBlogsAsync();
            if(blogs){
                setBlogs(blogs?.allBlogs)
            }
        }
        getInitData();
    },[])
    const onCompleted = () => {
        setIsChangeForm(false)
        setTimeout(() => {
          return history.push('/blog-category')
        }, DELAYED_TIME)
      }
    const onCancel = ()=>{
        if (isChangeForm) {
            setShowConfirm(true)
          } else {
            setShowConfirm(false)
            onCompleted()
            return history.push('/blog-category')
          }
    }
    const changeForm = ()=>{
        setIsChangeForm(true)
        setDisableCreateButton(false)
    }
    const addSEOKeywords = (e)=>{
        e.preventDefault();
        setKeywordSEOList(list=> !list.find(kw=>kw.id === keywordSEO.id) && keywordSEO.value!==''?[...list,keywordSEO]:[...list]);
        setKeywordSEO({id:'',value:''});
        setIsKewwordSEOChange(false)
      }
    const onSubmitForm = ()=>{
        form.validateFields().then(async values=>{
            const blogCategoryModel = {
                ...values,
                blogs:values.blogs.reduce((acc,blogId)=>acc.concat({id:blogId,position:values.blogs.indexOf(blogId)}),[]),
                keywordSEO:values.keywordSEO?.join(',') || null
            }
            console.log(blogCategoryModel)
            const res = await BlogCategoryDataService.createBlogCategoryAsync(blogCategoryModel)
            if(res.status != 200){
                message.success(pageData.createSuccess)
                onCompleted()
            }
        })
        .catch((errors) => {
            message.error(pageData.createFail)
        })
    }
    return(
        <>
            <Row className="shop-row-page-header">
                <Col xs={24} sm={24} lg={12} md={12}>
                    <p className="card-header">
                        <PageTitle content={pageData.title} />
                    </p>
                </Col>
                <Col span={12} xs={24} sm={24} md={12} lg={12}>
                    <ActionButtonGroup
                        arrayButton={[
                        {
                            action: (
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={disableCreateButton}
                                icon={<IconBtnAdd className="icon-btn-add-product" />}
                                className="btn-add-product"
                                onClick={onSubmitForm}
                            >
                                {pageData.btnSave}
                            </Button>
                            ),
                            permission: PermissionKeys.ADMIN
                        },
                        {
                            action: (
                            <a onClick={() => onCancel()}
                            className="action-cancel">
                                {pageData.btnCancel}
                            </a>
                            ),
                            permission: null
                        }
                        ]}
                    />
                </Col>
            </Row>
            <Form
                form={form}
                name="basic"
                onFieldsChange={(e) => changeForm(e)}
                autoComplete="off"
                onChange={() => {
                if (!blockNavigation) setBlockNavigation(true)
                }}
            >
                <Row gutter={[8,8]}>
                    <Col xs={24} sm={24} md={24} lg={16}>
                        <Card className="w-100 shop-card h-auto" >
                            <h4 className="title-group">{pageData.generalInformation.title}</h4>
                            <Row className="mb-4">
                                <Col span={24}>
                                    <h4 className="shop-form-label">
                                        {pageData.generalInformation.name.title}
                                        <span className="text-danger mx-1">*</span>
                                    </h4>
                                    <Form.Item
                                        name={'name'}
                                        rules={[
                                            {
                                            required: pageData.generalInformation.name.required,
                                            message: pageData.generalInformation.name.validateMessage
                                            }
                                        ]}
                                        validateFirst={true}
                                        >
                                        <Input
                                            className="shop-input"
                                            placeholder={pageData.generalInformation.name.placeholder}
                                            maxLength={pageData.generalInformation.name.maxLength}
                                            id="blog-category-name"
                                            allowClear
                                            showCount
                                        />
                                    </Form.Item>

                                    <div className="d-flex">
                                        <h4 className="shop-form-label">
                                            {pageData.generalInformation.priority.title}
                                        </h4>
                                        <span className="text-danger mx-1">*</span>
                                        <Tooltip placement="topLeft" title={pageData.generalInformation.priority.tooltip}>
                                            <span>
                                                <ExclamationIcon />
                                            </span>
                                        </Tooltip>
                                    </div>
                                   
                                    <Form.Item
                                        name={'priority'}
                                        rules={[
                                            {
                                            required: pageData.generalInformation.priority.required,
                                            message: pageData.generalInformation.priority.validateMessage
                                            }
                                        ]}
                                        validateFirst={true}
                                        >
                                        <InputNumber
                                        placeholder={pageData.generalInformation.priority.placeholder}
                                        className="shop-input-number w-100"
                                        min={1}
                                        max={1000000}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        />
                                    </Form.Item>

                                    <h4 className="shop-form-label mt-16">
                                        {pageData.description.title}
                                    </h4>
                                    <Form.Item
                                        name={['description']}
                                        className="item-name"
                                    >
                                    <FnbTextArea
                                            showCount
                                            autoSize={{ minRows: 2, maxRows: 6 }}
                                            id="blog-category-description"
                                            placeholder={pageData.description.placeholder}
                                            maxLength={pageData.description.maxLength}
                                        ></FnbTextArea>
                                    </Form.Item>

                                    <h4 className="shop-form-label">
                                        {pageData.generalInformation.content.title}
                                    </h4>
                                    <Form.Item
                                        name={['content']}
                                        >
                                       <FnbFroalaEditor
                                        onChange={(value) => { setIsChangeForm(true);}}
                                        placeholder={pageData.generalInformation.content.placeholder}
                                        charCounterMax={-1}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <br />
                        <Card className="w-100 mt-1 shop-card h-auto">
                            <Row>
                            <Col span={24}>
                                <h4 className="title-group">{pageData.SEOInformation.title}</h4>
                                <div className='d-flex'>
                                <h4 className="shop-form-label mt-16">{pageData.SEOInformation.SEOtitle.label}</h4>
                                <Tooltip placement="topLeft" title={pageData.SEOInformation.SEOtitle.tooltip}>
                                    <span className="ml-12 mt-16">
                                    <ExclamationIcon />
                                    </span>
                                </Tooltip>
                                </div>
                                <Form.Item
                                name={['titleSEO']}
                                className="item-name"
                                rules={[
                                    {
                                    min: pageData.SEOInformation.SEOtitle.minlength,
                                    message: pageData.SEOInformation.SEOtitle.validateMessage
                                    }
                                ]}
                                >
                                <Input
                                    className="shop-input-with-count"
                                    showCount
                                    placeholder={pageData.SEOInformation.SEOtitle.placeholder}
                                    minLength={pageData.SEOInformation.SEOtitle.minlength}
                                />
                                </Form.Item>

                                <div className='d-flex'>
                                <h3 className="shop-form-label mt-16">
                                    {pageData.SEOInformation.description.label}
                                </h3>
                                <Tooltip placement="topLeft" title={pageData.SEOInformation.description.tooltip}>
                                    <span className="ml-12 mt-16">
                                    <ExclamationIcon />
                                    </span>
                                </Tooltip>
                                </div>
                                <Form.Item
                                name={['descriptionSEO']}
                                className="item-name"
                                rules={[
                                    {
                                    min: pageData.SEOInformation.description.minlength,
                                    message: pageData.SEOInformation.description.validateMessage
                                    }
                                ]}
                                >
                                <FnbTextArea
                                    showCount
                                    maxLength={pageData.SEOInformation.description.maxLength}
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                    id="blog-category-SEO-description"
                                    placeholder={pageData.SEOInformation.description.placeholder}
                                ></FnbTextArea>
                                </Form.Item>

                                <div className='d-flex'>
                                <h3 className="shop-form-label mt-16">
                                    {pageData.SEOInformation.keyword.label}
                                </h3>
                                <Tooltip placement="topLeft" title={pageData.SEOInformation.keyword.tooltip}>
                                    <span className="ml-12 mt-16">
                                    <ExclamationIcon />
                                    </span>
                                </Tooltip>
                                </div>

                                <Form.Item
                                name={['keywordSEO']}
                                className="item-name"
                                >
                                <FnbSelectMultiple
                                    placeholder={pageData.SEOInformation.keyword.placeholder}
                                    option={keywordSEOs}
                                    dropdownRender={
                                    (menu) => (
                                        <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                className="shop-input-non-shadow m-0 py-0"
                                                placeholder={pageData.SEOInformation.keyword.placeholder}
                                                value={keywordSEO.name || ''}
                                                maxLength={3}
                                                onChange={e=>setKeywordSEO({...keywordSEO,id:e.target.value,name:e.target.value})}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                showCount
                                            />
                                            <ShopAddNewButton 
                                            text={pageData.SEOInformation.keyword.btnAdd}
                                            onClick={addSEOKeywords}
                                            ></ShopAddNewButton>
                                        </Space>
                                        </>
                                    )
                                    }
                                />
                                </Form.Item>
                            </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <Card className="w-100 shop-card h-auto">
                            <Row className="mb-4">
                                <h4 className="title-group">{pageData.generalInformation.blogs.title}</h4>
                                <Form.Item
                                    name={['blogs']}
                                >
                                    <FnbSelectMultiple
                                        placeholder={pageData.generalInformation.blogs.placeholder}
                                        option={blogs}
                                    />
                                </Form.Item>
                                
                            </Row> 
                        </Card>    
                    </Col>
                </Row>
                
            </Form>
            <DeleteConfirmComponent
            title={pageData.leaveDialog.confirmLeaveTitle}
            content={pageData.leaveDialog.confirmLeaveContent}
            visible={showConfirm}
            skipPermission={true}
            cancelText={pageData.btnDiscard}
            okText={pageData.confirmLeave}
            onCancel={()=>setShowConfirm(false)}
            onOk={onCompleted}
            isChangeForm={isChangeForm}
            />
        </>
       
    );
}