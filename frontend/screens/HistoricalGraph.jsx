
import React from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {SafeAreaView,
Text,
View,
StyleSheet,
Dimensions,
ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import baseURL from "./../api/axios";

function removeDuplicates(arr) {
for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[i] === arr[j]) {
      arr.splice(j, 1);
      j--;
    }
  }
}
return arr;
}
const mapDates = (dates) => {
return dates.map((dateString, index) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  if (index === 0) {
    const twoDigitYear = date.getFullYear().toString().substr(-2);
    return `${day} ${month} '${twoDigitYear}`;
  }
  return `${day} ${month}`;
});
};
const HistoricalGraph = () => {
const [parameters, setParameters] = useState([]);
const [time, setTime] = useState([]);
const getData = async () => {
  try {
    // const url = "http://192.168.100.7:4000/api/v1/smartMeter";
    const url = baseURL.defaults.baseURL + '/smartMeter';
    const data = await AsyncStorage.getItem("userData");
    const userData = JSON.parse(data);
    const meterID = userData.meterID;
    const response = await axios.post(url, {
      meterID: meterID,
      s: "3600",
      n: "168",
      w: "1668970800",
    });
    const x = response.data.message;
    let dates = [];
    for (let i = 0; i < x.length; i++) {
      let date = x[i]["Date & Time"]?.split(" ")[0];
      if (date) {
        dates.push(date);
      }
    }
    dates = removeDuplicates(dates);
    console.log(dates);
    let counter = 0;
    let dateSum = {};
    for (let i = 0; i < dates.length; i++) {
      let hourlySum = [];
      for (let j = 0; j < 24; j++) {
        if (counter >= x.length) {
          break;
        }
        let data = Object.keys(x[counter]);
        let sum = 0;
        for (let k = 0; k < data.length; k++) {
          if (data[k] !== "Date & Time") {
            sum += parseFloat(x[counter][data[k]] ?? 0);
          }
        }
        counter++;
        hourlySum.push(Math.abs(sum));
        //hourlySum.push({sum:sum,hour:hour});
      }
      dateSum[dates[i]] = hourlySum;
    }
    delete dateSum[dates[dates.length - 1]];
    console.log(dateSum);
    datesArray = Object.keys(dateSum).reverse();
    datesArray = mapDates(datesArray);
    setParameters(dateSum);
    setTime(datesArray);
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
return (
  <>
    <SafeAreaView style={{ backgroundColor: "#333"}}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: time,
                datasets: [
                  {
                    data: Object.values(parameters).flat(),
                    strokeWidth: 2,
                    color: (opacity = 1) => `black`,
                  },
                ],
              }}
              width={Dimensions.get('window').height * 0.95}
                height={Dimensions.get('window').width * 0.8}
              chartConfig={{
                backgroundColor: "#000",
                backgroundGradientFrom: "#333",
                backgroundGradientTo: "#333",
                decimalPlaces: 2,
                color: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
                fillShadowGradient: "rgb(0, 64, 64)",
                fillShadowGradientOpacity: 0.4,
              }}
              yAxisSuffix=" kWh"
              withInnerLines={false}
              style={styles.chart}
              bezier
              withDots={false}
              dotSize={4}
              fromZero={true}
              chartBackgroundColor="#000"
              showLegend={false}
              segments={3}
              onDataPointClick={(data) => console.log(data)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  </>
);
};

export default HistoricalGraph;

const styles = StyleSheet.create({
container: {
  backgroundColor: '#333',
  transform: [{rotate: '90deg'}],
  alignItems: 'center',
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
  justifyContent: 'center',
},
chart: {
  marginVertical: 8,
},
});
