import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";

const Quote = ({quote, caption}) => {
    return (
         <div className=" bg-purple/10 p-3 pl-5 border-l-4 border-purple">
             <p className="text-xl leading-10 md:text-2xl">{quote}</p>
              {caption.length ? <p className="w-full text-purple text-base">
              {caption}</p> : ""}
        </div>
    )
}

const List = ({style, items}) => {
    return (
         <ol className={`pl-5 ${ style == "ordered" ? "list-decimal" : "list-disc"}`}>
             {items.map((listItem, i) => {
                     return <li key={i} className="my-4"
                    dangerouslysetInnerHTML={{ __html: listItem }}></li>
            })}
         </ol>
    )
}


const BlogContent = ({block}) => {
    console.log(block);
    let {type, data} = block;
    switch(type){
        case "paragraph":
            return <p dangerouslySetInnerHTML={{__html: data.text}}></p>
        case "header":
            if(data.level == 3){
            return <h3 className="text-3xl font-bold"
            dangerouslySetInnenHTML={{ __html: data.text }}></h3>
            }
            return <h2 className="text-4xl font-bold" dangerouslySetInnerHTML=
            {{ __html: data.text }}></h2>
        case "quote":
            return <Quote quote={data.quote} caption={data.caption}/>
        case "list":
            return <List style={data.style} items={data.items}/>
    }
    
} 

export default BlogContent;