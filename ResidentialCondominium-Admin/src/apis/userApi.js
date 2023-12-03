import axiosClient from "./axiosClient";

const userApi = {
    login(email, password) {
        const url = '/auth/login';
        return axiosClient
            .post(url, {
                email,
                password,
            })
            .then(response => {
                console.log(response);
                if (response.status) {
                    localStorage.setItem("token", response.token);
                }
                return response;
            });
    },
   
    getProfile() {
        const url = '/user/profile';
        return axiosClient.get(url);
    },

    updateProfile(data, id) {
        const url = '/user/updateProfile/'+id;
        return axiosClient.put(url, data);
    },

    forgotPassword(data) {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, data);
    },
   
    listUserByAdmin(data) {
        const url = '/user/search';
        if (!data.page || !data.limit) {
            data.limit = 10;
            data.page = 1;
        }
        return axiosClient.post(url, data);
    },
    
    banAccount(data, id) {
        const url = '/user/' + id;
        return axiosClient.put(url, data);
    },

    unBanAccount(data, id) {
        const url = '/user/' + id;
        return axiosClient.put(url, data);
    },

    searchUser(email) {
        console.log(email);
        const params = {
            email: email.target.value
        }
        const url = '/user/searchByEmail';
        return axiosClient.get(url, { params });
    },
}

export default userApi;