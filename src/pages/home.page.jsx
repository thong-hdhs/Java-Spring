import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabLineRef, activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import LoadMore from "../components/load-more.component";

const HomePage = () => {

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let [pageState, setPageState] = useState("home");
    let [currentPage, setCurrentPage] = useState(1);
    let [pageSize] = useState(5);
    let [totalPages, setTotalPages] = useState(1);
    let categories = ["Kiến thức HIV", "Phòng ngừa HIV", "Xét nghiệm HIV", "Chống kỳ thị HIV", "Điều trị ARV", "Sống chung với HIV", "Tin tức HIV"]

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/latest-blogs?current=${currentPage}&pageSize=${pageSize}`)
            .then(({ data }) => {
                const newBlogs = data.data.data.result;
                const meta = data.data.data.meta;
                setBlogs(prevBlogs => currentPage === 1 ? newBlogs : [...prevBlogs, ...newBlogs]);
                setTotalPages(meta.pages);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchBlogsByCategory = () => {
        console.log(pageState);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/search-tags?page=${currentPage}&size=${pageSize}`, 
            { tag: pageState },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(({ data }) => {
                const newBlogs = data.data.data.result;
                const meta = data.data.data.meta;
                setBlogs(prevBlogs => currentPage === 1 ? newBlogs : [...prevBlogs, ...newBlogs]);
                setTotalPages(meta.pages);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/trending-blogs?page=1&size=5`)
            .then(({ data }) => {
                const trendingBlogs = data.data.data.result;
                setTrendingBlogs(trendingBlogs);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1);
    }

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        
        setBlogs(null);
        setCurrentPage(1);

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
    }, [pageState, currentPage])

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

                            <LoadMore 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onLoadMore={handleLoadMore}
                            />
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