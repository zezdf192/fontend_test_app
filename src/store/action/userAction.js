import { toast } from 'react-toastify'
import actionTypes from './actionTypes'
import userService from '../../service/userService'

export const fetchUserLogin = (data, check) => {
    return async (dispatch, getState) => {
        try {
            if (check === 'success') {
                dispatch({
                    type: actionTypes.USER_LOGIN_SUCCESS,
                    userInfo: data,
                })
                return
            }
            let res = await userService.login(data)
            //console.log(res.message)
            if (res && res.errCode === 0) {
                //toast.success(res.message)
                //toast.success('Save info doctor success');

                dispatch({
                    type: actionTypes.USER_LOGIN_SUCCESS,
                    userInfo: res.data,
                })
            } else {
                //toast.error(res.message)
                //toast.error('Save info doctor failed');
                dispatch({
                    type: actionTypes.USER_LOGIN_FAIL,
                })
            }
            return res
        } catch (error) {
            //toast.error('Save info doctor failed');
            // dispatch({
            //     type: actionTypes.USER_LOGIN_FAIL,
            // })
        }
    }
}

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            //console.log('create', data)
            let res = await userService.createNewUser(data)
            //console.log(res)
            let buildData = {
                email: data.email,
                name: data.name,
                password: true,
                listLikeExam: [],
                avatar: '',
                roleID: 'R2',
                amountCreate: 0,
                userExamID: [],
            }
            //console.log(res)
            if (res && res.errCode === 0) {
                //toast.success('')
                dispatch({
                    type: actionTypes.FETCH_USER_SIGNUP,
                    userInfo: buildData,
                })
            } else {
                //toast.error(res.message)
                // dispatch({
                //     type: actionTypes.USER_SIGNUP_FAIL,
                // })
            }
            return res
        } catch (error) {
            //toast.error(res.message)
            ////toast.error('Save info doctor failed');
            // dispatch({
            //     type: actionTypes.USER_LOGIN_FAIL,
            // })
        }
    }
}

export const fetchUserLoginWithSocial = (data) => {
    return async (dispatch, getState) => {
        try {
            let userInfo = {}
            let resUSer = await userService.getDetailUser(data._delegate.email ? data._delegate.email : data.email)
            let res = await userService.loginAppBySocial(data._delegate)

            if (res && res.errCode === 0) {
                userInfo = res.data
                if (resUSer && resUSer.errCode === 0) {
                    userInfo = { ...userInfo, name: resUSer.data[0].name, avatar: resUSer.data[0].avatar }
                }

                dispatch({
                    type: actionTypes.USER_LOGIN_WITH_SOCIAL_SUCCESS,
                    userInfo: userInfo,
                })
            } else {
                dispatch({
                    type: actionTypes.USER_LOGIN_FAIL,
                })
            }
        } catch (error) {
            //toast.error('Save info doctor failed');
            // dispatch({
            //     type: actionTypes.USER_LOGIN_FAIL,
            // })
        }
    }
}

export const fetchLogOut = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.LOG_OUT,
            })
        } catch (err) {
            dispatch({
                type: actionTypes.LOG_OUT,
            })
        }
    }
}

export const fetchUpdateUser = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.UPDATE_USER,
                userInfo: data,
            })
        } catch (err) {
            dispatch({
                type: actionTypes.UPDATE_USER,
                userInfo: data,
            })
        }
    }
}
