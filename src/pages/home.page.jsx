import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";

const HomePage = () => {

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/latest-blogs")
        .then(({data})=>{
            const blogs = data.data.data;
            setBlogs(blogs);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/trending-blogs")
        .then(({data})=>{
            const trendingBlogs = data.data.data;
            setTrendingBlogs(trendingBlogs);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        fetchLatestBlogs();
        fetchTrendingBlogs();
    },[])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* lastest blog */}
                <div className="w-full ">

                    <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]} >
                        <>
                            {
                                blogs == null ? <Loader />
                                :
                                blogs.map((blog, i)=>{
                                    return (

                                        <AnimationWrapper transition={{duration: 1, delay: i * 0.1}} key={i}>

                                            <BlogPostCard content={blog} author={blog.author.personal_info} />

                                        </AnimationWrapper>
                                    )
                                })
                            }
                        </>

                        {
                            trendingBlogs == null ? <Loader />
                            :
                            trendingBlogs.map((blog, i)=>{
                                return (

                                    <AnimationWrapper transition={{duration: 1, delay: i * 0.1}} key={i}>

                                        <MinimalBlogPost/>
                                    </AnimationWrapper>
                                )
                            })
                        }
                    </InPageNavigation>

                </div>
                {/* filter and trending blog */}
                <div>

                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage;