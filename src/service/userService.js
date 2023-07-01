import axios from '../axios'

const login = (data) => {
    return axios.post(`/api/login`, data)
}

const createNewUser = (data) => {
    return axios.post(`/api/create-new-user`, data)
}

const getAllUsers = () => {
    return axios.get(`/api/get-all-users`)
}

const deleteUser = (data) => {
    console.log(data)
    return axios.delete(`/api/delete-user`, { data })
}

const updateUserByID = (data) => {
    return axios.post(`/api/update-user-by-id`, data)
}

// const postSendRemedy = (data) => {
//     return axios.post(`/api/send-remedy`, data);
// };

const loginAppBySocial = (data) => {
    return axios.post(`/api/create-user-by-social`, data)
}

const getDetailUser = (email) => {
    return axios.get(`/api/get-detail-user?email=${email}`)
}

const updateUserByEmail = (data) => {
    return axios.post(`/api/update-user-by-email`, data)
}

export default {
    login,
    createNewUser,
    getAllUsers,
    deleteUser,
    updateUserByID,
    loginAppBySocial,
    getDetailUser,
    updateUserByEmail,
}
