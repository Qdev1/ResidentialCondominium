import axiosClient from "./axiosClient";

const visitorsApi = {
    async listVisitors() {
        const url = 'visitors';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createVisitors(data) {
        const url = 'visitors';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateVisitors(data, id) {
        const url = 'visitors/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchVisitors(name) {
        const url = 'visitors/search?citizenId=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteVisitors(id) {
        const url = 'visitors/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailVisitors(id) {
        const url = 'visitors/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default visitorsApi;
