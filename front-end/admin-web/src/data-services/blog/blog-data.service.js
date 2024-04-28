import http from "utils/http-common";
const controller = "blogs"
const createBlogAsync = (data)=>{
    return http.post(`/${controller}/create-new-blog`,data)
}
const getAllBlogsAsync = () =>{
    return http.get(`/${controller}/get-all-blogs`)
}
const getBlogManagementsAsync = (pageNumber, pageSize, keySearch)=>{
    return http.get(`/${controller}/get-blogs?PageNumber=${pageNumber}&PageSize=${pageSize}&KeySearch=${keySearch}`)
}
const BlogDataService = {
    createBlogAsync,
    getAllBlogsAsync,
    getBlogManagementsAsync
}
export default BlogDataService