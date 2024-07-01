import axios from "axios";

const customAxios = axios.create({
    validateStatus: function (status) {
        // Resolve only if the status code is in the range of 200-499
        return status >= 200 && status < 500;
    },
    withCredentials: true // Ensure credentials (cookies) are included in requests
});

export const fetchFromApi = async (url, data = {}, method = 'GET', options = {}) => {
    const defaultOptions = {
        method: method, // Set the method type
        headers: {
            'Content-Type': 'application/json'
        },
        ...options, // Allow overriding default options
        withCredentials: true // Ensure credentials (cookies) are included in requests
    };

    try {
        const response = await customAxios(url, {
            ...defaultOptions,
            data,
        });

        return response.data;

    } catch (error) {
        console.error('Error caught inside fetchFromApi:', error.message);
        throw new Error('An error occurred during API request');
    }
};
