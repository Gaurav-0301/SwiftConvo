import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"http://localhost:2724",
    withCredentials:true,
});