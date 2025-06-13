import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import UserAvatar from "./user-avatar";

const BlogPostCard = ({content, author}) => {

    let { published_at, tags, title, des, banner, activity:{total_likes}, blog_id: id} = content;
    let {fullName, email} = author;

    const getUserNameFormEmail = () => {
        return email.split('@')[0];
    }

    let userName = getUserNameFormEmail();

    return (
        <Link to={`/api/blogs/${id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
            <div className="w-full">
                    <div className="flex gap-2 items-center mb-7">
                            <UserAvatar name={fullName} size={20} />
                        <p className="line-clamp-1">{fullName}  @{userName}</p>
                        <p className="min-w-fit">{getDay(published_at)}</p>
                    </div>

                <h1 className="blog-title">{title}</h1>

                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{des}</p>

                <div className="flex gap-4 mt-7">
                    <span className="btn-light py-1 px-4">{tags[0]}</span>
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-heart text-xl"></i>
                        {total_likes} 
                    </span>
                </div>
            </div>
            <div className="h-28 aspect-square bg-grey rounded-lg ">
                <img src={banner} alt="banner" className="w-full h-full object-cover aspect-square rounded-lg"/>
            </div>
        </Link>
    )
}

export default BlogPostCard;