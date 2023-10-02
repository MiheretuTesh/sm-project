import {
  setLoading,
  authStart,
  authFail,
  authSuccess,
  logoutSuccess,
} from "../auth/authSlice";
import auth from "@react-native-firebase/auth";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { COMETCHAT_CONSTANTS } from "../../../CONSTS";
import { CometChatUIKit } from "@cometchat/chat-uikit-react-native";

export const authCheckState = () => {
  return async (dispatch) => {
    try {
      const loggedInUser = await CometChat.getLoggedinUser();
      if (loggedInUser) {
        dispatch(authSuccess(loggedInUser));
      } else {
        dispatch(authFail("No user found"));
      }
    } catch (error) {
      console.error("Error checking CometChat user state:", error);
      dispatch(authFail("Error checking CometChat user state"));
    }
  };
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(authStart());

    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const firebaseUID = firebaseUser.uid;
    // const firebaseUID = firebaseUser.uid;

    // Loggin a CometChat user
    const cometChatUser = CometChatUIKit.login(
      firebaseUID,
      COMETCHAT_AUTHID
    ).then(
      (user) => {
        console.log("Login Successful:", { user });
      },
      (error) => {
        console.log("Login failed with exception:", { error });
      }
    );

    //console.log(firebaseUser, 'firebaseUser firebaseUser firebaseUser');

    dispatch(authSuccess(firebaseUser));
  } catch (error) {
    console.error("Error signing up with Firebase:", error);
    dispatch(authFail("Error signing up with Firebase"));
  }
};

export const signUp = (email, password) => async (dispatch) => {
  try {
    console.log(email, password, "Hello");
    dispatch(authStart());

    //Create a Firebase user
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const firebaseUID = firebaseUser.uid;

    // Create a CometChat user
    const cometChatUser = new CometChat.User(firebaseUID);
    cometChatUser.setName(firebaseUser.displayName || "User One");

    // Create the CometChat user using Promises
    const createdUser = await CometChat.createUser(
      cometChatUser,
      COMETCHAT_CONSTANTS.AUTH_KEY
    );

    // Dispatch success action
    dispatch(authSuccess(firebaseUser));
  } catch (error) {
    console.error("Error signing up with Firebase:", error);
    dispatch(authFail("Error signing up with Firebase"));
  }
};

export const logout = () => {
  return (dispatch) => {
    CometChat.logout().then(() => {
      dispatch(logoutSuccess());
    });
  };
};
