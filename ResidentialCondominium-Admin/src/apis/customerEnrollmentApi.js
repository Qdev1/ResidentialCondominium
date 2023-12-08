import axiosClient from "./axiosClient";

const customerEnrollment = {
    async listCustomerEnrollment() {
        const url = 'customer-enrollment';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createCustomerEnrollment(data) {
        const url = 'customer-enrollment';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateCustomerEnrollment(data, id) {
        const url = 'customer-enrollment/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchCustomerEnrollment(name) {
        const url = 'customer-enrollment/search?keyword=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteCustomerEnrollment(id) {
        const url = 'customer-enrollment/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailCustomerEnrollment(id) {
        const url = 'customer-enrollment/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default customerEnrollment;
