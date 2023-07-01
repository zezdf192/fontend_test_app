import actionTypes from '../action/actionTypes'

const initialState = {
    isLoggedIn: false,
    userInfo: null,
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo,
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
            }
        case actionTypes.USER_LOGIN_WITH_SOCIAL_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo,
            }
        case actionTypes.USER_LOGIN_WITH_SOCIAL_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
            }
        case actionTypes.LOG_OUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
            }
        case actionTypes.UPDATE_USER:
            return {
                ...state,
                userInfo: action.userInfo,
            }
        default:
            return state
    }
}

export default userReducer
