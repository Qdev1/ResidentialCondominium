import axiosClient from "./axiosClient";

const assetManagementApi = {
    async listAssetManagement() {
        const url = 'assets';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async listAssetReports(id) {
        const url = 'assets/'+id+"/reports";
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAssetStatistics(year, month) {
        const url = `statistics?year=${year}&month=${month}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAssetManagement(data) {
        const url = 'assets';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAssetReports(data) {
        const url = 'assets/reports';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateAssetManagement(data, id) {
        const url = 'assets/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchAssetManagement(name) {
        const url = 'assets/search?keyword=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteAssetManagement(id) {
        const url = 'assets/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailAssetManagement(id) {
        const url = 'assets/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default assetManagementApi;
