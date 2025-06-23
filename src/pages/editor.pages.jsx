import React, { useContext, useEffect, useState, useMemo } from 'react'
import { UserContext } from '../App'
import { Navigate, useParams } from 'react-router-dom'
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import { createContext } from 'react';
import Loader from '../components/loader.component';
import axios from 'axios';

const blogStructure = {
  title: "",
  banner: null,
  content: [],
  des: "",
  tags: [],
  author: {},
  isPublished: false,
  publishedAt: null,
}

export const EditorContext = createContext({});

const Editor = () => {

  let {blog_id} = useParams();

  const [blog, setBlog] = useState(blogStructure);

  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({isReady: false});

  const [loading, setLoading] = useState(true);

  let {userAuth: {accessToken}} = useContext(UserContext)

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

      axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/blogs/${blog_id}`  )
        .then((res)=>{
            
          const blog = res.data.data.data;
          console.log(blog);
          setBlog(blog);
          setLoading(false);
      })
      .catch((err)=>{
          console.log(err);
          setLoading(false);
          setBlog(null)
      })

  }, [])

  const blocks = useMemo(() => {
    if (!blog.content) return [];
    const contentObj = typeof blog.content === "string" ? JSON.parse(blog.content) : blog.content;
    return contentObj.blocks || [];
  }, [blog]);

  console.log(blocks);

  return (
    <EditorContext.Provider value={{blog, setBlog, editorState, setEditorState, textEditor, setTextEditor}}>
    {
      accessToken === null ? <Navigate to="/signin"/>
      :
      loading ? <Loader/> :
      editorState === "editor" ? <BlogEditor dataUpdate={{blocks}}/> : <PublishForm id={blog_id}/>
    }
    </EditorContext.Provider>
  )
}

export default Editor