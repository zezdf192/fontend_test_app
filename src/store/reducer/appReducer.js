import actionTypes from '../action/actionTypes'

const initialState = {
    language: 'en',
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.payload,
            }

        default:
            return state
    }
}

export default appReducer
