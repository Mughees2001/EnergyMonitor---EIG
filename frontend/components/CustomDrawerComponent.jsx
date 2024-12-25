import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/app_logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import baseURL from './../api/axios';

const CustomDrawerComponent = props => {
  const [name, setName] = useState('');
  const {logout, handleSubmit, setValue} = useForm('');

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setName(user.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const url = baseURL.defaults.baseURL + '/logout';
      // const url =  "http://10.130.20.246:4000/api/v1/logout";
      const response = await axios.get(url);
      console.log(response.data.message);
      removeToken();
      props.navigation.navigate('home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={{color: 'white', fontSize: 20, paddingHorizontal: 12}}>
          {name}
        </Text>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          labelStyle={{color: 'white', fontSize: 14}}
          icon={() => <Icon name="log-out-outline" size={24} color="white" />}
          onPress={handleSubmit(handleLogout)}
        />
      </DrawerContentScrollView>

      <View
        style={{
          backgroundColor: '#18BC9C',
          height: 50,
          width: 160,
          marginLeft: 40,
          marginBottom: 50,
          borderRadius: 10,
        }}>
        <Image
          source={Logo}
          resizeMode="contain"
          style={{width: undefined, height: undefined, flex: 1}}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerComponent;

const styles = StyleSheet.create({
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  container: {
    backgroundColor: '#2D3741',
    flex: 1,
    height: '100%',
  },
  userInfo: {
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
  },
});
