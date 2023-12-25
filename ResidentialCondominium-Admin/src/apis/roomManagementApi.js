import axiosClient from "./axiosClient";

const roomManagementApi = {
    async listRoomManagement() {
        const url = 'room';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createRoomManagement(data) {
        const url = 'room';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async addResidentToRoom(data) {
        const url = 'room/addResident';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async removeResidentFromRoom(data) {
        const url = 'room/removeResident';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateRoomManagement(data, id) {
        const url = 'room/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchRoomManagement(name) {
        const url = 'room/search?keyword=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteRoomManagement(id) {
        const url = 'room/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailRoomManagement(id) {
        const url = 'room/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default roomManagementApi;
