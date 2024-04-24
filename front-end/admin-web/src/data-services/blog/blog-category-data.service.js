import http from "utils/http-common";
const controller = 'blogcategory'
const createBlogCategoryAsync = data=>{
    return http.post(`/${controller}/create-blog-category`,data)
}
const getBlogCategoriesAsync = (data)=>{
    const {pageNumber,pageSize,keySearch} = data
    return http.get(`/${controller}/get-blog-categories?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch||''}`)
}
const deleteBlogCategoryAsync = id=>{
    return http.delete(`/${controller}/delete-blog-category-by-id/${id}`)
}
const BlogCategoryDataService = {
    createBlogCategoryAsync,
    getBlogCategoriesAsync,
    deleteBlogCategoryAsync
} 
export default BlogCategoryDataService