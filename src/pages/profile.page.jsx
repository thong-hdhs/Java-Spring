import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import UserAvatar from "../components/user-avatar";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMore from "../components/load-more.component";

export const dataStructure = {
    userInfo:{
        id:"",
        fullName:"",
        email:"",
        createAt:"",
    },
    totalPosts:0,
    totalViews:0
}

const ProfilePage = () => {
    let { id: profileId } = useParams();
    let [proFile, setProFile] = useState(dataStructure);
    let [loading, setLoading] = useState(true);

    let [blogs, setBlogs] = useState(null);

    let [currentPage, setCurrentPage] = useState(1);
    let [pageSize] = useState(5);
    let [totalPages, setTotalPages] = useState(1);

    const { userAuth } = useContext(UserContext);
    const userId = userAuth?.user?.id;

    let {userInfo:{id, fullName, email, createAt, gender}, totalPosts, totalViews} = proFile;

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/users/${profileId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${userAuth?.accessToken}`
                    }
                }
            );
            const user = response.data.data;
            setProFile(user);
        } catch (err) {
            console.error('Lỗi khi lấy thông tin profile:', err);
            if (err.response?.status === 401) {
                console.error('Token không hợp lệ hoặc đã hết hạn');
            }
        } finally {
            setLoading(false);
        }
    }

    const getBlog = ({profileId})=>{
        setLoading(true);
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/search-blogs?page=${currentPage}&size=${pageSize}&filter=user.id:${profileId}`)
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

    const getUserNameFormEmail = () => {
        return email?.split('@')[0] || '';
    }
    let userName = getUserNameFormEmail(email);

    useEffect(() => {
        if (userAuth?.accessToken) {
            fetchProfile();
            getBlog({profileId});
        }
    }, [userAuth]);

    return (
        <AnimationWrapper>
            {
                loading ? <Loader/>
                :
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    <div className="flex flex-col max-md:items-center min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-20 md:top-[100px] md:py-10">
                        <UserAvatar name={fullName} size={140}  />
                        <h1 className="text-xl font-medium">@{userName}</h1>
                        <p className="text-2xl capitalize h-6">{fullName}</p>
                        <p className="text-dark-grey mt-4">Bài viết đã đăng: {totalPosts?.toLocaleString() || 0} - Số người đọc: {totalViews?.toLocaleString() || 0}</p>

                        <div className="flex gap-4 mt-4">
                            {
                                profileId === userId?.toString() ?
                                    <Link to={`/settings/profile/${id}/edit`}
                                    className="btn-light rounded-md">
                                        Chỉnh sửa hồ sơ
                                    </Link>
                                : null
                            }
                        </div>
                        <AboutUser className="max-md:hidden" createAt={createAt} gender={gender} />
                    </div>
                    <div className="max-md:mt-12 w-full">
                    <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]} >
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

                        <AboutUser createAt={createAt} gender={gender} />


                    </InPageNavigation>

                    </div>
                </section>
            }
        </AnimationWrapper>
    )
}

export default ProfilePage;