import axiosClient from "./axiosClient";

const maintenanceFundsApi = {
    async listMaintenanceFunds() {
        const url = 'maintenance-funds';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createMaintenanceFunds(data) {
        const url = 'maintenance-funds';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateMaintenanceFunds(data, id) {
        const url = 'maintenance-funds/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchMaintenanceFunds(name) {
        const url = 'maintenance-funds/search?description=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteMaintenanceFunds(id) {
        const url = 'maintenance-funds/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailMaintenanceFunds(id) {
        const url = 'maintenance-funds/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default maintenanceFundsApi;
