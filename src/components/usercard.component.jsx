import { Link } from "react-router-dom";
import UserAvatar from "./user-avatar";

const UserCard = ({user}) => {

    let {fullName, email, gender, id} = user;
    
    const getUserNameFormEmail = () => {
        return email.split('@')[0];
    }
    let userName = getUserNameFormEmail(email);
    
    return (
        <Link to={`/user/${id}`} className="flex gap-5 items-center mb-5">
            <UserAvatar name={fullName} size={40} />
            <div>
                <h1 className="font-medium text-xl line-clamp-2">{fullName}</h1>
                <p className="text-dark-grey">@{userName}</p>
            </div>
        </Link>
    )
}

export default UserCard;