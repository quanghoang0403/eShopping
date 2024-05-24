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
import { getValidationMessages } from "utils/helpers";
import { BadgeSEOKeyword, SEO_KEYWORD_COLOR_LENGTH } from 'components/badge-keyword-SEO/badge-keyword-SEO.component'
export default function CreateBlogCategory(){
    const [t] = useTranslation()
    const [form] = Form.useForm();
    const [isChangeForm, setIsChangeForm] = useState(false)
    const [disableCreateButton,setDisableCreateButton] = useState(true)
    const [blockNavigation, setBlockNavigation] = useState(false)
    const [keywordSEOs,setKeywordSEOList] = useState([]);
    const [keywordSEO,setKeywordSEO] = useState({})
    const [isKeywordSEOChange,setIsKewwordSEOChange] = useState(false)
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
                setBlogs(blogs)
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

    const onSubmitForm = ()=>{
        form.validateFields().then(async values=>{
            const blogCategoryModel = {
                ...values,
                blogs:values?.blogs?.reduce((acc,blogId)=>acc.concat({id:blogId,position:values.blogs.indexOf(blogId)}),[]) || [],
                keywordSEO:keywordSEOs.map(kw=>kw.value)?.join(',') || null,
            }
            console.log(blogCategoryModel)
            const res = await BlogCategoryDataService.createBlogCategoryAsync(blogCategoryModel)
            if(res.status != 200){
                message.success(pageData.createSuccess)
                onCompleted()
            }
        })
        .catch((errors) => {
            console.error(errors)
            form.setFields(getValidationMessages(errors));
            
        })
    }

    const addSEOKeywords = (e)=>{
        e.preventDefault();
        setKeywordSEOList(list=> !list.find(kw=>kw.id === keywordSEO.id) && keywordSEO.value!==''?[...list,keywordSEO]:[...list]);
        setKeywordSEO({id:'',value:''});
        setIsKewwordSEOChange(false)
    }

    const removeSEOKeyword = (keyword)=>{
        setKeywordSEOList(list=> list.filter(kw=>kw.id !== keyword.id));
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
                                        name={['name']}
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
                                        name={['priority']}
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

                                <div>
                                    {
                                        keywordSEOs.length >0 ? <BadgeSEOKeyword onClose={removeSEOKeyword} keywords={keywordSEOs}/> :''
                                    }
                                    
                                    <div className='d-flex mt-3'>
                                        <Input
                                            className="shop-input-with-count" 
                                            showCount
                                            value={keywordSEO?.value || ''}
                                            placeholder={pageData.SEOInformation.keyword.placeholder}
                                            onChange={e=>{
                                            if(e.target.value !== ''){
                                                setKeywordSEO({
                                                id:e.target.value,
                                                value:e.target.value,
                                                colorIndex: Math.floor(Math.random() * SEO_KEYWORD_COLOR_LENGTH)
                                                })
                                                setIsKewwordSEOChange(true)
                                            }
                                            }}
                                        />
                                        <ShopAddNewButton
                                            permission={PermissionKeys.ADMIN}
                                            disabled={!isKeywordSEOChange}
                                            text={pageData.SEOInformation.keyword.btnAdd}
                                            className={'mx-4'}
                                            onClick={addSEOKeywords}
                                        />
                                    </div>
                                </div>
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