import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Toaster } from "react-hot-toast";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import ManageBlogCard from "../components/manage-blogcard.component";
import LoadMore from "../components/load-more.component";

const ManageBlog = () => {
    const { userAuth } = useContext(UserContext);
    const userId = userAuth?.user?.id;

    const [blogs, setBlogs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (userAuth?.accessToken) {
            getBlog({profileId: userId});
        }
    }, [userAuth, currentPage]);

    const getBlog = ({profileId, search})=>{
        setLoading(true);
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/search-blogs?page=${currentPage}&size=${pageSize}&filter=user.id:'${profileId}'`)
            .then(({data})=>{
                const blogs = data.data.data.result;
                const meta = data.data.data.meta;
                setBlogs(blogs);
                setTotalPages(meta.pages);
                setCurrentPage(meta.page);
                setLoading(false);
                console.log(blogs);
            })
            .catch((err)=>{
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })

    }

    const getBlogSearch = ({profileId, search})=>{
        setLoading(true);
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/search-blogs?page=${currentPage}&size=${pageSize}&filter=user.id:'${profileId}' and (title~'${search}' or des~'${search}' or content~'${search}')`)
            .then(({data})=>{
                const blogs = data.data.data.result;
                const meta = data.data.data.meta;
                setBlogs(blogs);
                setTotalPages(meta.pages);
                setCurrentPage(meta.page);
                setLoading(false);
                console.log(blogs);
            })
            .catch((err)=>{
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })

    }

    const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1);
    }

    const handleKeySearch = (e) => {
        if (e.key === "Enter") {
            setCurrentPage(1);
            getBlogSearch({profileId: userId, search});
            console.log(search);
        }
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
    }
    return (
        <>
            <h1 className="max-md:hidden">Quản lý bài viết</h1>

            <Toaster/>

            <div className="relative max-md:mt-0 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Tìm kiếm bài viết..."
                    onChange={handleChange}
                    onKeyDown={handleKeySearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>
            
            {
                blogs == null ? <Loader/>
                :
                blogs.length === 0 ?
                <NoDataMessage message="Không tìm thấy bài viết nào"/>
                :
                <>
                    {
                        blogs.map((blog, i)=>{
                            return <AnimationWrapper key={i} transition={{delay: 0.4 * i}}>
                                <ManageBlogCard blog={blog} getBlog={() => getBlog({profileId: userId})}/>
                            </AnimationWrapper>
                        })

                    }
                    <LoadMore 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onLoadMore={handleLoadMore}
                            />
                </>
            }
            

        </>
    )
}

export default ManageBlog;