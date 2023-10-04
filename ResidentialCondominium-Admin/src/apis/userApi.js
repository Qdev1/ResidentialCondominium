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
   
}

export default userApi;