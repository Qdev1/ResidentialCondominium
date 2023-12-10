import axiosClient from "./axiosClient";

const maintenancePlansApi = {
    async listMaintenancePlans() {
        const url = 'maintenance-plans/2';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async listMaintenanceReports(id) {
        const url = 'maintenance-plans/' + id + '/reports';
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
    async createMaintenancePlan(data) {
        const url = 'maintenance-plans';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createMaintenanceReports(data) {
        const url = 'maintenance-plans/reports';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateMaintenancePlan(data, id) {
        const url = 'maintenance-plans/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchMaintenancePlans(name) {
        const url = 'maintenance-plans/search?keyword=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteMaintenancePlan(id) {
        const url = 'maintenance-plans/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailMaintenancePlan(id) {
        const url = 'maintenance-plans/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default maintenancePlansApi;
