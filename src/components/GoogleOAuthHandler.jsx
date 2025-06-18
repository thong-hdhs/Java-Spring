import { useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function GoogleOAuthHandler() {
    const { setUserAuth } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const userId = urlParams.get('user_id');
        const userName = urlParams.get('user_name');
        const userEmail = urlParams.get('user_email');

        if (accessToken) {
            const userData = {
                accessToken,
                user: {
                    id: parseInt(userId),
                    fullName: decodeURIComponent(userName),
                    email: userEmail
                }
            };
            
            try {
                sessionStorage.setItem('user', JSON.stringify(userData));
                setUserAuth(userData);
                toast.success('Đăng nhập thành công!');
                window.history.replaceState({}, document.title, '/');
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Lỗi khi xử lý đăng nhập:', error);
                toast.error('Có lỗi xảy ra khi đăng nhập');
                navigate('/signin');
            }
        } 
        else {
            toast.error('Không nhận được thông tin đăng nhập');
            navigate('/signin');
        }
    }, [setUserAuth, navigate]);

    return null; 
}
