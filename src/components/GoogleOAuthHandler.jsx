import { useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

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
            sessionStorage.setItem('user', JSON.stringify(userData));
            setUserAuth(userData);
            window.history.replaceState({}, document.title, '/');
            navigate('/');
            console.log(userData);
        }
    }, [setUserAuth, navigate]);

    return null; 
}
