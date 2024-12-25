import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useState, useEffect} from 'react';
// import H_img from "../assets/h.png";
// import H_ex from "../assets/H_expan.png";
import baseURL from './../api/axios';

const Historical = () => {
  const navigation = useNavigation();
  const [usage, setUsage] = useState(0);
  const [avgPower, setAvgPower] = useState(0);

  const getData = async () => {
    try {
      const url = baseURL.defaults.baseURL + '/smartMeter';
      // const url = 'http://10.130.20.246:4000/api/v1/smartMeter';
      const data = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(data);
      const meterID = userData.meterID;
      const response = await axios.post(url, {
        meterID: meterID,
        s: '3600',
        n: '24',
        w: '1668970800',
      });
      const pairs = Object.entries(response.data.message[0]);
      let sum = 0;
      pairs.map((item, index) => {
        if (item[0] !== 'Date & Time') {
          sum += parseFloat(item[0]);
        }
      });
      // setUsage(sum.toFixed(2));
      // setAvgPower((sum / pairs.length).toFixed(2));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={{backgroundColor: '#fff', flex: 1, height: '100%'}}>
      <Text style={styles.cardLive}>Historical Load</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card1}>
          <View style={styles.container}>
            <Text style={styles.cardLive2}>Status</Text>
          </View>

          <View style={styles.container2}>
            <Text style={{color: 'black'}}>Energy</Text>
            <Text style={{color: 'black'}}>{usage} kWh (Units)</Text>
          </View>

          <View style={styles.container2}>
            <Text style={{color: 'black'}}>Avg Pwr</Text>
            <Text style={{color: 'black'}}>{avgPower} (Units/hour)</Text>
          </View>
          <View style={styles.container2}>
            <Text style={{color: 'black'}}>Min</Text>
            <Text style={{color: 'black'}}>0 kW</Text>
          </View>
          <View style={styles.container2}>
            <Text style={{color: 'black'}}>Max</Text>
            <Text style={{color: 'black'}}>3.24 kW</Text>
          </View>
        </View>
      </View>
      {/* <Image
      source={H_img}
      style={{ marginTop:30 ,marginLeft:47, width: 270, height: 150 }}
      // source = {H_ex}
      // style={{ marginTop:30 ,marginLeft:47, width: 20, height: 150 }}

    /> */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('heatmap')}>
        <View style={styles.buttonSecondaryContainer}>
          <Text style={styles.primaryText}>Heat Map</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black"/>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('historicalgraph')}>
        <View style={styles.buttonSecondaryContainer}>
          <Text style={styles.primaryText}>Historical Load Graph</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black"/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Historical;

const styles = StyleSheet.create({
  cardContainer: {
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    gap: 30,
    width: '100%',
    paddingLeft: 34,
    paddingRight: 34,
    marginTop: 30,
  },
  cardLive: {
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 24,
    marginTop: 20,
    marginLeft: 40,
    color: '#000000',
  },
  cardLive2: {
    fontWeight: 700,
    fontSize: 17,
    lineHeight: 24,
    marginTop: 10,
    color: '#000000',
  },
  card1: {
    height: 200,
    width: 300,

    backgroundColor: '#E8E8E8',
    borderRadius: 14,

    paddingLeft: 12,
    alignSelf: 'center',
  },

  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
    paddingBottom: 5,
    // paddingRight:20 ,
    gap: 75,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 110,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
    paddingBottom: 5,
    paddingRight: 10,
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
    // justifyContent: "center",
    padding: 0,
  },

  primaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
    color: '#000000',
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
  buttonContainer2: {
    backgroundColor: '#E8E8E8',
    height: 50,
    width: '37%',
    borderRadius: 10,
    marginLeft: 45,
    flexDirection: 'row',
    // elevation: 5,
    padding: 10,
    marginTop: 10,
    justifyContent: 'space-between',
  },
});
