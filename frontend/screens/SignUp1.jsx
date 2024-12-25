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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUp1 = () => {
  const [fullName, setfullName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [meterID, setmeterID] = useState('');
  const [referenceNumber, setreferenceNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const onSubmit = () => {
    const phoneNumberRegex = /^03[0-9]{9}$/;
    const referenceNumberRegex = /^[0-9]{2}-[0-9]{5}-[0-9]{7}-(R|U)$/;
    const meterIDRegex = /^[0-9]{5}$/;

    if (
      fullName.trim() === '' ||
      PhoneNumber.trim() === '' ||
      phoneNumberRegex.test(PhoneNumber) === false ||
      meterID.trim() === '' ||
      meterIDRegex.test(meterID) === false ||
      referenceNumber.trim() === '' ||
      referenceNumberRegex.test(referenceNumber) === false
    ) {
      Alert.alert('Error', 'Please fill all the fields with correct format');
      return;
    } else {
      navigation.navigate('signup2', {
        fullName,
        PhoneNumber,
        referenceNumber,
        meterID,
      });
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
        <Text style={styles.heading}>SIGN UP</Text>

        <View>
          <Text style={{color: 'black'}}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setfullName}
            placeholder="Your Full Name"
            placeholderTextColor="#ccc"
          />
        </View>

        <View>
          <Text style={{color: 'black'}}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={PhoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="03xxxxxxxxx"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text style={{color: 'black'}}>Reference Number</Text>
          <TextInput
            style={styles.input}
            value={referenceNumber}
            onChangeText={setreferenceNumber}
            placeholder="xx-xxxxx-xxxxxxx-R/U"
            placeholderTextColor="#ccc"
          />
        </View>

        <View>
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{color: 'black'}}>
                  This is your LESCO meter ID
                </Text>
                <Icon
                  name="close"
                  size={16}
                  color="#18BC9C"
                  onPress={() => setModalVisible(!modalVisible)}
                  style={{marginTop: 10}}
                />
              </View>
            </View>
          </Modal>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'black'}}>Smart meter ID</Text>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <MaterialCommunityIcons
                style={{paddingHorizontal: 5}}
                name="information"
                size={16}
                color="black"
              />
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            value={meterID}
            onChangeText={setmeterID}
            placeholder="xxxxx"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
          />
        </View>
        {/* {fullName:fullName,PhoneNumber:PhoneNumber,meterID:meterID} */}
        <TouchableOpacity style={styles.button1} onPress={onSubmit}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp1;

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    flexDirection: 'column',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
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
