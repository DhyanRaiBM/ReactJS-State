import { fetchFromApi } from "./fetchFromApi";

export const refreshAccessToken = async () => {
    try {
        const response = await fetchFromApi('https://react-state-api-production.up.railway.app/api/users/refresh-access-token', {}, "POST");
        return response;
    } catch (error) {
        console.log(error);
    }
}