import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess, authFail } from "../../store/reducers/auth/authSlice";
import auth from "@react-native-firebase/auth";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { COMETCHAT_CONSTANTS } from "../../CONSTS";

import { loginUser } from "../../store/reducers/auth/authAction";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const windowWidth = Dimensions.get("window").width;

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: COMETCHAT_CONSTANTS.FIREBASE_WEB_CLIENTID,
      prompt: "select_account",
    });
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { user, isLoggedIn, error, loading } = useSelector(
    (state) => state.auth
  );

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      // Sign in with Google
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Get user details from Google
      const { idToken } = userInfo;

      // Sign in to Firebase with Google credentials
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      // Now, log in the user to CometChat
      const firebaseUser = auth().currentUser;

      if (firebaseUser) {
        const firebaseUID = firebaseUser.uid;
        console.log(firebaseUID);

        CometChat.login(firebaseUID, COMETCHAT_CONSTANTS.AUTH_KEY).then(
          (loggedInUser) => {
            console.log("Logged in to CometChat:", loggedInUser);
            navigation.replace("Home");
            setLoadingGoogle(false);

            // You can navigate to the next screen or perform any other actions upon successful login.
          },
          (error) => {
            setLoadingGoogle(false);

            console.error("Error logging in to CometChat:", error);

            // Handle CometChat login errors appropriately
          }
        );
      } else {
        console.error("Firebase user is null");
        // Handle the case where the Firebase user is null.
      }
    } catch (error) {
      setLoadingGoogle(false);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Handle the case where the user cancels the Google Sign-In process.
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Handle the case where Google Sign-In is already in progress.
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Handle the case where Play Services are not available on the device.
      } else {
        setLoadingGoogle(false);

        console.error("Google Sign-In error:", error);

        // Handle other Google Sign-In errors appropriately
      }
    }
  };

  const handleEmailLogin = () => {
    if (email && password) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User signed in:", user.email);

          // Now, log in the user to CometChat
          const firebaseUID = user.uid;
          const cometChatUser = new CometChat.User(firebaseUID);
          cometChatUser.setName(user.displayName || ""); // Set the name as needed
          navigation.replace("Home");

          // Log in the user to CometChat
          CometChat.login(cometChatUser, COMETCHAT_CONSTANTS.AUTH_KEY).then(
            (loggedInUser) => {
              console.log("Logged in to CometChat:", loggedInUser);
            },
            (error) => {
              console.error("Error logging in to CometChat:", error);

              // Handle CometChat login errors appropriately
            }
          );
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Email login error:", errorMessage);

          // Handle Firebase email login errors appropriately
        });
    } else {
      // Handle the case where email or password is missing.
      // You can display an error message to the user.
    }
  };

  const handleLogin = useCallback(async () => {
    // setError(null);
    // setLoading(true);
    // try {
    //   const userCredential = await auth().signInWithEmailAndPassword(
    //     email,
    //     password,
    //   );
    //   const firebaseUser = userCredential.user;
    //   const firebaseUID = firebaseUser.uid;
    //   console.log(firebaseUser, firebaseUID, 'Firebase Hello');
    // } catch (error) {
    //   console.log(error);
    //   if (error.message) setError('Email or Password is incorrect');
    // } finally {
    //   setLoading(false);
    // }
    dispatch(loginUser(email, password));
  }, [dispatch, email, password]);

  useEffect(() => {
    if (isLoggedIn === true) {
      navigation.replace("Home");
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          paddingHorizontal: 30,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#333",
            justifyContent: "center",
            alignItems: "center",
            width: 35,
            height: 35,
            borderRadius: 50,
          }}
          onPress={() => navigation.replace("HeroScreen")}
        >
          <Icon
            name="arrow-back-ios"
            size={20}
            color="#E51D43"
            style={{ paddingLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Image
          source={require("../../assets/icons/SM-logo-bg-removed.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
          Hello Again!
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#969BA1" }}>
          Welcome back you've
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#969BA1" }}>
          been missed!
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#969BA1"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              showPassword ? styles.borderActive : styles.borderInactive,
            ]}
            placeholder="Password"
            placeholderTextColor="#969BA1"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
          >
            <Icon
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotPasswordLink}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E51D43" />
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.7}
          disabled={!email || !password}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {loadingGoogle ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#E51D43" />
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.googleLoginButton}
        onPress={handleGoogleLogin}
        disabled={loadingGoogle}
      >
        <Image
          source={require("../../assets/icons/Google_Icons.webp")}
          style={{ width: 30, height: 30 }}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>
          {error === "No user found" ? "" : "Email or Password not correct"}
        </Text>
      )}
      <View style={{ flex: 1 }} />
      <View style={styles.signUpLink}>
        <Text style={{ fontSize: 12, color: "#969BA1" }}>Not a member?</Text>
        <TouchableOpacity onPress={() => navigation.push("SignUp")}>
          <Text style={styles.linkText}> Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 50,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 130,
    height: 70,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#969BA1",
    padding: 10,
    marginBottom: 10,
    color: "white",
    borderRadius: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#969BA1",
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    color: "white",
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#E51D43",
  },
  borderActive: {
    borderColor: "blue",
  },
  borderInactive: {
    borderColor: "black",
  },
  errorText: {
    paddingVertical: 20,
    color: "#E51D43",
  },
  loginButton: {
    backgroundColor: "#E51D43",
    padding: 10,
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#E51D43",
  },
  signUpLink: {
    marginTop: 20,
    flexDirection: "row",
  },
  linkText: {
    color: "#E51D43",
    fontSize: 12,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "80%",
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  orText: {
    paddingHorizontal: 10,
    color: "white",
  },
  googleLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 12,
    width: "90%",
    marginTop: 10,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: "white",
    fontWeight: "500",
  },
  signUpLink: {
    marginTop: 20,
    flexDirection: "row",
  },
  linkText: {
    color: "#E51D43",
    fontSize: 12,
  },
});
