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
import React, {useState} from 'react';
import Logo from '../assets/app_logo.png';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useForm} from 'react-hook-form';
import PasswordVisibility from '../components/PasswordVisibility';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import baseURL from './../api/axios';

const ForgotPassword3 = ({route}) => {
  const {emailAddress} = route.params;
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    PasswordVisibility();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const {Login, handleSubmit, setValue} = useForm('');

  const navigation = useNavigation();

  const onSubmit = async () => {
    if (password.trim() === '' || passwordConfirm.trim() === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    if (passwordConfirm === password) {
      try {
        const url = baseURL.defaults.baseURL + '/resetpassword';
        // const url = 'http://10.130.20.246:4000/api/v1/resetpassword';
        const response = await axios.put(url, {
          email: emailAddress,
          newPassword: password,
        });
        const success = true;
        if (success === true) {
          navigation.navigate('forgotpassword4');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('Error', 'Passwords do not match');
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
        <Text style={styles.heading}>Change Password</Text>

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

        <View>
          <Text style={{color: 'black'}}>Confirm Password</Text>
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
              style={{padding: 12, fontSize: 15, color: 'black', width: '80%'}}
              label="Confirm Password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              placeholderTextColor="#ccc"
              secureTextEntry={passwordVisibility}
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

        <TouchableOpacity
          style={styles.button1}
          onPress={handleSubmit(onSubmit)}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
            {' '}
            Set Password{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ForgotPassword3;

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
