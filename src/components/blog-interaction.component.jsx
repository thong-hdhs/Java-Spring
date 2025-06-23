import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {

    let {blog, blog:{id, blogActivity, user:{email}}, setBlog, isLikeByUser, setIsLikeByUser} = useContext(BlogContext);
    const { userAuth, userAuth: { accessToken } } = useContext(UserContext);

    const handleLike = () => {
        if(!accessToken){
            return toast.error("Vui lòng đăng nhập để thích bài viết");
        }

        if(isLikeByUser){
            setBlog({ ...blog, blogActivity: { ...blog.blogActivity, total_likes: blog.blogActivity.total_likes - 1 } });
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/${id}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(res => {
                setIsLikeByUser(false);
            })
            .catch(err => {
                // Log lỗi để kiểm tra chi tiết
                console.error("Lỗi khi like bài viết:", err);
    
                // Nếu có lỗi, rollback lại thay đổi ở UI
                setIsLikeByUser(preVal => !preVal);
                // Lấy lại giá trị ban đầu, không cộng trừ nữa
                let originalTotalLikes = blog.blogActivity.total_likes;
                setBlog({ ...blog, blogActivity: { ...blog.blogActivity, total_likes: originalTotalLikes } });
    
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
            });
        }
        else {
            let newTotalLikes = blog.blogActivity.total_likes + 1;
            setBlog({ ...blog, blogActivity: { ...blog.blogActivity, total_likes: newTotalLikes } });
        
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/${id}/like`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
            })
            .then(res => {
                setIsLikeByUser(true);
            })
            .catch(err => {
                // Nếu có lỗi, rollback lại thay đổi ở UI
                // setIsLikeByUser(preVal => !preVal);
                // Lấy lại giá trị ban đầu, không cộng trừ nữa
                let originalTotalLikes = blog.blogActivity.total_likes;
                setBlog({ ...blog, blogActivity: { ...blog.blogActivity, total_likes: originalTotalLikes } });

                toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
            });}
    }

    useEffect(()=>{
        if(accessToken){
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/${id}/islike`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(res => {
                setIsLikeByUser(res.data.data.isLiked);
            })
            .catch(err => {
                console.log(err);
            })
        }
    },[])

    return (
        <>  
            <Toaster/>
            <hr className="border-grey my-2"/>
            <div className="flex gap-6">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleLike}
                        className={"h-10 w-10 rounded-full flex gap-2 items-center justify-center " + (isLikeByUser ? "bg-red/20 text-red" : "bg-grey/80")}
                    >
                        <i className={"fi " + (isLikeByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{blog.blogActivity.total_likes} lượt thích</p>
                </div>

                <div className="flex gap-6 items-center ml-auto">
                    {
                        userAuth?.user?.email == email ?
                        <Link to={`/editor/${id}`} className=" underline hover:text-purple">Chỉnh sửa</Link>:null
                    }

                </div>
            </div>
            <hr className="border-grey my-2"/>
        </>
    )
}

export default BlogInteraction;
