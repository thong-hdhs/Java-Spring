import React, { useContext, useState } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom'
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import { createContext } from 'react';

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

  const [blog, setBlog] = useState(blogStructure);

  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({isReady: false});

    let {userAuth: {accessToken}} = useContext(UserContext)

  return (
    <EditorContext.Provider value={{blog, setBlog, editorState, setEditorState, textEditor, setTextEditor}}>
    {
      accessToken === null ? <Navigate to="/signin"/>
      :
      editorState === "editor" ? <BlogEditor/> : <PublishForm/>
    }
    </EditorContext.Provider>
  )
}

export default Editor