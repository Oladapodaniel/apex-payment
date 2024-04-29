import axios from 'axios';

export default axios.create({
    baseURL: 'https://apex-payments-eca4dc83534e.herokuapp.com/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    }
})