import axios from '../api/axios';
import useAuthContext from './useAuthContext';

const useRefreshToken = () => {
    axios.defaults.withCredentials = true;
    const {setAuth} = useAuthContext();

    const refresh = async () => {
        const response = await axios.get('/refresh');
        setAuth({ ...response.data });
        return response.data.accessToken;
    }
  return refresh ; 
}

export default useRefreshToken;
