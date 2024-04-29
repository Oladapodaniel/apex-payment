import axios from "../lib/axios";

export const getPayments = (status, num_per_page, page) => {
    try {
        let response = axios.get(`/transactions?page=${page}&per_page=${num_per_page}&state=${status.toLowerCase()}`);
        return response
    }
    catch (error) {
        return error
    }
}

export const makePayment = (payload) => {
    try {
        let response = axios.post(`/pay-dues`, payload);
        return response
    }
    catch (error) {
        return error
    }
}