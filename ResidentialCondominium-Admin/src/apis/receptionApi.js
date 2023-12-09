import axiosClient from "./axiosClient";

const receptionApi = {
    async listReception() {
        const url = 'reception';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createReception(data) {
        const url = 'reception';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateReception(data, id) {
        const url = 'reception/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchReception(name) {
        const url = 'reception/search?query=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteReception(id) {
        const url = 'reception/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailReception(id) {
        const url = 'reception/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default receptionApi;
