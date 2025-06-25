import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import toast, { Toaster } from "react-hot-toast";
import InputBox from "../components/input.component";
import { dataStructure } from "./profile.page";

const EditProfile = () => {

    let {userAuth:{accessToken, user}} =useContext(UserContext);

    const [ profile, setProfile ] = useState(dataStructure);
    const [ loading, setLoading ] = useState(true);
    let editprofile = useRef();
        

    useEffect(() => {
        if(accessToken) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/users/" + user.id, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((data) => {
                const profileData = data.data.data.userInfo;
                setProfile(profileData);
                setLoading(false);
                console.log(profileData);
            });
        }
    }, [accessToken]);

    // Hàm cập nhật profile khi thay đổi input/select
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        let form = new FormData(editprofile.current);
        let formData = {};
        for(let [key, value] of form.entries()){
            formData[key] = value;
        }

        let {fullName, email, address, phoneNumber, gender, age} = formData;

        let loadingToast = toast.loading("Đang cập nhật thông tin...");

        axios.put(import.meta.env.VITE_SERVER_DOMAIN + "/api/users/" + user.id,
            {
                fullName,
                address,
                phoneNumber,
                gender,
                age
            }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((data) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.success("Cập nhật thông tin thành công!");
        }).catch((error) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.error("Cập nhật thông tin thất bại!");
        });
    }

    return (
        <AnimationWrapper>
            {
                loading ? <Loader/>
                :
                <form ref={editprofile}>
                    <Toaster/>
                    <h1>Chỉnh sửa thông tin cá nhân</h1>
                    <div className="flex flex-col lg:flex-row items-start gap-8 py-10 lg:gap-10">
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div >
                                    <InputBox 
                                    name="fullName" 
                                    type="text" 
                                    value={profile.fullName}
                                    placeholder="Họ và tên" 
                                    disabled={false}
                                    icon="fi-rr-user"
                                    />
                                </div>

                                <div >
                                    <InputBox 
                                    name="email" 
                                    type="text" 
                                    value={profile.email}
                                    placeholder="Email" 
                                    disabled={true}
                                    icon="fi-rr-envelope"
                                    />
                                </div>

                                <div >
                                    <InputBox 
                                    name="address" 
                                    type="text" 
                                    value={profile.address}
                                    placeholder="Địa chỉ" 
                                    disabled={false}
                                    icon="fi-rr-map-marker"
                                    />
                                </div>

                                <div >
                                    <InputBox 
                                    name="phoneNumber" 
                                    type="text" 
                                    value={profile.phoneNumber}
                                    placeholder="Số điện thoại" 
                                    disabled={false}
                                    icon="fi-rr-mobile-notch"
                                    />
                                </div>

                                <div>
                                    {/* Dropdown chọn năm sinh */}
                                    <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">
                                        Năm sinh
                                    </label>
                                    <select
                                        id="age"
                                        name="age"
                                        value={profile.age || ""}
                                        onChange={handleChange}
                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                        <option value="">Chọn năm sinh</option>
                                        {Array.from({length: 100}, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return <option key={year} value={year}>{year}</option>
                                        })}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">
                                        Giới tính
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={profile.gender}

                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="MALE">Nam</option>
                                    </select>
                                </div>

                                <button 
                                type="submit"
                                className="btn-dark w-auto px-10 my-4"
                                onClick={handleUpdateProfile}
                                >Cập nhật</button>
                            </div> {/* Kết thúc grid các input */}
                        </div>
                    </div>
                </form>

            }
        </AnimationWrapper>
    )
}

export default EditProfile;