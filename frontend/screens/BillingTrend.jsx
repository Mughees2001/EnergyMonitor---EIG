import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import {useEffect} from 'react';
import baseURL from './../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cheerio from 'cheerio';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

//import React Native chart Kit for different kind of Chart
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const MyBarChart = () => {
  const [units, setUnits] = useState([]);
  const [month, setMonth] = useState([]);
  const [bill, setBill] = useState([]);

  const getData = async () => {
    let month = [];
    let units = [];
    let bill = [];
    try {
      const user = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(user);
      const referenceNumber = userData.referenceNumber;
      const [twoDigit, fiveDigit, sevenDigit, ruralUrban] =
        referenceNumber.split('-');
      const url = `http://www.lesco.gov.pk/modules/customerbill/History.asp?nBatchNo=${twoDigit}&nSubDiv=${fiveDigit}&nRefNo=${sevenDigit}&strRU=${ruralUrban}`;
      axios
        .get(url)
        .then(response => {
          const $ = cheerio.load(response.data);
          const tableRows = $('#ContentPane table tr');
          const tableHeaders = tableRows
            .eq(0)
            .find('td')
            .map((i, el) => $(el).text().trim())
            .get();
          const tableData = tableRows
            .slice(1)
            .map((i, el) => {
              return $(el)
                .find('td')
                .map((i, td) => $(td).text().trim())
                .get();
            })
            .get();
          for (let i = 1; i < tableData.length; i = i + 4) {
            units.push(tableData[i]);
          }
          for (let i = 0; i < tableData.length; i = i + 4) {
            month.push(tableData[i].slice(0, 3));
          }
          for (let i = 2; i < tableData.length; i = i + 4) {
            bill.push(tableData[i]);
          }

          setUnits(units);
          setMonth(month);
          setBill(bill);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Text style={styles.header}>Units Chart</Text>
      <BarChart
        data={{
          labels: month,
          datasets: [
            {
              data: units,
            },
          ],
        }}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // set the color to dark blue
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.3,
          fillShadowGradient: 'rgb(98,191,221)',
          fillShadowGradientOpacity: 1,
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          color: 'blue',
        }}
      />

      <Text style={styles.header}>Bill Chart</Text>
      <BarChart
        data={{
          labels: month,
          datasets: [
            {
              data: bill,
            },
          ],
        }}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // set the color to dark blue
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.3,
          fillShadowGradient: 'rgb(166,30,32)',
          fillShadowGradientOpacity: 1,
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          color: 'blue',
        }}
      />
    </>
  );
};

const BillingTrend = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View>
            <MyBarChart />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BillingTrend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
    color: 'black',
  },
});
