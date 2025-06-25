import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import axios from "axios";

const ManageBlogCard = ({blog})=>{

    let {banner, title, published_at, blog_id, tags, des, activity:{total_likes}} = blog;
    const {userAuth: {accessToken}} = useContext(UserContext);
    const { confirm } = Modal;

    const showDeleteConfirm = () => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa bài viết này không?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này sẽ không thể hoàn tác. Bạn có muốn tiếp tục?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete();
            },
            onCancel() {
                // Không làm gì, chỉ đóng modal
            },
        });
    };

    const handleSubmitDelete = () => {
        showDeleteConfirm();
    };

    const handleDelete = ()=>{
        let loadingToast = toast.loading("Đang xóa bài viết...");
        axios.delete(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/${blog_id}`,{
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then((res)=>{
            toast.dismiss(loadingToast);
            toast.success(res.data);
        })
        .catch((err)=>{
            toast.dismiss(loadingToast);
            toast.error(err.response.data);
        })
        .finally(()=>{
            toast.dismiss(loadingToast);
        })

        getBlog({profileId: userId});
    }
    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
                <img src= {banner} className="max-md :hidden 1g:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" />
                <div className="flex flex-col justify-between ру-2 w-full min-w-[300px]">
                    <div>
                        <Link to={`/blog/${blog_id}`} className="blog-title mb-4 hover:underline">{title}</Link>
                        <p className="line-clamp-1">{total_likes} lượt thích | Đăng bài vào {getDay(published_at)}</p>
                    </div>
                    <div className= "flex gap-6 mt-3">
                        <Link to={`/editor/${blog_id}`} className="pr-4 ру-2 underline">Edit</Link>
                        <button 
                        className="pr-4 ру-2 underline text-red"
                        onClick={handleSubmitDelete}
                        >Delete</button>
                    </div>

                </div>
            </div>

        </>
    )
} 

export default ManageBlogCard;