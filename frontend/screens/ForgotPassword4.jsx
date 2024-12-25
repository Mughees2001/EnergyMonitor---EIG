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
} from 'react-native';

import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import TickLogo from './TickLogo.jpeg';

const ForgotPassword4 = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
      }}>
      <View style={styles.imageContainer}>
        <Image source={TickLogo} style={styles.imageLogo} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>WE'RE ALL</Text>
        <Text style={styles.heading}>GOOD!</Text>
        <Text style={styles.heading2}>Password reset has been successful</Text>

        <TouchableOpacity
          style={styles.button1}
          onPress={() => navigation.navigate('login')}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
            {' '}
            OK{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ForgotPassword4;

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14%',
    height: 120,
  },
  imageLogo: {
    borderRadius: 100,
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 8,
    paddingRight: 8,
  },

  heading: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 400,
    color: '#151E35',
  },
  heading2: {
    marginTop: 15,
    color: '#A9A9A9',
    fontWeight: 700,
    textAlign: 'center',
    marginTop: '10%',
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  button1: {
    backgroundColor: '#18BC9C',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 56,
    width: 180,
    marginTop: '10%',
    elevation: 5,
  },
});
