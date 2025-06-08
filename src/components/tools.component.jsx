import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";


const uploadImagebyURL = (e)=>{
    let link = new Promise((resolve, reject)=>{
        try {
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })
    return link.then(url => {
        return {
            success: 1,
            file: {url}
        }
    });
}

export const tools = {
    embed: Embed,
    // image: {
    //     class: Image,
    //     config: {
    //         uploader: {
    //             uploadByUrl: uploadImagebyURL
    //         }
    //     }
    // },
    header: {
        class: Header,
        inlineToolbar: true,
        config: {
            placeholder: "Tiêu đề...",
            levels: [2, 3],
            defaultLevel: 2,
        }
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
            quotePlaceholder: "Nhập lời dẫn...",
            captionPlaceholder: "Tiêu đề...",
        }
    },
    marker: Marker,
    inlineCode: InlineCode,
}
