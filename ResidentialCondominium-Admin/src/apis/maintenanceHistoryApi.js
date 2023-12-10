import axiosClient from "./axiosClient";

const maintenanceHistoryApi = {
    async listMaintenanceHistory() {
        const url = 'maintenance-history/plan/2';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async listMaintenanceReports(id) {
        const url = `maintenance-history/${id}/reports`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getMaintenanceStatistics(year, month) {
        const url = `statistics?year=${year}&month=${month}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createMaintenanceHistory(data) {
        const url = 'maintenance-history';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createMaintenanceReports(data) {
        const url = 'maintenance-history/reports';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateMaintenanceHistory(data, id) {
        const url = `maintenance-history/${id}`;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchMaintenanceHistory(name) {
        const url = `maintenance-history/search?keyword=${name.target.value}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteMaintenanceHistory(id) {
        const url = `maintenance-history/${id}`;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailMaintenanceHistory(id) {
        const url = `maintenance-history/${id}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
} 

export default maintenanceHistoryApi;
