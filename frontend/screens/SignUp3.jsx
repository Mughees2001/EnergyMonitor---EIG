import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Logo from '../assets/app_logo.png';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import baseURL from './../api/axios';

const SignUp3 = () => {
  const [OTP, setOTP] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const {SignUp3, handleSubmit, setValue} = useForm('');
  const navigation = useNavigation();

  const onSubmit = async () => {
    try {
      const url = baseURL.defaults.baseURL + '/verify';
      // const url = 'http://10.130.20.246:4000/api/v1/verify';
      const response = await axios.post(url, {otp: OTP});
      if (response.data.success === true) {
        navigation.navigate('signup4');
      } else {
        Alert.alert('Incorrect OTP...');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        height: '100%',
      }}>
      <View style={styles.imageContainer}>
        <Image
          source={Logo}
          resizeMode="contain"
          style={{width: undefined, height: undefined, flex: 1}}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>SIGN UP</Text>

        <View>
          <Text style={{color: 'black'}}>Verify OTP sent to +923xxxxxxx</Text>
          <TextInput
            style={styles.input}
            value={OTP}
            onChangeText={setOTP}
            placeholder="Enter Code Here"
            placeholderTextColor="#ccc"
          />
        </View>

        <TouchableOpacity
          style={styles.button1}
          onPress={handleSubmit(onSubmit)}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
            {' '}
            Continue{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SignUp3;

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
    color: '#1E1E1E',
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
    color: '#1E1E1E',
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
