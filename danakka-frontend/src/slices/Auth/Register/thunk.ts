import { registerUserSuccessful, registerUserFailed } from "./reducer";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
    postFakeRegister,
    postJwtRegister,
} from "../../../helpers/fakebackend_helper";

export const registerUser = (user: any) => async (dispatch: any) => {
    try {
        let response;
        let fireBaseBackend = getFirebaseBackend();
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            response = fireBaseBackend.registerUser(
                user.email,
                user.password
            );
        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
            response = postJwtRegister('/post-jwt-register', user);

        } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
            response = postFakeRegister(user);
        }
        const data = await response;

        if (data) {
            dispatch(registerUserSuccessful(data));
        }

    } catch (error) {
        dispatch(registerUserFailed(error))
    }
};