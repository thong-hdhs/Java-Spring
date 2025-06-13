import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabLineRef, activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";

const HomePage = () => {

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let [pageState, setPageState] = useState("home");
    let categories = ["Kiến thức HIV", "Phòng ngừa HIV", "Xét nghiệm HIV", "Chống kỳ thị HIV", "Điều trị ARV", "Sống chung với HIV", "Tin tức HIV"]

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/latest-blogs")
            .then(({ data }) => {
                const blogs = data.data.data;
                setBlogs(blogs);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchBlogsByCategory = () => {
        console.log(pageState);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/search-blogs", 
            { tag: pageState },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(({ data }) => {
                const blogs = data.data.data;
                setBlogs(blogs);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/trending-blogs")
            .then(({ data }) => {
                const trendingBlogs = data.data.data;
                setTrendingBlogs(trendingBlogs);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        
        setBlogs(null);

        if(pageState === category){
            setPageState("home");
            return;
        }

        setPageState(category);
            
    }

    useEffect(() => {

        activeTabRef.current.click();

        if(pageState == "home"){

            fetchLatestBlogs();
        }else{
            fetchBlogsByCategory();
        }

        if(!trendingBlogs){
            fetchTrendingBlogs();
        }
    }, [pageState])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* lastest blog */}
                <div className="w-full ">

                    <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]} >
                        <>
                            {
                                blogs == null ? <Loader />
                                    :
                                    (
                                        blogs.length ?
                                        blogs.map((blog, i) => {
                                        return (

                                            <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>

                                                <BlogPostCard content={blog} author={blog.author.personal_info} />

                                            </AnimationWrapper>
                                        )
                                    })
                                    : <NoDataMessage message="Không có bài viết nào" />
                                )
                            }
                        </>

                        {
                            trendingBlogs == null ? <Loader />
                                :
                                trendingBlogs.length ?
                                trendingBlogs.map((blog, i) => {
                                    return (

                                        <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>


                                            <MinimalBlogPost blog1={blog} index={i} />
                                        </AnimationWrapper>
                                    )
                                })
                                : 
                                <NoDataMessage message="Không có bài viết nào" />
                        }
                    </InPageNavigation>

                </div>
                {/* filter and trending blog */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 mt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Tags</h1>

                            <div className="flex flex-wrap gap-3">
                                {
                                    categories.map((category, i) => {
                                        return (
                                            <button onClick={loadBlogByCategory} key={i} className={"tag " + (pageState === category.toLowerCase() ?  "bg-black text-white " : " ")}>
                                                {category}
                                            </button>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    

                    <div>
                        <h1 className="font-medium text-xl mb-8">Bài viết thịnh hành <i className="fi fi-rr-arrow-trend-up"></i></h1>

                        {
                            trendingBlogs == null ? <Loader />
                                :
                                trendingBlogs.length ?
                                trendingBlogs.map((blog, i) => {
                                    return (

                                        <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>


                                            <MinimalBlogPost blog1={blog} index={i} />
                                        </AnimationWrapper>
                                    )
                                })
                                : 
                                <NoDataMessage message="Không có bài viết nào" />
                        }
                    </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage;