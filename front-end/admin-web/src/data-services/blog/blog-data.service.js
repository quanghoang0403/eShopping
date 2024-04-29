import { guidIdEmptyValue } from "constants/string.constants";
import http from "utils/http-common";
const controller = "blogs"
const createBlogAsync = (data)=>{
    return http.post(`/${controller}/create-new-blog`,data)
}
const getAllBlogsAsync = () =>{
    return http.get(`/${controller}/get-all-blogs`)
}
const getBlogManagementsAsync = (pageNumber, pageSize, keySearch, categoryId = guidIdEmptyValue, author='')=>{
    return http.get(`/${controller}/get-blogs?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}&BlogCategoryId=${categoryId}&Author=${author}`)
}
const deleteBlogByIdAsync = id=>{
    return http.delete(`/${controller}/delete-blog-by-id/${id}`)
}
const getBlogByIdAsync = id=>{
    return http.get(`/${controller}/get-blog-by-id/${id}`)
}
const editBlogAsync = data=>{
    return http.put(`/${controller}/update-blog`,data)
}
const BlogDataService = {
    createBlogAsync,
    getAllBlogsAsync,
    getBlogManagementsAsync,
    deleteBlogByIdAsync,
    getBlogByIdAsync,
    editBlogAsync
}
export default BlogDataService