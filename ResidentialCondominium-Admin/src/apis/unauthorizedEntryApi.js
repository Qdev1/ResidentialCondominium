import axiosClient from "./axiosClient";

const unauthorizedEntryApi = {
    async listUnauthorizedEntries() {
        const url = 'entry';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createUnauthorizedEntry(data) {
        const url = 'entry';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateUnauthorizedEntry(data, id) {
        const url = 'entry/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchUnauthorizedEntry(name) {
        const url = 'entry/search?queryParam=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteUnauthorizedEntry(id) {
        const url = 'entry/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailUnauthorizedEntry(id) {
        const url = 'entry/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default unauthorizedEntryApi;
