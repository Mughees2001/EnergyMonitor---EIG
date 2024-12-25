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
import {useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import Logo from '../assets/app_logo.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PasswordVisibility from '../components/PasswordVisibility';
import axios from 'axios';
import baseURL from './../api/axios';

const SignUp2 = ({route}) => {
  // Got Content From SignUp Page 1
  const {fullName, PhoneNumber, referenceNumber, meterID} = route.params;

  const [emailAddress, setEmailAddress] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    PasswordVisibility();
  const {SignUp2, handleSubmit, setValue} = useForm('');

  const navigation = useNavigation();

  const handleClick = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
      emailAddress.trim() === '' ||
      emailRegex.test(emailAddress) === false ||
      userName.trim() === '' ||
      password.trim() === '' ||
      passwordConfirm.trim() === ''
    ) {
      Alert.alert('Error', 'Please fill all the fields with correct format');
      return;
    }

    if (passwordConfirm === password) {
      try {
        const url = baseURL.defaults.baseURL + '/register';
        // const url = 'http://10.130.20.246:4000/api/v1/register';
        const response = await axios.post(url, {
          username: userName,
          name: fullName,
          email: emailAddress,
          phoneNumber: PhoneNumber,
          password: password,
          referenceNumber: referenceNumber,
          meterID: meterID,
        });
        navigation.navigate('signup3');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.Alert('Error', 'Passwords do not match');
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
          <Text style={{color: 'black'}}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="johndoe@example.com"
            placeholderTextColor="#ccc"
          />
        </View>

        <View>
          <Text style={{color: 'black'}}>Username</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="johndoe"
            placeholderTextColor="#ccc"
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
              label="Confirm Password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
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

        <TouchableOpacity
          style={styles.button1}
          onPress={handleSubmit(handleClick)}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'white'}}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SignUp2;

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
