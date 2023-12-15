import axiosClient from "./axiosClient";

const emergencyMaintenanceApi = {
    async listEmergencyMaintenance() {
        const url = 'emergency';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createEmergencyMaintenance(data) {
        const url = 'emergency';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateEmergencyMaintenance(data, id) {
        const url = 'emergency/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchEmergencyMaintenance(name) {
        const url = 'emergency/search?keyword=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteEmergencyMaintenance(id) {
        const url = 'emergency/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailEmergencyMaintenance(id) {
        const url = 'emergency/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default emergencyMaintenanceApi;
