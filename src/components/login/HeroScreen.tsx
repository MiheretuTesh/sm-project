import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const HeroScreen = React.memo(({ navigation }: any) => {
  const { user, isLoggedIn, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn === true) {
      console.log(isLoggedIn, "I'm True");
      navigation.replace("HomeScreen");
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/icons/SM-logo-bg-removed.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.push("Login")}
        >
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.push("SignUp")}
        >
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  imageContainer: {
    flex: 1,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: windowWidth * 0.8,
    height: undefined,
    aspectRatio: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#333",
    paddingHorizontal: 0.08 * windowWidth,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 0.02 * windowWidth,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "#E51D43",
    paddingHorizontal: 0.06 * windowWidth,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 0.02 * windowWidth,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  loginButtonText: {
    color: "#E51D43",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  signUpButtonText: {
    color: "#333",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default HeroScreen;
