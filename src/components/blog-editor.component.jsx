import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import toast from "react-hot-toast";

const BlogEditor = () => {

    let {blog, blog:{title, banner, content, tags, des}, setBlog, textEditor, setTextEditor, textEditorState, setEditorState} = useContext(EditorContext);

    useEffect(() => {
        setTextEditor(new EditorJS({
            holderId: "textEditor",
            data:content,
            tools: tools, 
            placeholder: "Nội dung bài viết",
        }))
    },[])
    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
        if (img) {
            console.log(img);
        }
    }

    // handle title keydown
    const handleTitleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    // handle title change
    const handleTitleChange = (e) => {
        let input = e.target;

        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";

        setBlog({...blog, title: input.value})
    }


    const handlePublishEvent = () => {
        if(!title.length){
            return toast.error("Vui lòng nhập tiêu đề bài viết")
        }

        if(textEditor.isReady){
            textEditor.save().then(data=>{
                if(data.blocks.length){
                    setBlog({...blog, content: data})
                    setEditorState("publish")
                }else{
                    return toast.error("Vui lòng nhập nội dung bài viết")
                }
                console.log(data)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    return (
        <>
            <nav className="navbar ">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} alt="logo" />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "Bài viết mới"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2 "
                        onClick={handlePublishEvent}
                    >
                        Đăng bài viết
                    </button>
                    {/* <button className="btn-light py-2 ">
                        Lưu bản nháp
                    </button> */}

                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="reative aspect-video bg-white border-4 border-grey hover:opacity-80">
                            <label htmlFor="uploadBanner">
                                <img src={banner ? banner : defaultBanner} alt="banner" 
                                    className="z-20"
                                />
                                <input 
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea
                            defaultValue={title}
                            name="title"
                            placeholder="Tiêu đề bài viết"
                            className="resize-none w-full text-4xl h-20 font-medium outline-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5 " />

                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor;