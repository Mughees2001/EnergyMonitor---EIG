import { View, Text, SafeAreaView, Platform, StatusBar, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Logo from "../assets/app_logo.png";

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: "#fff", flex: 1, height:"100%" }}>
      <SafeAreaView>
        <View style={styles.imageContainer}>
          <Image source={Logo} resizeMode="contain" style={{ width: undefined, height: undefined, flex: 1 }} />
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.heading}>WELCOME</Text>
          <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate("login")}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "black" }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate("signup1")}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color:"#18BC9C" }}>Create An Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: 50,
  },
  imageContainer: {
    marginBottom: 50,
    backgroundColor: "#18BC9C",
    height: 130,
  },
  heading: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    color: "black",
  },
  button1: {
    backgroundColor: "#18BC9C",
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 50,
    width: 300,
    marginBottom: 20,
    elevation: 5,
  },
  button2: {
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 50,
    width: 300,
    borderColor: "#18BC9C",
    borderWidth: 1,
  },
});
