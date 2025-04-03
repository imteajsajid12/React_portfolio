import {createSclice} from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    user: null,
    token: null,
    status: null
}

const authSclice = createSclice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.isAuth = true
            state.status = true
            state.user = action.payload.user
            state.token = action.payload.token
        },
        logout(state) {
            state.isAuth = false
            state.status = false
            state.user = null
            state.token = null
        },
        setStatus(state, action) {
            state.status = action.payload

        }
    }
})


export const {login, logout, setStatus} = authSclice.actions

export default authSclice.reducer