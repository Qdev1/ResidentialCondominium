import axiosClient from "./axiosClient";

const meetingResidentsApi = {
    async getAllMeetings() {
        const url = 'meetings';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAllEventsByMeetingId(id) {
        const url = 'meetings/events/'+id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAllRegistrationsForMeeting(id) {
        const url = `meetings/${id}/registrations`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createMeeting(data) {
        const url = `meetings`;
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async recordEvent(data) {
        const url = 'meetings/events';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async registerForMeeting(data) {
        const url = 'meetings/register';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchMeetingsByTitle(name) {
        const url = `meetings/search?title=${name.target.value}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchEventsByMeeting(name, id) {
        console.log("tên id" + id);
        const url = `meetings/meeting/` + id +`/search?eventName=${name.target.value}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getMeetingById(id) {
        const url = `meetings/${id}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default meetingResidentsApi;
