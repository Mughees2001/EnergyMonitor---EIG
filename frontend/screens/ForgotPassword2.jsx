import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Logo from '../assets/app_logo.png';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import baseURL from './../api/axios';

const ForgotPassword2 = ({route}) => {
  const {emailAddress} = route.params;

  const navigation = useNavigation();
  const [OTP, setOTP] = useState('');
  const {Login, handleSubmit, setValue} = useForm('');

  const resubmitOTP = async () => {
    try {
      //const url = baseURL + "/RESEND OTP"; // Create Base URL later. // CHECK OTP
      // emailAddress (we know)
      // const response = await axios.post(url, {
      //   username: userName,
      //   password: password,
      // });
      // Alert.alert("Success", JSON.stringify(response.data.message));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const onSubmit = async () => {
    if (OTP.trim() === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    try {
      const url = baseURL.defaults.baseURL + '/verifyResetPasswordOTP';
      // const url = 'http://10.130.20.246:4000/api/v1/verifyResetPasswordOTP';
      const response = await axios.post(url, {
        otp: OTP,
      });
      console.log(response);
      navigation.navigate('forgotpassword3', {emailAddress});
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
      }}>
      <View style={styles.imageContainer}>
        <Image
          source={Logo}
          resizeMode="contain"
          style={{width: undefined, height: undefined, flex: 1}}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Forgot Password?</Text>

        <View>
          <Text style={{color: 'black'}}>Verify OTP sent to your email</Text>
          <TextInput
            style={styles.input}
            value={OTP}
            onChangeText={setOTP}
            placeholder="Enter Code Here"
            placeholderTextColor="#ccc"
          />
        </View>

        {/* {fullName:fullName,PhoneNumber:PhoneNumber,meterID:meterID} */}
        <TouchableOpacity
          style={styles.button1}
          onPress={handleSubmit(onSubmit)}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
            Continue
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row'}}>
          {/* In OnPress we need to resend code */}
          <TouchableOpacity onPress={{}}>
            <Text
              style={{
                color: '#24345F',
                height: 30,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                marginVertical: 10,
              }}>
              Send Code Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default ForgotPassword2;

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 50,
    backgroundColor: '#18BC9C',
    height: 130,
  },

  heading: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    height: 50,
    width: 300,
    borderRadius: 10,
    fontSize: 15,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'black',
  },

  button1: {
    backgroundColor: '#18BC9C',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 56,
    width: 180,
    margin: 20,
    elevation: 5,
  },
});
