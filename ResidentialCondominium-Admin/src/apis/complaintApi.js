import axiosClient from "./axiosClient";

const complaintApi = {
    async listComplaints() {
        const url = 'complaints';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createComplaint(data) {
        const url = 'complaints/submit';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateComplaint(data, id) {
        const url = 'complaints/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchComplaint(name) {
        const url = 'complaints/search?subject=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteComplaint(id) {
        const url = 'complaints/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailComplaint(id) {
        const url = 'complaints/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default complaintApi;
