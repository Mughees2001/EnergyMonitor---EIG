import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  StatusBar,
  Pressable,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import Burger from '../assets/burger.png';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './../api/axios';
import {useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};


const SummaryGraph = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [totalPopulation, setTotalPopulation] = useState(0);

  const [value, setValue] = useState(null);
const [selectedTime, setSelectedValue] = useState(0);
const [open, setOpen] = useState(false);
const [items, setItems] = useState([
  {label: '1 Day', value: 1},
  {label: '3 Days', value: 3},
  {label: '5 Days', value: 5},
  {label: '7 Days', value: 7},
]);
const [N, SetN] = useState(7);

  const fetchData = async () => {
    try {
      // const url = 'http://192.168.100.35:4000/api/v1/smartMeter';
      const url = baseURL.defaults.baseURL + '/smartMeter';
      const data = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(data);
      const meterID = userData.meterID;
      const response = await axios.post(url, {
        meterID: meterID,
        s: '3600',
        n: N,
        w: '1668970800',
      });

      // Combine similar attributes of all objects into one object and add up their values
      const combinedData = {};
      response.data.message.forEach(obj => {
        const datetime = obj['Date & Time'].split(' ');
        obj.date = datetime[0];
        obj.time = datetime[1];
        delete obj['Date & Time'];

        Object.entries(obj).forEach(([key, value]) => {
          const label = key.replace(' [kW]', '');
          if (key.includes('[kW]') && label !== 'date' && label !== 'time') {
            if (label in combinedData) {
              combinedData[label] += Math.abs(parseFloat(value));
            } else {
              combinedData[label] = Math.abs(parseFloat(value));
            }
          }
        });
      });

      // Convert combined data object into array of label-value pairs for pie chart
      colors.push(randomColor());
      const chartData = Object.entries(combinedData).map(
        ([label, value], index) => ({
          label: label,
          value: value,
          svg: {
            fill: colors[index % colors.length],
            onPress: () => console.log('press', index),
          },
          key: `pie-${index}`,
        }),
      );

      setData(chartData);

      // Calculate total population based on sum of all values
      const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
      setTotalPopulation(total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [N]);

  const colors = [
    'rgb(57, 160, 162)',
    'rgb(26, 8, 195)',
    'rgb(238, 10, 196)',
    'rgb(138, 58, 11)',
    'rgb(210, 39, 61)',
    'rgb(138, 198, 138)',
    'rgb(59, 143, 36)',
    'rgb(92, 189, 30)',
    'rgb(135, 103, 249)',
    'rgb(6, 138, 226)',
    'rgb(178, 161, 103)',
    'rgb(107, 148, 94)',
    'rgb(225, 37, 116)',
    'rgb(142, 211, 13)',
    'rgb(101, 56, 153)',
    'rgb(172, 77, 86)',
    'rgb(180, 180, 55)',
    'rgb(90, 156, 146)',
    'rgb(94, 100, 75)',
    'rgb(233, 175, 172)',
  ];

  return (
    <>
    <View style={styles.swap}>
        <TouchableOpacity onPress={() => navigation.navigate('main')}>
          <Text style={styles.numerics}>Numerics</Text>
        </TouchableOpacity>
        <Text style={styles.graph}>Graph</Text>
      </View>
    <View
        style={{
          marginBottom: 10,
          flexDirection: 'column',
          // justifyContent: 'center',
          marginTop: 15,
          alignItems: 'center',
        }}>
        <View>
          <>
            <DropDownPicker
              label="label"
              defaultValue={1}
              style={{
                backgroundColor: '#fff',
                width: '50%',
              }}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                width: '50%',
              }}
              placeholder='7 Days'
              open={open}
              value={value}
              items={items}
              setValue={setValue}
              setOpen={setOpen}
              setItems={setItems}
              onChangeValue={value => {
                setSelectedValue(value);
                SetN(value * 24);
              }}
            />
          </>
        </View>
      </View>
    <View style={{flex: 1, alignItems:"center", elevation: -1}}>

      <View style={{flex: 1, justifyContent: 'center',}}>
        <PieChart style={{height: '80%', aspectRatio: 1}} data={data} />
      </View>

      <ScrollView style={{flex: 1, flexDirection: 'column'}}>
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View
              style={{
                backgroundColor: colors[index % colors.length],
                width: 20,
                height: 20,
                marginRight: 5,
              }}
            />
            <Text style={{color: 'black'}}>
              {item.label} ({((item.value / totalPopulation) * 100).toFixed(2)}
              %)
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
    </>  );
};

export default SummaryGraph;

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
    color: '#18BC9C',
    borderWidth: 1,
    borderColor: '#18BC9C',
    width: 126,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 24,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    // j
  },
  graph: {
    color: '#FFFFFF',
    backgroundColor: '#18BC9C',
    borderWidth: 1,
    borderColor: '#18BC9C',
    width: 126,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 24,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
  },
});
