import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://stage-udemy-big-burger.firebaseio.com/'
});

export default instance;