import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Logo from '../assets/app_logo.png';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import baseURL from './../api/axios';

const ForgotPassword1 = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const {Login, handleSubmit, setValue} = useForm('');
  const navigation = useNavigation();

  const handleClick = async () => {
    if (emailAddress.trim() === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    try {
      const url = baseURL.defaults.baseURL + '/forgotpassword';
      // const url = 'http://10.130.20.246:4000/api/v1/forgotpassword';
      const response = await axios.post(url, {
        email: emailAddress,
      });
      navigation.navigate('forgotpassword2', {emailAddress});
      // Alert.alert("Success", JSON.stringify(response.data.message));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1, height: '100%'}}>
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
          <Text style={{color: 'black'}}>Email Address</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="abc@example.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholderTextColor="#ccc"
            />
          </View>
        </View>
        {/* {fullName:fullName,PhoneNumber:PhoneNumber,meterID:meterID} */}
        <TouchableOpacity
          style={styles.button1}
          onPress={handleSubmit(handleClick)}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
            {' '}
            Continue{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword1;

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
