import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import baseURL from './../api/axios';
import cheerio from 'cheerio';

const BillingHistory = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [info, setInfo] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const getBillHistory = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(user);
      const referenceNumber = userData.referenceNumber;
      const [twoDigit, fiveDigit, sevenDigit, ruralUrban] =
        referenceNumber.split('-');
      const url = `http://www.lesco.gov.pk/modules/customerbill/History.asp?nBatchNo=${twoDigit}&nSubDiv=${fiveDigit}&nRefNo=${sevenDigit}&strRU=${ruralUrban}`;

      // const url = baseURL.defaults.baseURL + '/historicalBill';
      // const url = 'http://10.130.20.246:4000/api/v1/historicalBill';

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

          let billHistory = [];
          for (let i = 0; i < tableData.length; i += 4) {
            let temp = [];
            for (let j = i; j < i + 4; j++) {
              temp.push(tableData[j]);
            }
            billHistory.push(temp);
          }
          setInfo(billHistory);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    getBillHistory();
    console.log(info);
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{padding: 10}}>
        <DropDownPicker
          open={open}
          value={value}
          items={info.map((item, i) => {
            return {label: item[0], value: i};
          })}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={value => setSelectedValue(value)}
          maxHeight={500}
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Month</Text>
        <Text style={{color: 'black'}}>
          {selectedValue ? info[selectedValue][0] : 'Null'}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Units</Text>
        <Text style={{color: 'black'}}>
          {selectedValue ? info[selectedValue][1] : 'Null'}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Bill</Text>
        <Text style={{color: 'black'}}>
          {selectedValue ? info[selectedValue][2] : 'Null'}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Payment</Text>
        <Text style={{color: 'black'}}>
          {selectedValue ? info[selectedValue][3] : 'Null'}
        </Text>
      </View>
    </View>
  );
};

export default BillingHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    elevation: -1,
  },
  text: {
    fontWeight: 'bold',
    color: '#000',
  },
});
