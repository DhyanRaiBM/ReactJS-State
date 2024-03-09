import { fetchFromApi } from "./fetchFromApi";

export const refreshAccessToken = async () => {
    try {
        const response = await fetchFromApi('/api/users/refresh-access-token', {}, "POST");
        return response;
    } catch (error) {
        console.log(error);
    }
}