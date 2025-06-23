import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import UserAvatar from "../components/user-avatar";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogContent from "../components/blog-content.component";

export const BlogStructure = {
    title: "",
    content:[],
    user: {},
    tags: [],
    published_at: "",
    id:"",
    des:"",
    blogActivity:{},
    banner:""
}

export const BlogContext = createContext({});
const BlogPage = () => {

    let {blog_id} = useParams();
    const [blog, setBlog] = useState(BlogStructure);
    let {title, content, user:{fullName, email}, tags, published_at, id, des, blogActivity, banner} = blog;
    const [loading, setLoading] = useState(true);
    const [isLikeByUser, setIsLikeByUser] = useState(false);
    
    const fetchBlog = ()=>{
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/${blog_id}`  )
        .then((res)=>{
            
            const blog = res.data.data.data;
            console.log(blog);
            setBlog(blog);
            setLoading(false);
            setIsLikeByUser(blog.likedByUser);
        })
        .catch((err)=>{
            console.log(err);
            setLoading(false);
        })
    }

    const getBlocks = () => {
        if (!content) return [];
        const contentObj = typeof content === "string" ? JSON.parse(content) : content;
        return contentObj.blocks || [];
    }

    const blocks = getBlocks();

    const getUserNameFormEmail = () => {
        return email ? email.split('@')[0] : "";
    }

    let userName = getUserNameFormEmail();

    console.log("blog",isLikeByUser);
    useEffect(()=>{
        fetchBlog();
    },[])
    return (
        <div>
            <AnimationWrapper>
                {
                    loading ? <Loader/> 
                    :

                    <BlogContext.Provider value={{blog, setBlog, isLikeByUser, setIsLikeByUser}}>

                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                        <img src={banner} alt={title} className="aspect-video" />

                        <div className="mt-12">
                            <h2>{title}</h2>
                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <UserAvatar name={fullName} size={40}/>

                                    <p className="capitalize">
                                        {fullName}
                                        <br/>
                                        <Link className="underline" to={`/user/${blog.user.id}`}>@{userName}</Link>
                                    </p>

                                </div>
                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Đã đăng vào {getDay(published_at)}</p>
                            </div>
                        </div>

                        <BlogInteraction/>
                        <div className="mt-12 font-gelasio blog-page-content">
                            {
                                blocks.map((block, index)=>{
                                    return (
                                        <div key={index} className="my-4 md:my-8">
                                            <BlogContent block={block}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <BlogInteraction/>
                    </div>
                    </BlogContext.Provider>
                }
            </AnimationWrapper>
        </div>
    )
}

export default BlogPage;