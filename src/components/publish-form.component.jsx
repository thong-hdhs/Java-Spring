import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { Navigate, useNavigate } from "react-router-dom";

const PublishForm = ({id}) => {
    const numId = Number(id);

    const isUpdate = numId ? true : false;

    const charLimit = 200;
    const tagLimit = 10;
    let {blog, blog:{banner, title, content, tags, des}, setEditorState, setBlog} = useContext(EditorContext)

    // let {userAuth: {accessToken}} = useContext(UserContext)

    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) => {
        setBlog({...blog, title:e.target.value})
    }

    const handleBlogDesChange = (e) => {
        setBlog({...blog, des:e.target.value})
    }

    const handleTitleKeyDown = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
        }
    }

    const handleKeyDown = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188){
            e.preventDefault();

            let tag = e.target.value;

            if(tags.length < tagLimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({...blog, tags: [...tags, tag]})
                }
            
            }else{
                return toast.error(`Bạn chỉ được phép thêm tối đa ${tagLimit} topic`)
            }
            e.target.value = "";
        }
    }

    const publishBlog = (e) => {

        if(e.target.className.includes("disabled")){
            return;
        }
        if(!title.length){
            return toast.error("Tiêu đề bài viết không được để trống")
        }

        if(!des.length || des.length > charLimit){
            return toast.error(`Mô tả bài viết trong khoảng ${charLimit} ký tự`)
        }

        if(!tags.length){
            return toast.error("Bạn phải thêm ít nhất 1 topic")
        }

        let loadingToast = toast.loading("Đang đăng bài viết...")

        e.target.classList.add("disabled")

        let blogObj = {
            title, banner, des, content, tags,
            // draft: true,
        }
        
        // Thêm log kiểm tra dữ liệu gửi lên
        console.log("blogObj gửi lên:", blogObj);

        const userString = sessionStorage.getItem('user');
        if (userString) {
            const userData = JSON.parse(userString);
            const accessToken = userData.accessToken;
        

            if(!isUpdate){
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs", blogObj, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                }
            })
            .then(()=>{
                e.target.classList.remove("disabled");
                toast.dismiss(loadingToast);
                toast.success("Đăng bài viết thành công")

                // setTimeout(()=>{
                //     navigate("/")
                // }, 1000)
            })
            .catch(({response})=>{
                e.target.classList.remove("disabled");
                toast.dismiss(loadingToast);
                return toast.error(response.data.message)
            })}

            else{
                axios.put(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/${numId}`, blogObj, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                }
            })
            .then(()=>{
                e.target.classList.remove("disabled");
                toast.dismiss(loadingToast);
                toast.success("Cập nhật bài viết thành công")
            })
            .catch((err) => {
                e.target.classList.remove("disabled");
                toast.dismiss(loadingToast);
                console.log("Lỗi cập nhật:", err.response ? err.response.data : err);
                return toast.error(err.response?.data?.message || "Có lỗi xảy ra");
            })
            }
        }
        
        
    }
    
    
    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster/>
                
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                    onClick={handleCloseEvent}
                >
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center ">
                    <p className="text-dark-grey text-xl font-medium mb-1">Xem trước bài đăng</p>

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4 shadow-md">
                        {/* <img src={banner} alt="banner" /> */}
                        <img src="https://cdn-imgix.headout.com/tour/7064/TOUR-IMAGE/b2c74200-8da7-439a-95b6-9cad1aa18742-4445-dubai-img-worlds-of-adventure-tickets-02.jpeg?auto=format&w=900&h=562.5&q=90&ar=16%3A10&crop=faces%2Ccenter&fit=crop" alt="banner" />
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>

                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                
                </div>
                <div className="">
                    <p className="text-gark-grey mb-2 mt-9">
                        Tiêu đề bài viết
                    </p>
                    <input
                        defaultValue={title}
                        placeholder="Nhập tiêu đề bài viết"
                        type="text" 
                        className="input-box pl-4"
                        value={title}
                        onChange={handleBlogTitleChange}
                    />

                    <p className="text-gark-grey mb-2 mt-9">
                        Mô tả ngắn của bài viết
                    </p>
                    <textarea
                        maxLength={charLimit}
                        defaultValue={des}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onChange={handleBlogDesChange}
                        onKeyDown={handleTitleKeyDown}
                    >

                    </textarea>
                    
                    <p className="text-dark-grey text-sm mt-1 text-right">
                        {charLimit - des.length} ký tự còn lại
                    </p>

                    <p className="text-dark-grey mb-2 mt-9">Topics - (Giúp tìm kiếm và đưa bài viết của bạn lên dễ dàng hơn)</p>

                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input
                            type="text"
                            placeholder="Topic"
                            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                            onKeyDown={handleKeyDown}
                        />
                        {tags.map((tag, i)=>{
                            return <Tag key={i} tagIndex={i} tag={tag}/>
                        })}


                    </div>

                        <p className="text-dark-grey text-sm mt-1 mb-4 text-right">
                            {tagLimit - tags.length} Topic còn lại
                        </p>

                        <button className="btn-dark px-8 py-3 my-4 md:w-full"
                            onClick={publishBlog}
                        >
                            Đăng bài viết
                        </button>
                </div>               
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;