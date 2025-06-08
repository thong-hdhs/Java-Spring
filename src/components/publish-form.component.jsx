import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";

const PublishForm = () => {

    const charLimit = 200;
    const tagLimit = 10;
    let {blog, blog:{banner, title, content, tags, des}, setEditorState, setBlog} = useContext(EditorContext)

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

                        <button className="btn-dark px-8 py-3 my-4 md:w-full">
                            Đăng bài viết
                        </button>
                </div>               
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;