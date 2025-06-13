import { Link } from "react-router-dom";
import UserAvatar from "./user-avatar";
import { getDay } from "../common/date";

const MinimalBlogPost = ({ blog1, index }) => {
    let {title, blog_id: id, published_at, author:{personal_info:{fullName, email}}} = blog1;
    const getUserNameFormEmail = () => {
        return email.split('@')[0];
    }

    let userName = getUserNameFormEmail();
    
    return (
       <Link to={`/api/blogs/${id}`} className="flex gap-5 mb-8">
        <h1 className="blog-index">{index<10 ? "0" + (index +1) : index +1}</h1>
        <div>
            <div className="flex gap-2 items-center mb-7">
                <UserAvatar name={fullName} size={20} />
                <p className="line-clamp-1">{fullName}  @{userName}</p>
                <p className="min-w-fit">{getDay(published_at)}</p>
            </div>
            <h1 className="blog-title">{title}</h1>
        </div>
       </Link>
    )
}

export default MinimalBlogPost;