import React, { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";



const Tag = ({tag, tagIndex}) => {

    let {blog, blog: {tags}, setBlog} = useContext(EditorContext)

    const addEditable = (e) => {
        e.target.setAttribute("contentEditable", "true");
        e.target.focus();
    }
    

    const handleTagEdit = (e) => {
        if(e.key === "Enter" || e.keyCode === 188){
            e.preventDefault();

            let currenttag = e.target.innerText;

            tags[tagIndex] = currenttag;

            setBlog({...blog, tags});

            e.target.setAttribute("contentEditable", "false");
            console.log(tags);
        }
    }

    const handleTagDelete = () => {
    tags = tags.filter(t => t != tag)
    setBlog({...blog, tags})
    }

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
            <p className="outline-none" onKeyDown={handleTagEdit} onClick={addEditable}>{tag}</p>
            <button 
                className="mt-[1px] rounded-full absolute right-4 top-1/2 -translate-y-1/2 "
                onClick={handleTagDelete}
            >
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    )
}

export default Tag;