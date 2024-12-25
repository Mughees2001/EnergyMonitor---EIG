import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './../api/axios';
import {LineChart} from 'react-native-chart-kit';

// import {LineChart} from 'react-native-chart-kit';
// const MyLineChart = () => {
//   const [units, setUnits] = useState([]);
//   const [time, setTime] = useState([]);
//   const getData = async () => {
//     try {
//       const url = baseURL.defaults.baseURL + '/smartMeter';
//       // const url = 'http://10.130.20.246:4000/api/v1/smartMeter';
//       const data = await AsyncStorage.getItem('userData');
//       const userData = JSON.parse(data);
//       const meterID = userData.meterID;
//       const response = await axios.post(url, {
//         meterID: meterID,
//         s: '1200',
//         n: '12',
//         w: '1668970800',
//       });
//       response.data.message.forEach(obj => {
//         const datetime = obj['Date & Time'].split(' ');
//         obj.date = datetime[0];
//         obj.time = datetime[1];
//         delete obj['Date & Time'];
//       });
//       timeArray = [];
//       response.data.message.forEach(obj => {
//         timeArray.push(obj['time'].slice(0, 5));
//       });
//       usageArray = [];
//       response.data.message.forEach(obj => {
//         usageArray.push(obj['Usage [kW]']);
//       });
//       setTime(timeArray);
//       setUnits(usageArray);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getData();
//   }, []);

//   if (units.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       <LineChart
//         data={{
//           labels: time.reverse(),
//           datasets: [
//             {
//               data: units.reverse(),
//               strokeWidth: 2,
//             },
//           ],
//         }}
//         width={Dimensions.get('window').height * 0.95}
//         height={Dimensions.get('window').width}
//         chartConfig={{
//           backgroundColor: '#1cc910',
//           backgroundGradientFrom: '#eff3ff',
//           backgroundGradientTo: '#efefef',
//           decimalPlaces: 2,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//         }}
//       />
//     </>
//   );
// };

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

// adding the [KW]
function appendUnitKW(data) {
  return data.map(item => ({
    ...item,
    txt: `${item.txt} [kW]`,
  }));
}

// make arrays of all items
function processApiData(apiData) {
  let result = {};
  for (let dataPoint of apiData) {
    for (let key in dataPoint) {
      if (!result.hasOwnProperty(key)) {
        result[key] = [];
      }
      result[key].push(dataPoint[key]);
    }
  }
  return result;
}

// from all arrays dicto make a dicto of needed arrays
function filterData(processedData, filterCriteria) {
  let filteredData = {};

  for (let item of filterCriteria) {
    if (item.checked) {
      filteredData[item.txt] = processedData[item.txt].reverse();
    }
  }
  return filteredData;
}

const LiveLoadGraph = ({route}) => {
  const {mrmdata, S} = route.params;

  mrmdata.forEach(item => {
    if (item.txt === 'Usage') {
      item.checked = true;
    }
  });

  const [parameters, setParameters] = useState([]);
  const [time, setTime] = useState([]);
  const getData = async () => {
    try {
      const url = baseURL.defaults.baseURL + '/smartMeter';
      const data = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(data);
      const meterID = userData.meterID;
      const response = await axios.post(url, {
        meterID: meterID,
        s: S,
        n: '12',
        w: '1668970800',
      });
      response.data.message.forEach(obj => {
        const datetime = obj['Date & Time'].split(' ');
        obj.date = datetime[0];
        obj.time = datetime[1];
        delete obj['Date & Time'];
      });
      //console.log("dirty af data", response.data.message);
      timeArray = [];
      response.data.message.forEach(obj => {
        timeArray.push(obj['time'].slice(0, 5));
      });
      //const tempdata = mrmdata;
      const finalMrmData = appendUnitKW(mrmdata);
      const arraysOfAllData = processApiData(response.data.message);
      const usefullArrays = filterData(arraysOfAllData, finalMrmData);
      // console.log(usefullArrays);
      // usageArray = [];
      // response.data.message.forEach(obj => {
      //   usageArray.push(obj['Usage [kW]']);
      // });
      setTime(timeArray.reverse());
      console.log('time', timeArray);
      setParameters(usefullArrays);
      console.log('parameters', parameters);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  if (parameters.length === 0) {
    return null;
  }
  const colors = Object.keys(parameters).map(() => randomColor());
  return (
    <>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View>
          <View style={styles.container}>
            <View>
              <LineChart
                data={{
                  labels: time,
                  datasets: Object.keys(parameters).map((key, index) => ({
                    label: key,
                    data: parameters[key].map(parseFloat),
                    strokeWidth: 2,
                    color: (opacity = 1) => `${colors[index]}${opacity})`,
                  })),
                }}
                width={Dimensions.get('window').height * 0.95}
                height={Dimensions.get('window').width * 0.8}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  fillShadowGradient: 'rgb(98,191,221)',
                  fillShadowGradientOpacity: 0.2,
                }}
              />
              <View style={styles.legend}>
                {Object.keys(parameters).map((key, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendIndicator,
                        {backgroundColor: colors[index]},
                      ]}
                    />
                    <Text style={styles.legendLabel}>{key}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default LiveLoadGraph;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    transform: [{rotate: '90deg'}],
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.95,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
    backgroundColor: '#fff',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  legendIndicator: {
    width: 10,
    height: 10,
  },
  legendLabel: {
    fontSize: 12,
    color: 'black',
  },
});
