import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from './../api/axios';
import {Checkbox} from 'react-native-paper';
import ButtonImage from './../assets/loadgraph.png';
import DropDownPicker from 'react-native-dropdown-picker';

const LiveLoadProfile = () => {
  const numCols = 2;
  const navigation = useNavigation();
  const [mrmdata, setNames] = useState([]);

  const [value, setValue] = useState(null);
  const [selectedTime, setSelectedValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: '1 hour', value: 1},
    {label: '2 hour', value: 2},
    {label: '3 hour', value: 3},
  ]);
  const [S, SetS] = useState(300);

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
        n: '12',
        w: '1668970800',
      });

      const name = Object.entries(response.data.message[0]);
      name_list = [];
      name.map((item, index) => {
        if (item[0] !== 'Date & Time') {
          item[0] = item[0].replace(' [kW]', '');
          name_list.push({txt: item[0], checked: false});
        }
      });
      setNames(name_list);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <View>
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: 15,
        }}>
        <View>
          <>
            <DropDownPicker
              label="label"
              defaultValue={1}
              style={{
                backgroundColor: '#fff',
                width: '90%',
                marginLeft: 20,
              }}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                width: '90%',
                marginLeft: 20,
              }}
              open={open}
              value={value}
              items={items}
              setValue={setValue}
              setOpen={setOpen}
              setItems={setItems}
              placeholder='Hours till Current Time to Display'
              onChangeValue={value => {
                setSelectedValue(value);
                SetS((value * 3600) / 12);
              }}
            />
          </>
        </View>
      </View>

      <Text style={{color: 'black', margin: 15, elevation: -1}}>
        Select Components
      </Text>
      <View
        style={{
          borderRadius: 10,
          marginHorizontal: 15,
          backgroundColor: '#E8E8E8',
          padding: 10,
          elevation: -1,
        }}>
        <FlatList
          data={mrmdata}
          key={numCols}
          numColumns={numCols}
          columnWrapperStyle={{}}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Checkbox
                  status={item.checked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    item.checked = !item.checked;
                    setNames([...mrmdata]);
                  }}
                  color="#18BC9C"
                />
                <Text style={{color: 'black'}}>{item.txt}</Text>
              </View>
            );
          }}
        />
      </View>

      <TouchableOpacity
        style={{
          alignSelf: 'center',
          marginTop: 30,
          borderWidth: 3,
          borderRadius: 10,
          borderColor: '#E8E8E8',
          elevation: 5,
        }}
        onPress={() => navigation.navigate('loadgraph', {mrmdata, S})}>
        <Image
          source={ButtonImage}
          resizeMode="contain"
          style={{borderRadius: 10}}
        />
      </TouchableOpacity>
      <View style={{alignSelf: 'center', flexDirection: 'row', paddingTop: 5}}>
        <Icon name="information-circle" size={16} color="black" />
        <Text style={{color: 'black', paddingHorizontal: 5}}>
          Click on image to open graph
        </Text>
      </View>
    </View>
  );
};

export default LiveLoadProfile;

const styles = StyleSheet.create({
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
