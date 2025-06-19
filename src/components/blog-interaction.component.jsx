import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

const BlogInteraction = () => {

    let {blog:{id, blogActivity, blogActivity:{total_likes, total_comments}, user:{fullName, email}}, setBlog} = useContext(BlogContext);
    const { userAuth } = useContext(UserContext);
    const userEmail = userAuth?.user?.email;

   

    return (
        <>
            <hr className="border-grey my-2"/>
            <div className="flex gap-6">
                <div className="flex gap-3 items-center">
                    <button
                        className="h-10 w-10 rounded-full bg-grey/80 flex gap-2 items-center justify-center"
                    >
                        <i className="fi fi-rr-heart"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes} lượt thích</p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        className="h-10 w-10 rounded-full bg-grey/80 flex gap-2 items-center justify-center"
                    >
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments} bình luận</p>
                </div>

                <div className="flex gap-6 items-center ml-auto">
                    {
                        userEmail == email ?
                        <Link to={`/editor/${id}`} className=" underline hover:text-purple">Chỉnh sửa</Link>:null
                    }

                </div>
            </div>
            <hr className="border-grey my-2"/>
        </>
    )
}

export default BlogInteraction;
