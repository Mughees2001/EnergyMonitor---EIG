// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   Image,
//   StatusBar,
//   Pressable,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import baseURL from './../api/axios';

// import {PieChart} from 'react-native-chart-kit';
// const SummaryGraph = () => {
//   const [data, setData] = useState([]);
//   const [totalPopulation, setTotalPopulation] = useState(0);

//   const fetchData = async () => {
//     try {
//       const url = baseURL.defaults.baseURL + '/smartMeter';
//       // const url = 'http://10.130.20.246:4000/api/v1/smartMeter';
//       const data = await AsyncStorage.getItem('userData');
//       const userData = JSON.parse(data);
//       const meterID = userData.meterID;
//       const response = await axios.post(url, {
//         meterID: meterID,
//         s: '3600',
//         n: '24',
//         w: '1668970800',
//       });

//       const pairs = Object.entries(response.data.message[0]);
//       const combinedData = {};

//       pairs.map((item, index) => {
//         if (item[0] !== 'Date & Time') {
//           combinedData[item[0]] = Math.abs(parseFloat(item[1]));
//         }
//       });
//       console.log(combinedData);

//       // console.log("Combined data:", combinedData);

//       // Normalize combined data between 0 and 1 and convert to percentage
//       const maxValue = Math.max(...Object.values(combinedData));
//       const normalizedData = {};
//       for (const [label, value] of Object.entries(combinedData)) {
//         normalizedData[label] = (value / maxValue) * 100;
//       }

//       // console.log("Normalized data:", normalizedData);

//       // Generate colors for each label
//       const colorMap = {};
//       let i = 0;
//       for (const label of Object.keys(normalizedData)) {
//         colorMap[label] = `hsl(${i * 50}, 70%, 50%)`;
//         i++;
//       }

//       // console.log("Color map:", colorMap);

//       // Convert combined data to an array of objects with label, population, and color properties
//       const parsedData = [];
//       for (const [label, value] of Object.entries(normalizedData)) {
//         parsedData.push({
//           label: label.slice(0, 20),
//           population: value,
//           color: colorMap[label],
//         });
//       }

//       console.log('Parsed data:', parsedData);

//       setData(parsedData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const calculatePercentage = (value, total) => {
//     // Your percentage calculation logic here
//   };

//   const legendData = data.map(item => ({
//     name: item.label,
//     color: item.color,
//   }));

//   return (
//     <View style={{backgroundColor: '#fff', flex: 1, height: '100%'}}>
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <PieChart
//           data={data}
//           width={Dimensions.get('window').width}
//           height={220}
//           chartConfig={{
//             backgroundColor: '#ffffff',
//             backgroundGradientFrom: '#ffffff',
//             backgroundGradientTo: '#ffffff',
//             decimalPlaces: 0,
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             legend: {
//               enabled: true,
//               textSize: 14,
//               form: 'circle',
//               horizontalAlignment: 'center',
//               verticalAlignment: 'bottom',
//               spacing: 10,
//               formSize: 12,
//               xEntrySpace: 10,
//               yEntrySpace: 5,
//               spaceBetweenLabelsAndItems: 10,
//               labelFormatter: (label, value) => `${label} (${value})`,
//             },
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           renderLabel={({label, population}) => {
//             const percentage = calculatePercentage(population, totalPopulation);
//             return `${label} (${percentage}%)`;
//           }}
//         />
//         <FlatList
//           data={legendData}
//           keyExtractor={(item, index) => index.toString()}
//           numColumns={2} // Set the number of columns here
//           renderItem={({item}) => (
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginRight: 10,
//               }}>
//               <View
//                 style={{
//                   width: 12,
//                   height: 12,
//                   borderRadius: 6,
//                   backgroundColor: item.color,
//                   marginRight: 5,
//                 }}
//               />
//               <Text style={{color: 'black'}}>{item.name}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// export default SummaryGraph;

// const styles = StyleSheet.create({
//   swap: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     paddingTop: 12,
//     paddingHorizontal: 20,
//   },
//   numerics: {
//     color: '#18BC9C',
//     borderWidth: 1,
//     borderColor: '#18BC9C',
//     width: 126,
//     textAlign: 'center',
//     fontWeight: 700,
//     fontSize: 14,
//     lineHeight: 24,
//     borderTopLeftRadius: 8,
//     borderBottomLeftRadius: 8,
//     elevation: 5,
//   },
//   graph: {
//     color: '#FFFFFF',
//     backgroundColor: '#18BC9C',
//     borderWidth: 1,
//     borderColor: '#18BC9C',
//     width: 126,
//     textAlign: 'center',
//     fontWeight: 700,
//     fontSize: 14,
//     lineHeight: 24,
//     borderTopRightRadius: 8,
//     borderBottomRightRadius: 8,
//     elevation: 5,
//   },
// });

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
        n: '24',
        w: '1668970800',
      });

      // Combine similar attributes of all objects into one object and add up their values
      const combinedData = {};
      const obj = response.data.message[0];
      // response.data.message.forEach(obj => {
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
      // });

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
  }, []);

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
    <View style={{flex: 1, alignItems: 'center', height: '100%'}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
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
  );
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
