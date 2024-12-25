import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
} from 'react-native';
import {Alert} from 'react-native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import Logo from '../assets/app_logo.png';
import PasswordVisibility from '../components/PasswordVisibility';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import baseURL from './../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    PasswordVisibility();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const {Login, handleSubmit, setValue} = useForm('');

  const onSubmit = async () => {
    if (userName.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    try {
      const url = baseURL.defaults.baseURL + '/login';
      const response = await axios.post(url, {
        username: userName,
        password: password,
      });
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify(response.data.user),
      );
      navigation.navigate('drawer');
    } catch (error) {
      Alert.alert('Error', error.message);
    }

    // test apk code
    // const dummy = {
    //   _id: '64314a5e7997d244abdae11e',
    //   email: 'mrm@gmail.com',
    //   meterID: '39093',
    //   name: 'SE',
    //   referenceNumber: '08-11516-1069400-U',
    //   verified: true,
    // };

    // await AsyncStorage.setItem('userData', JSON.stringify(dummy));
    // navigation.navigate('drawer');
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
        <Text style={styles.heading}>LOGIN</Text>

        <View>
          <Text style={{color: 'black'}}>Username</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Username"
            placeholderTextColor="#ccc"
            required
          />
        </View>

        <View>
          <Text style={{color: 'black'}}>Password</Text>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#1E1E1E',
              height: 50,
              width: 300,
              borderRadius: 10,
              marginBottom: 12,
              justifyContent: 'space-between',
              color: 'black',
            }}>
            <TextInput
              label="Password"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#ccc"
              secureTextEntry={passwordVisibility}
              style={{padding: 12, fontSize: 15, color: 'black', width: '80%'}}
            />
            <Pressable onPress={handlePasswordVisibility} style={{padding: 10}}>
              <MaterialCommunityIcons
                name={rightIcon}
                size={24}
                color="black"
              />
            </Pressable>
          </View>
        </View>

        <TouchableOpacity>
          <Text
            style={{
              color: '#24345F',
              height: 30,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
              margin: 10,
            }}
            onPress={() => navigation.navigate('forgotpassword1')}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!password}
          style={styles.button1}
          onPress={handleSubmit(onSubmit)}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
            Login
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: '#000',
              height: 30,
              marginHorizontal: 5,
              marginVertical: 10,
            }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signup1')}>
            <Text
              style={{
                color: '#24345F',
                height: 30,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                marginVertical: 10,
              }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

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
    marginBottom: 20,
    elevation: 5,
  },
});
