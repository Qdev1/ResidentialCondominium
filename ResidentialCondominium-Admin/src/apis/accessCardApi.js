import axiosClient from "./axiosClient";

const accessCardApi = {
    async listAccessCard() {
        const url = 'access-card';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAccessCard(data) {
        const url = 'access-card';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateAccessCard(data, id) {
        const url = 'access-card/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchAccessCard(name) {
        const url = 'access-card/search?query=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteAccessCard(id) {
        const url = 'access-card/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailAccessCard(id) {
        const url = 'access-card/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default accessCardApi;
