import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from './../api/axios';

const Summary = () => {
  const navigation = useNavigation();
  const [usage, setUsage] = useState(0);
  const unitPrice = 13.25;
  const [dark, setDark] = useState(false);

  const getTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem('colortheme');
      if (theme === 'dark') {
        setDark(true);
      } else {
        setDark(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const url = baseURL.defaults.baseURL + '/smartMeter';
      // const url = 'http://10.130.20.246:4000/api/v1/smartMeter';
      const data = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(data);
      const meterID = userData.meterID;

      // test apk code
      const dummy = {
        _id: '64314a5e7997d244abdae11e',
        email: 'mrm@gmail.com',
        meterID: '39093',
        name: 'SE',
        referenceNumber: '08-11516-1069400-U',
        verified: true,
      };

      console.log(meterID);

      const response = await axios.post(url, {
        meterID: meterID,
        s: '3600',
        n: '24',
        w: '1668970800',
      });

      console.log(response.data.message[0]);

      const pairs = Object.entries(response.data.message[0]);
      let sum = 0;
      pairs.map((item, index) => {
        if (item[0] !== 'Date & Time') {
          sum += parseFloat(item[1]);
        }
      });
      setUsage(sum.toFixed(2));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  getTheme();

  return (
    <ScrollView
      style={[
        dark ? {backgroundColor: '#2D3741'} : {backgroundColor: '#fff'},
        {
          flex: 1,
          height: '100%',
        },
      ]}>
      <View style={styles.swap}>
        <Text style={styles.numerics}>Numerics</Text>
        <TouchableOpacity onPress={() => navigation.navigate('graphs')}>
          <Text style={styles.graph}>Graph</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card1}>
          <Text style={styles.cardPrice}>
            Rs. {(usage * unitPrice).toFixed(2)}
          </Text>
          <Text style={styles.tillToday}>Bill till today for Feb 2021</Text>
          <Text style={styles.units}>Units: 19</Text>
        </View>
        <View style={styles.card2}>
          <Text style={styles.cardPrice}>Rs. {unitPrice}/hour</Text>
          <Text style={styles.tillToday}>Cost Of Electricity</Text>
        </View>
        <View style={styles.card3}>
          <Text style={styles.cardPrice}>{usage} kW</Text>
          <Text style={styles.tillToday}>Current Usage</Text>
        </View>
      </View>
    </ScrollView>
  );
};
export default Summary;

const styles = StyleSheet.create({
  swap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  numerics: {
    backgroundColor: '#18BC9C',
    borderWidth: 1,
    borderColor: '#18BC9C',
    width: 126,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 24,
    color: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    elevation: 5,
    // j
  },
  graph: {
    color: '#18BC9C',
    borderWidth: 1,
    borderColor: '#18BC9C',
    width: 126,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 24,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
  },
  cardContainer: {
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    gap: 30,
    width: '100%',
    paddingLeft: 34,
    paddingRight: 34,
    marginTop: 54,
  },
  card1: {
    height: 128,
    width: 300,

    backgroundColor: '#0073B7',
    borderRadius: 14,

    paddingLeft: 13,
  },
  card2: {
    height: 128,
    width: 300,

    backgroundColor: '#DD4B39',
    borderRadius: 14,

    paddingLeft: 13,
  },
  card3: {
    height: 128,
    width: 300,

    backgroundColor: '#605CA8',
    borderRadius: 14,

    paddingLeft: 13,
  },
  cardPrice: {
    fontWeight: 700,
    fontSize: 28,
    lineHeight: 32,
    marginTop: 15,

    /* identical to box height, or 114% */

    color: '#FFFFFF',
  },
  tillToday: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 32,
    color: '#FFFFFF',
    marginTop: 8,
  },
  units: {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
});
