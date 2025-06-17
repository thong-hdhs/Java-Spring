import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InPageNavigation from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import BlogPostCard from '../components/blog-post.component';
import NoDataMessage from '../components/nodata.component';
import LoadMore from '../components/load-more.component';
import axios from 'axios';
import UserCard from '../components/usercard.component';

const SearchPage = () => {

    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);
    let {query} = useParams();

    let [pageState, setPageState] = useState("home");
    let [currentPage, setCurrentPage] = useState(1);
    let [pageSize] = useState(5);
    let [totalPages, setTotalPages] = useState(1);

    // State cho users
    let [currentUserPage, setCurrentUserPage] = useState(1);
    let [totalUserPages, setTotalUserPages] = useState(1);

   const searchBlogs = async ({query}) => {
        try {
            // Search blogs
            const blogsResponse = await axios.get(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/search-blogs?page=${currentPage}&size=${pageSize}&filter=title~'${query}' or tags~'${query}' or des~'${query}' or content~'${query}'`
            );
            const newBlogs = blogsResponse.data.data.data.result;
            const meta = blogsResponse.data.data.data.meta;
            setBlogs(prevBlogs => currentPage === 1 ? newBlogs : [...prevBlogs, ...newBlogs]);
            setTotalPages(meta.pages);

            // Search users
            const usersResponse = await axios.get(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/search-users?page=${currentUserPage}&size=${pageSize}&filter=fullName~'${query}' or email~'${query}'`
            );
            const newUsers = usersResponse.data.data.result;
            const userMeta = usersResponse.data.data.meta;
            setUsers(prevUsers => currentUserPage === 1 ? newUsers : [...prevUsers, ...newUsers]);
            setTotalUserPages(userMeta.pages);
        } catch (err) {
            console.log(err);
        }
   }

   const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1);
   }

   const handleLoadMoreUsers = () => {
        setCurrentUserPage(prev => prev + 1);
   }

   useEffect(() => {
    searchBlogs({query});
   }, [query, currentPage, currentUserPage]);

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader />
                    :
                    users.length ?
                    users.map((user, i) => {
                        return (
                            <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                                <UserCard user={user} />
                            </AnimationWrapper>
                        )
                    })
                    : <NoDataMessage message="Không có tài khoản liên quan" />
                }
                <LoadMore 
                    currentPage={currentUserPage}
                    totalPages={totalUserPages}
                    onLoadMore={handleLoadMoreUsers}
                />
            </>
        )
    }

    return (
        <section className='h-cover flex justify-center gap-10'>
            <div className='w-full'>
                <InPageNavigation routes={[`Kết quả tìm kiếm cho "${query}"`, "Tài khoản liên quan"]} defaultHidden={['Tài khoản liên quan']}>
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

                    <UserCardWrapper />
                </InPageNavigation>
            </div>

            <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden'> 
                <h1 className='font-medium text-xl mb-8'>Tài khoản liên quan <i className='fi fi-rr-user mt-3 ml-2'></i></h1>
                <UserCardWrapper />
                <LoadMore 
                    currentPage={currentUserPage}
                    totalPages={totalUserPages}
                    onLoadMore={handleLoadMoreUsers}
                />
            </div>
        </section>
    )
};

export default SearchPage;