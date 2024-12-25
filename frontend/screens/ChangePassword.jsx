import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import PasswordVisibility from '../components/PasswordVisibility';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import baseURL from './../api/axios';

const ChangePassword = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    PasswordVisibility();
  const {changePassword, handleSubmit, setValue} = useForm('');

  const onSubmit = async () => {
    if (password.trim() === '' || newPassword.trim() === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    try {
      const url = baseURL.defaults.baseURL + '/changepassword';
      // const url = 'http://10.130.20.246:4000/api/v1/changepassword';
      const response = await axios.put(url, {
        currentPassword: password,
        newPassword: newPassword,
      });
      Alert.alert('Success', JSON.stringify(response.data.message));
      console.log(response.data);
      navigation.navigate('setting1');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={{color: 'black'}}
          label="Password"
          value={password}
          placeholder="Enter Here"
          onChangeText={setPassword}
          placeholderTextColor="#ccc"
          secureTextEntry={true}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput
            style={{width: '90%', color: 'black'}}
            label="Password"
            value={newPassword}
            placeholder="Enter Here"
            onChangeText={setNewPassword}
            placeholderTextColor="#ccc"
            secureTextEntry={passwordVisibility}
          />
          <Pressable onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons name={rightIcon} size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <TouchableOpacity style={styles.button1} onPress={handleSubmit(onSubmit)}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
          Update Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 40,
    borderBottomColor: '#6A6666',
    borderBottomWidth: 1,
  },
  label: {
    color: '#6A6666',
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
    marginTop: 40,
    alignSelf: 'center',
  },
});
