import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignal from 'react-native-onesignal';

const Settings = () => {
  const navigation = useNavigation();

  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(() => {
    const theme = AsyncStorage.getItem('colortheme');
    return theme === 'dark' ? true : false;
  });
  const [isEnabled3, setIsEnabled3] = useState(false);

  const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
  const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
  const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);
  const [dark, setDark] = useState(false);

  const toggleNotifications = async () => {
    setIsEnabled1(previousState => !previousState);
    if (isEnabled1) {
      // Disable notifications
      console.log('disabled')
      OneSignal.disablePush(true);
    } else {
      // Enable notifications
      console.log('enabled')
      OneSignal.disablePush(false);
    }
  };

  const darkMode = async () => {
    if (isEnabled2) {
      await AsyncStorage.setItem('colortheme', 'dark');
      setDark(true);

    } else {
      await AsyncStorage.setItem('colortheme', 'light');
      setDark(false);
    }
    const theme = await AsyncStorage.getItem('colortheme');
  };

  useEffect(() => {
    darkMode();
  }, [isEnabled2]);

  return (
    <View style={[
      dark ? {backgroundColor: '#2D3741'} : {backgroundColor: '#fff'},
    ]}>
      <View style={styles.cardContainer}>
        <View style={styles.secondaryContainer}>
          <Text style={styles.primaryText}>Notifications</Text>
          <Text style={styles.secondaryText}>Toggle Notifications On/Off</Text>
        </View>
        <Switch
          trackColor={{false: '#929598', true: '#82D7C6'}}
          thumbColor={isEnabled1 ? '#18BC9C' : '#B4D0CB'}
          onValueChange={toggleNotifications}
          value={isEnabled1}
        />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.secondaryContainer}>
          <Text style={styles.primaryText}>Use Dark Mode</Text>
          <Text style={styles.secondaryText}>Toggle Dark Mode On/off</Text>
        </View>
        <Switch
          trackColor={{false: '#929598', true: '#82D7C6'}}
          thumbColor={isEnabled2 ? '#18BC9C' : '#B4D0CB'}
          onValueChange={toggleSwitch2}
          value={isEnabled2}
        />
      </View>

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => navigation.navigate('changeprofile')}>
        <View style={styles.secondaryContainer}>
          <Text style={styles.primaryText}>Update Profile</Text>
          <Text style={styles.secondaryText}>Add or Change Profile Pic</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => navigation.navigate('changepassword')}>
        <View style={styles.secondaryContainer}>
          <Text style={styles.primaryText}>Change Password</Text>
          <Text style={styles.secondaryText}>Set New Password</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black" />
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => {
          Linking.openURL('tel:03404250321');
        }}
        style={styles.cardContainer}>
        <View style={styles.secondaryContainer}>
          <Text style={styles.primaryText}>Contact Helpline</Text>
          <Text style={styles.secondaryText}>
            Our support team will guide you
          </Text>
        </View>
        <View style={styles.icon}>
          <Icon name="call" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </View>

  );
};

export default Settings;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#E8E8E8',
    height: 70,
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    elevation: 5,
    padding: 10,
    marginTop: 20,
    justifyContent: 'space-between',
    
  },
  secondaryContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  primaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 4,
    color: '#000',
  },
  secondaryText: {
    fontSize: 12,
    paddingHorizontal: 4,
    color: '#A9A9A9',
  },
  icon: {
    justifyContent: 'center',
    padding: 4,
  },
});
