import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import SignUp1 from './screens/SignUp1';
import SignUp2 from './screens/SignUp2';
import SignUp3 from './screens/SignUp3';
import SignUp4 from './screens/SignUp4';
import ForgotPassword1 from './screens/ForgotPassword1';
import ForgotPassword2 from './screens/ForgotPassword2';
import ForgotPassword3 from './screens/ForgotPassword3';
import ForgotPassword4 from './screens/ForgotPassword4';
import Home from './screens/Home';
import Login from './screens/Login.jsx';
import Summary from './screens/Summary';
import Bill from './screens/Bill';
import BillingTrend from './screens/BillingTrend';
import BillingHistory from './screens/BillingHistory';
import SummaryGraph from './screens/SummaryGraph';
import Live from './screens/Live';
import Historical from './screens/Historical';
import Settings from './screens/Settings';
import CustomDrawerComponent from './components/CustomDrawerComponent';
import ChangePassword from './screens/ChangePassword';
import ChangeProfile from './screens/ChangeProfile';
import ChangeNames from './screens/ChangeDisplayNames';
import HeatMap from './screens/HeatMap';
import CTShare from './screens/CTShare';
import LiveLoadProfile from './screens/LiveLoadProfile';
import LiveLoadGraph from './screens/LiveLoadGraph';
import HistoricalGraph from './screens/HistoricalGraph';

import {useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const BillStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#18BC9C'}}}>
      <Stack.Screen
        name="billmain"
        component={Bill}
        options={{
          title: 'Electricity Bill',
          headerLeft: () => (
            <Icon
              name="menu-outline"
              size={26}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{paddingRight: 20}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="billingtrend"
        component={BillingTrend}
        options={{title: 'Billing Trend'}}
      />
      <Stack.Screen
        name="billinghistory"
        component={BillingHistory}
        options={{title: 'Billing History'}}
      />
    </Stack.Navigator>
  );
};

const SettingStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#18BC9C'}}}>
      <Stack.Screen
        name="setting1"
        component={Settings}
        options={{
          title: 'Settings',
          headerLeft: () => (
            <Icon
              name="menu-outline"
              size={26}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{paddingRight: 20}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="changepassword"
        component={ChangePassword}
        options={{title: 'Change Password'}}
      />
      <Stack.Screen
        name="changeprofile"
        component={ChangeProfile}
        options={{title: 'Change Profile'}}
      />
      <Stack.Screen
        name="changedisplaynames"
        component={ChangeNames}
        options={{title: 'Change Display Names'}}
      />
    </Stack.Navigator>
  );
};

const LiveStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#18BC9C'}}}>
      <Stack.Screen
        name="liveupdate"
        component={Live}
        options={{
          title: 'Live Update',
          headerLeft: () => (
            <Icon
              name="menu-outline"
              size={26}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{paddingRight: 20}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ctshare"
        component={CTShare}
        options={{title: 'Sub CT Share'}}
      />
      <Stack.Screen
        name="loadprofile"
        component={LiveLoadProfile}
        options={{title: 'Live Load Profile'}}
      />
      <Stack.Screen
        name="loadgraph"
        component={LiveLoadGraph}
        options={{title: 'Live Load Graph'}}
      />
    </Stack.Navigator>
  );
};

const HistoricalStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#18BC9C'}}}>
      <Stack.Screen
        name="historicalmain"
        component={Historical}
        options={{
          title: 'Historical',
          headerLeft: () => (
            <Icon
              name="menu-outline"
              size={26}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{paddingRight: 20}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="heatmap"
        component={HeatMap}
        options={{title: 'HeatMap'}}
      />
      <Stack.Screen
        name="historicalgraph"
        component={HistoricalGraph}
        options={{title: 'Historical Load Graph'}}
      />
    </Stack.Navigator>
  );
};

const SummaryStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#18BC9C'}}}>
      <Stack.Screen
        name="main"
        component={Summary}
        options={{
          title: 'Summary',
          headerLeft: () => (
            <Icon
              name="menu-outline"
              size={26}
              onPress={() => navigation.openDrawer()}
              color="black"
              style={{paddingRight: 20}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="graphs"
        component={SummaryGraph}
        options={{title: 'Summary Graph'}}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Summary"
      screenOptions={{
        drawerStyle: {
          width: 240,
        },

        drawerActiveTintColor: '#18BC9C',
        drawerInactiveTintColor: 'white',
        headerStyle: {
          backgroundColor: '#18BC9C',
        },
      }}
      drawerContent={props => <CustomDrawerComponent {...props} />}>
      <Drawer.Screen
        name="summary"
        component={SummaryStack}
        options={{
          title: 'Summary',
          drawerIcon: () => (
            <Icon name="newspaper-outline" size={24} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="bill"
        component={BillStack}
        options={{
          title: 'Electricity Bill',
          drawerIcon: () => (
            <Icon name="cash-outline" size={24} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="live"
        component={LiveStack}
        options={{
          title: 'Live Update',
          drawerIcon: () => (
            <Icon name="disc-outline" size={24} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="historical"
        component={HistoricalStack}
        options={{
          title: 'Historical',
          drawerIcon: () => (
            <Icon name="stats-chart-outline" size={24} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="settings"
        component={SettingStack}
        options={{
          title: 'Settings',
          drawerIcon: () => (
            <Icon name="settings-outline" size={24} color="white" />
          ),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
          name="home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup1"
          component={SignUp1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup2"
          component={SignUp2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup3"
          component={SignUp3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup4"
          component={SignUp4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="forgotpassword1"
          component={ForgotPassword1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="forgotpassword2"
          component={ForgotPassword2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="forgotpassword3"
          component={ForgotPassword3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="forgotpassword4"
          component={ForgotPassword4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="drawer"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Main;
