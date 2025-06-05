import React, { useRef, useState, useContext, useEffect } from 'react'
import InputBox from '../components/input.component'
import googleIcon from '../imgs/googleIcon.png'
import { Link, Navigate } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'
import { storeInSession } from '../common/session'
import { UserContext } from '../App'


const UserAuthForm = ({ type }) => {

    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(UserContext);

    if (!context) {
        console.error('UserContext không tồn tại');
        return null;
    }

    const { userAuth, setUserAuth } = context;

    console.log('User Auth:', userAuth);

    // Xử lý token từ URL khi redirect từ Google OAuth
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const userId = urlParams.get('user_id');
        const userName = urlParams.get('user_name');
        const userEmail = urlParams.get('user_email');

        if (accessToken) {
            console.log('Nhận được token từ Google OAuth:', accessToken);
            
            // Tạo object user data
            const userData = {
                accessToken: accessToken,
                user: {
                    id: parseInt(userId),
                    fullName: decodeURIComponent(userName),
                    email: userEmail
                }
            };

            try {
                // Lưu vào session
                const userDataString = JSON.stringify(userData);
                sessionStorage.setItem('user', userDataString);
                console.log('Đã lưu thông tin user vào session:', userData);
                
                // Cập nhật userAuth context
                setUserAuth(userData);
                
                toast.success('Đăng nhập Google thành công!');
                
                // Xóa token khỏi URL để bảo mật
                window.history.replaceState({}, document.title, '/');
                
            } catch (error) {
                console.error('Lỗi khi xử lý token:', error);
                toast.error('Lỗi khi xử lý đăng nhập Google');
            }
        }
    }, [setUserAuth]);

    const userAuthThroughServer = async (serverRoute, formData) => {
        try {
            setIsLoading(true);
            console.log('Gửi request đến:', import.meta.env.VITE_SERVER_DOMAIN + serverRoute);
            console.log('Dữ liệu gửi đi:', formData);
            
            const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData);
            console.log('Response từ server:', data);
            
            if (data && data.data) {
                try {
                    const userData = JSON.stringify(data.data);
                    console.log('Dữ liệu người dùng trước khi lưu:', userData);
                    
                    // Kiểm tra xem dữ liệu có phải là JSON hợp lệ không
                    const parsedData = JSON.parse(userData);
                    console.log('Dữ liệu sau khi parse:', parsedData);
                    
                    // Lưu vào session
                    sessionStorage.setItem('user', userData);
                    console.log('Session sau khi lưu:', sessionStorage.getItem('user'));
                    
                    // Cập nhật userAuth context
                    if (setUserAuth) {
                        console.log('Setting userAuth with data:', parsedData);
                        setUserAuth(parsedData);
                    } else {
                        console.error('setUserAuth không tồn tại');
                    }
                    
                    toast.success(type === 'sign-in' ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
                    
                    // Chuyển hướng sau khi đăng nhập/đăng ký thành công
                    // setTimeout(() => {
                    //     window.location.href = '/';
                    // }, 1000);
                } catch (parseError) {
                    console.error('Lỗi khi xử lý dữ liệu:', parseError);
                    toast.error('Lỗi khi xử lý dữ liệu người dùng');
                }
            } else {
                console.log('Data nhận được:', data);
                toast.error('Không nhận được dữ liệu người dùng từ server');
            }
        } catch ({ response }) {
            console.log('Lỗi từ server:', response);
            toast.error(response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let serverRoute = type === 'sign-in' ? '/auth/login' : '/auth/register';
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, one letter and one number
        let fullnameRegex = /^[a-zA-Z\s]{3,}$/; // At least 3 characters, letters and spaces only

        //form data
        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            if (key === 'fullname') {
                formData['fullName'] = value;
            } else {
                formData[key] = value;
            }
        }
        console.log(formData);

        let { fullName, email, password } = formData;

        //form validate
        if (type === 'sign-up') {
            if (fullName) {
                if (fullName.length < 3) {
                    return toast.error('Họ và tên phải có ít nhất 3 ký tự');
                }
            }
        }

        if (!email.length) {
            return toast.error('Email không được để trống');
        }

        if (!emailRegex.test(email)) {
            return toast.error('Email không hợp lệ');
        }

        if (!passwordRegex.test(password)) {
            return toast.error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số');
        }

        userAuthThroughServer(serverRoute, formData);
    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        window.location.href = import.meta.env.VITE_SERVER_DOMAIN + '/oauth2/authorization/google';
    }

    return (
        userAuth.accessToken ?
        <Navigate to='/'/>
        :
        <AnimationWrapper keyValue={type}>
            <section className='h-cover flex items-center justify-center'>
                <Toaster />
                <form id='formElement' className='w-[80%] max-w-[400px]' onSubmit={handleSubmit}>
                    <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
                        {type === 'sign-in' ? 'Chào mừng bạn trở lại!' : 'Đăng ký'}
                    </h1>

                    {
                        type !== 'sign-in' ?
                            <InputBox
                                name='fullname'
                                type='text'
                                placeholder={'Nhập họ và tên của bạn'}
                                icon={'fi-rr-user'}
                            />
                            : ''
                    }

                    <InputBox
                        name='email'
                        type='email'
                        placeholder={'Email'}
                        icon={'fi-rr-envelope'}
                    />

                    <InputBox
                        name='password'
                        type='password'
                        placeholder={'Mật khẩu'}
                        icon={'fi-rr-lock'}
                    />

                    <button
                        className='btn-dark center mt-14'
                        type='submit'
                    >
                        {isLoading ? 'Đang xử lý...' : type.replace('-', ' ')}

                    </button>

                    <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                        <hr className='w-1/2 border-black' />
                        <span>hoặc</span>
                        <hr className='w-1/2 border-black' />

                    </div>
                    <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
                        onClick={handleGoogleAuth}
                    >
                        <img src={googleIcon} className='w-9' />
                        Tiếp tục với Google
                    </button>

                    {
                        type == 'sign-in' ?
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Bạn chưa có tài khoản?
                                <Link to='/signup' className='underline text-black text-xl ml-1'>
                                    Đăng ký
                                </Link>
                            </p>
                            :
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Bạn đã có tài khoản?
                                <Link to='/signin' className='underline text-black text-xl ml-1'>
                                    Đăng nhập
                                </Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm