//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

// action
import {
    apiError, 
    loginSuccess
} from "./reducer";

import {
    postFakeLogin,
    postJwtLogin,
    postSocialLogin,
} from "../../../helpers/fakebackend_helper";

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
    try {
        let response;
        let fireBaseBackend = getFirebaseBackend();
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {

            response = fireBaseBackend.loginUser(
                user.email,
                user.password
            );

        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {

            response = postJwtLogin({
                email: user.email,
                password: user.password
            });

        } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
            response = postFakeLogin({
                email: user.email,
                password: user.password,
            });
        }

        const data = await response;

        if (data) {
            localStorage.setItem("authUser", JSON.stringify(data));
            dispatch(loginSuccess(data));
            history("/sales");
        }
    } catch (error) {
        dispatch(apiError(error));
    }
};

export const socialLogin = (data: any, history: any, type: any) => async (dispatch: any) => {
    try {
        let response;
        
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {

            let fireBaseBackend = getFirebaseBackend();

            response = fireBaseBackend.socialLoginUser(
                data,
                type
            );

        } else {
            response = postSocialLogin(data);
        }

        const socialdata = await response;

        if (socialdata) {
            localStorage.setItem("authUser", JSON.stringify(socialdata));
            dispatch(loginSuccess(socialdata));
            history("/sales");
        }

    } catch (error) {
        dispatch(apiError(error));
    }
};

export const logoutUser = (history: any) => async (dispatch: any) => {
    try {
        localStorage.removeItem("authUser");
        history("/login");
    } catch (error) {
        dispatch(apiError(error));
    }
};