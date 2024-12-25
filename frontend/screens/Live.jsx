import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useState, useEffect} from 'react';
import baseURL from './../api/axios';

const Live = () => {
  const navigation = useNavigation();
  const [pairs, setPairs] = useState([[]]);

  const getData = async () => {
    try {
      const url = baseURL.defaults.baseURL + '/smartMeter';
      const data = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(data);
      const meterID = userData.meterID;
      const response = await axios.post(url, {
        meterID: meterID,
        s: '3600',
        n: '24',
        w: '1668970800',
      });
      // console.log(response.data.message);
      if (response.data.message && response.data.message.length > 0) {
        setPairs(Object.entries(response.data.message[0]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // getData();

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        height: '100%',
      }}>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: '#E8E8E8',
          marginHorizontal: 16,
          marginTop: 20,
          paddingHorizontal: 5,
        }}>
        <Text style={styles.cardLive}>Live Load Update</Text>

        <View style={styles.container}>
          <Text style={styles.cardLive2}>Component</Text>
          <Text style={styles.cardLive2}>Power[KWh]</Text>
        </View>

        {pairs.length > 0 ? (
          <ScrollView style={styles.container2}>
            {pairs.map((item, index) =>
              item[0] && item[0] !== 'Date & Time' ? (
                <View key={index} style={styles.row}>
                  <Text style={{color: 'black'}}>
                    {item[0].replace(' [kW]', '')}
                  </Text>
                  <Text style={{color: 'black'}}>{item[1]}</Text>
                </View>
              ) : (
                <View key={index}></View>
              ),
            )}
          </ScrollView>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('ctshare')}>
        <View style={styles.buttonSecondaryContainer}>
          <Text style={styles.primaryText}>Sub CT Share</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('loadprofile')}>
        <View style={styles.buttonSecondaryContainer}>
          <Text style={styles.primaryText}>Live Load Profile</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Live;

const styles = StyleSheet.create({
  cardContainer: {
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    gap: 30,
    width: '100%',
    paddingLeft: 34,
    paddingRight: 34,
    marginTop: 20,
  },
  cardLive: {
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 24,
    marginTop: 10,
    color: '#000',
    paddingHorizontal: 10,
  },
  cardLive2: {
    fontWeight: 700,
    fontSize: 17,
    lineHeight: 24,
    marginTop: 10,
    color: '#000',
  },
  card1: {
    height: 340,
    width: 300,

    backgroundColor: '#E8E8E8',
    borderRadius: 14,

    paddingLeft: 12,
    alignSelf: 'center',
  },

  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
    paddingBottom: 5,
    paddingHorizontal: 10,
    gap: 75,
  },
  container2: {
    borderBottomColor: '#A9A9A9',
    paddingBottom: 10,
    height: 300,
    paddingHorizontal: 10,
  },
  buttonSecondaryContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10, // adjust this value to give space between text and line
  },
  icon: {
    justifyContent: 'center',
    padding: 4,
  },

  primaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
    color: '#000',
  },
  buttonContainer: {
    backgroundColor: '#E8E8E8',
    height: 50,
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    elevation: 5,
    padding: 10,
    marginTop: 30,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
