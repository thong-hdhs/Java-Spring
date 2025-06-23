import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import { useContext, useRef } from "react";
import { UserContext } from "../App";
import axios from "axios";

const ChangePassword = () => {

    let {userAuth:{accessToken, user}} =useContext(UserContext);
    console.log(user.email);

    let changePasswordForm = useRef();
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");

        let form = new FormData(changePasswordForm.current);

        let formData ={};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let {currentPassword, newPassword} = formData;

        if(!currentPassword.length || !newPassword.length) {
            return toast.error("Hãy nhập đầy đủ thông tin"); 
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số, ký tự đặc biệt");
        }

        if(currentPassword === newPassword) {
            return toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại");
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("Đang thay đổi mật khẩu...");

        axios.put(import.meta.env.VITE_SERVER_DOMAIN + "/api/reset-password",
            {
                email: user.email,
                currPass: currentPassword,
                newPass: newPassword
            },
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        )
        .then((res) => {   
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            console.log(res);
            return toast.success("Mật khẩu đã được thay đổi thành công");
        })
        .catch((err) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            console.log(err);
            return toast.error(err.response.data);
        })
        .finally(() => {
            e.target.removeAttribute("disabled");
            toast.dismiss(loadingToast);
        })
    }
    return (
        <AnimationWrapper>
            <Toaster />
     <form ref={changePasswordForm}>
         <h1 className="max-md :hidden">Change Password</h1>

         <div className="py-10 w-full md:max-w-[400px]">
            <InputBox name="currentPassword" type="password"
            className="profile-edit-input" placeholder="Current Password" icon="fi-rr-unlock" />
            <InputBox name="newPassword" type="password"
            className="profile-edit-input" placeholder="New Password" icon="fi-rr-unlock" />
            <button onClick={handleSubmit}
            className='btn-dark px-10' type="submit">Change Password</button>
        </div>
                                                       
    </form>
                                                                  
</AnimationWrapper>

    )
}

export default ChangePassword;