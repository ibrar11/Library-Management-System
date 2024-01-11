import { useNavigate } from "react-router";

const { useEffect } = require("react");
const { default: useRefreshToken } = require("./useRefreshToken");
const { default: useAuthContext } = require("./useAuthContext");
const { axiosPrivate, default: axios } = require("../api/axios");


const useAxiosPrivate = () => {

    const refresh = useRefreshToken();
    const { auth,setAuth } = useAuthContext();
    const navigate = useNavigate();

    useEffect(()=>{

        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                if(error?.response?.status === 401) {
                    await axios.put('auth/logout',{uuid:localStorage.getItem('user')});
                    setAuth(null);
                    localStorage.clear();
                    navigate('/');
                }
                return Promise.reject(error);
            }
        // eslint-disable-next-line
        );
        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        }
        // eslint-disable-next-line
    },[auth,refresh])

    return axiosPrivate;
};

export default useAxiosPrivate;