import { toast } from 'react-toastify'
import actionTypes from './actionTypes'
import userService from '../../service/userService'

export const changeLanguage = (language) => ({
    type: actionTypes.CHANGE_LANGUAGE,
    payload: language,
})
