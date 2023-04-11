//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"

// action
import {
    profileSuccess, profileError
} from "./reducer";

import {
    postFakeProfile,
    postJwtProfile,
} from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

export const editProfile = (user: any) => async (dispatch: any) => {
    try {
        let response;

        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            response = fireBaseBackend.editProfileAPI(
                user.username,
                user.idx
            )

        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {

            response = postJwtProfile(
                {
                    username: user.username,
                    idx: user.idx,
                }
            )

        } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
            response = postFakeProfile(
                {
                    username: user.username,
                    idx: user.idx,
                }
            )
        }

        const data = await response;

        if (data) {
            dispatch(profileSuccess(data))
        }

    } catch (error) {
        dispatch(profileError(error))
    }
};

export const resetProfileFlag = (user: any) => async (dispatch: any) => {

}