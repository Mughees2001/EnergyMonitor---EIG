import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useState, useEffect} from 'react';
import baseURL from './../api/axios';
import cheerio from 'cheerio';

const Bill = () => {
  const navigation = useNavigation();

  const [paid, setPaid] = useState(true);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState([]);

  const handleLinkPress = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(user);
      const referenceNumber = userData.referenceNumber;
      const [twoDigit, fiveDigit, sevenDigit, ruralUrban] =
        referenceNumber.split('-');
      await Linking.openURL(
        `http://www.lesco.gov.pk:36247/BillNew.aspx?BatchNo=${twoDigit}&SubDiv=${fiveDigit}&RefNo=${sevenDigit}&RU=${ruralUrban}&Exec=941N7&nCtID=`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getBillHistory = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(user);
      const referenceNumber = userData.referenceNumber;
      const [twoDigit, fiveDigit, sevenDigit, ruralUrban] =
        referenceNumber.split('-');
      // const url = baseURL.defaults.baseURL + '/historicalBill';
      // const url = 'http://10.130.20.246:4000/api/v1/historicalBill';
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
          setData(tableData);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const getAccountStatus = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(user);
      const referenceNumber = userData.referenceNumber;
      const [twoDigit, fiveDigit, sevenDigit, ruralUrban] =
        referenceNumber.split('-');
      const url = `http://www.lesco.gov.pk/Customer_Reg/AccountStatus.aspx?nBatchNo=${twoDigit}&nSubDiv=${fiveDigit}&nRefNo=${sevenDigit}&strRU=${ruralUrban}`;
      // const url = 'http://10.130.20.246:4000/api/v1/accountStatus';

      axios
        .get(url)
        .then(response => {
          const $ = cheerio.load(response.data);
          const tableRows = $('#ContentPane table tr');
          const AccountStatus = tableRows.toArray().map(row => {
            return $(row)
              .find('td')
              .toArray()
              .map(cell => $(cell).text());
          });

          setDate(AccountStatus[4][1]);
          if (AccountStatus[12][1] === '0') {
            setPaid(false);
          }
          setAmount(AccountStatus[8][1]);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    getAccountStatus();
    getBillHistory();
  }, []);

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('billingtrend')}>
        <View style={styles.buttonSecondaryContainer}>
          <Text style={styles.primaryText}>Billing Trend</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('billinghistory')}>
        <View style={styles.buttonSecondaryContainer}>
          <Text style={styles.primaryText}>Billing History</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="chevron-forward-outline" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        <View style={styles.innerContainer}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>
            Current Bill for {date}
          </Text>
        </View>
        <View style={styles.innerContainer}>
          <View>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
              Rs. {amount}
            </Text>
            <Text style={{fontSize: 12, color: 'black'}}>
              {paid ? 'Paid' : 'Unpaid'}
            </Text>
          </View>
          <Icon
            style={{marginRight: 5, marginTop: 10}}
            size={36}
            color="#00A65A"
            name="cash-outline"
          />
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.innerContainer}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>
            Expected Electicity Bill Next Month
          </Text>
        </View>
        <View style={styles.innerContainer}>
          <View>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
              Rs. {data[42]}
            </Text>
          </View>
          <Icon
            style={{marginRight: 5, marginTop: 10}}
            size={36}
            color="#605CA8"
            name="stats-chart-outline"
          />
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.innerContainer}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>
            Expected Units
          </Text>
        </View>
        <View style={styles.innerContainer}>
          <View>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
              Units: {data[41]}
            </Text>
          </View>
          <Icon
            style={{marginRight: 5, marginTop: 10}}
            size={36}
            color="#DD4B39"
            name="flash-outline"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => handleLinkPress()}>
        <View style={styles.buttonSecondaryContainer}>
          <Text style={styles.primaryText}>Download Bill</Text>
        </View>
        <View style={styles.icon}>
          <Icon name="arrow-down-outline" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Bill;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#E8E8E8',
    width: '90%',
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 20,
    elevation: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
    marginTop: 20,
    justifyContent: 'space-between',
  },

  buttonSecondaryContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },

  primaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },

  icon: {
    padding: 4,
  },
});
