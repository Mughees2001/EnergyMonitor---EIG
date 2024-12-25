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
import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './../api/axios';

const ChangeProfile = () => {
  const [oldname, setOldName] = useState('');
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [meterID, setMeterID] = useState('');
  const {updateProfile, handleSubmit, setval} = useForm('');

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setOldName('Current Name: ' + user.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateName = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Please enter a new name');
      return;
    }
    try {
      const url = baseURL.defaults.baseURL + '/changeName';
      // const url = 'http://10.130.20.246:4000/api/v1/changeName';
      const response = await axios.put(url, {
        newName: name,
      });
      const currentValue = await AsyncStorage.getItem('userData');
      console.log('current value is:', currentValue);
      const newValue = JSON.parse(currentValue);
      newValue.name = name;
      await AsyncStorage.setItem('userData', JSON.stringify(newValue));
      console.log('new value is:', newValue);

      Alert.alert('Success', JSON.stringify(response.data.message));
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateReference = async () => {
    const referenceNumberRegex = /^[0-9]{2}-[0-9]{5}-[0-9]{7}-(R|U)$/;
    if (reference.trim() === '' || !referenceNumberRegex.test(reference)) {
      Alert.alert('Error', 'Please enter a valid Reference Number');
      return;
    }
    try {
      const url = baseURL.defaults.baseURL + '/changeReferenceNumber';
      // const url = 'http://10.130.20.246:4000/api/v1/changeReferenceNumber';
      const response = await axios.put(url, {
        newReferenceNumber: reference,
      });
      Alert.alert('Success', JSON.stringify(response.data.message));
      const currentValue = await AsyncStorage.getItem('userData');
      const newValue = JSON.parse(currentValue);
      newValue.newReferenceNumber = reference;
      await AsyncStorage.setItem('userData', JSON.stringify(newValue));
      console.log('new value is:', newValue);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateID = async () => {
    const meterIDRegex = /^[0-9]{5}$/;
    if (meterID.trim() === '' || !meterIDRegex.test(meterID)) {
      Alert.alert('Error', 'Please enter a valid smeter ID');
      return;
    }
    try {
      const url = baseURL.defaults.baseURL + '/changeMeterID';
      // const url = 'http://10.130.20.246:4000/api/v1/changeMeterID';
      const response = await axios.put(url, {
        newMeterID: meterID,
      });
      const currentValue = await AsyncStorage.getItem('userData');
      console.log('current value is:', currentValue);
      const newValue = JSON.parse(currentValue);
      newValue.meterID = meterID;
      await AsyncStorage.setItem('userData', JSON.stringify(newValue));
      console.log('new value is:', newValue);
      Alert.alert('Success', JSON.stringify(response.data.message));
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Full Name</Text>
        <TextInput
          style={{color: 'black'}}
          label="Name"
          value={name}
          placeholder={oldname}
          onChangeText={setName}
          placeholderTextColor="#ccc"
        />
      </View>

      <TouchableOpacity style={styles.button1}>
        <Text
          style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}
          onPress={handleSubmit(updateName)}>
          Update Name
        </Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Reference Number</Text>
        <TextInput
          style={{color: 'black'}}
          label="Name"
          value={reference}
          placeholder="xx-xxxxx-xxxxxxx-R/U"
          onChangeText={setReference}
          placeholderTextColor="#ccc"
        />
      </View>

      <TouchableOpacity style={styles.button1}>
        <Text
          style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}
          onPress={handleSubmit(updateReference)}>
          Update Number
        </Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Smart Meter ID</Text>
        <TextInput
          style={{color: 'black'}}
          label="Name"
          value={meterID}
          onChangeText={setMeterID}
          placeholder="xxxxx"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button1}>
        <Text
          style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}
          onPress={handleSubmit(updateID)}>
          Update Meter ID
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeProfile;

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
    height: 40,
    width: 150,
    marginBottom: 20,
    elevation: 5,
    marginTop: 40,
    alignSelf: 'center',
  },
});
