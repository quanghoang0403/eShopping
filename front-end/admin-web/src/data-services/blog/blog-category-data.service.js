import http from "utils/http-common";
const controller = 'blogcategory'
const createBlogCategoryAsync = data=>{
    return http.post(`/${controller}/create-blog-category`,data)
}
const BlogCategoryDataService = {
    createBlogCategoryAsync
} 
export default BlogCategoryDataService