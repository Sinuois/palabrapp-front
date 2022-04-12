import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseURL = 'https://palabrapp-restserver.herokuapp.com/api';
// export const baseURL = 'http://192.168.1.5:8080/api';

const palabrasApi = axios.create({ baseURL });

palabrasApi.interceptors.request.use(
    async(config: any) => {
        const token = await AsyncStorage.getItem('token');
        if ( token ) {
            config.headers['x-token'] = token;
        }
        return config;
    }
);



export default palabrasApi;
