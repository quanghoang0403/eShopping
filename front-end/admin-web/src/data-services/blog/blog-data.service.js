import http from "utils/http-common";
const controller = "blogs"
const createBlogAsync = (data)=>{
    return http.post(`/${controller}/create-new-blog`/data)
}
const getAllBlogsAsync = () =>{
    return http.get(`/${controller}/get-all-blogs`)
}
const BlogDataService = {
    createBlogAsync,
    getAllBlogsAsync
}
export default BlogDataService