import React from 'react';
import { Text, View, Vibration, Platform, StyleSheet,AsyncStorage, Image, } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import log from './components/Login';
import mainscr from './components/Mainpage';
import drives from './components/Drives';
import logdrive from './components/Logdrive';
import dashboard from './components/Dashboard';
import { AppLoading } from 'expo';
import { SplashScreen } from 'expo';


//import moment from 'moment';
let logged = false;
export default class AppContainer extends React.Component {
  state = {
    expoPushToken: '',
    notification: {},
    assetsLoaded: false,
    isAppReady: false,
  };
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
    SplashScreen.preventAutoHide(); // Instruct SplashScreen not to hide yet

  }
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  async componentDidMount() {
    this.registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    await Font.loadAsync({
      'Noto': require('./assets/fonts/NotoSans-SemiBold.ttf'),
      'WSR': require('./assets/fonts/WorkSans-Regular.ttf'),
      'WSB': require('./assets/fonts/WorkSans-SemiBold.ttf'),
      'WSBB': require('./assets/fonts/WorkSans-Black.ttf'),
    });
    this.setState({assetsLoaded: true});
    global.logging = false;
    let name;
    try {
      name = await AsyncStorage.getItem('username')
    //  // console.log(name);
    //  // console.log(global.logged);
      if (name !== null && name != 'undefined') {
        logged = true;
        global.uname = name;
      }

    } catch (e) {
      console.log('Failed to load .')
    }
    if (logged) {
      global.logging = true;
      this.setState({ assetsLoaded: true });
      var uname = name;
      const Http = new XMLHttpRequest();
      const url = 'https://script.google.com/macros/s/AKfycbz21dke8ZWXExmF9VTkN0_3ITaceg-3Yg-i17lO31wtCC_0n00/exec';
      var data = "?username=" + uname + "&action=getdrives";
      Http.open("GET", String(url + data));
      Http.send();
      var ok;
      Http.onreadystatechange = (e) => {
        ok = Http.responseText;
        if (Http.readyState == 4) {
          console.log(String(ok));

          if (ok.substring(0, 4) == "true") {
            // console.log(response.toString());
            global.uname = uname;
            var total = parseFloat(ok.substring(5, ok.indexOf(",", 5)));
            global.hours = Math.floor(total);
            global.minutes = Math.round((total - global.hours) * 60);
            console.log(global.minutes)
            var data = JSON.parse(ok.substring(ok.indexOf(",", 5) + 1, ok.length))

            // console.log(JSON.stringify(data))
            var ongoing = [];
            var specific = [];
            var log = [];
            for (var x = 0; x < data.length; x++) {
              if (data[x].type == "Log") {
                data[x]["id"] = "" + x;
                log.push(data[x]);
              }
              else if (data[x].type == "Ongoing") {
                data[x]["id"] = "" + x;
                ongoing.push(data[x]);
              }
              else if (data[x].type == "Specific") {
                data[x]["id"] = "" + x;
                specific.push(data[x]);
              }
            }
            console.log(data)

            specific = specific.sort((a, b) => moment(a.date + " " + a.start, 'MM-DD-YYYY h:mm A').format('X') - moment(b.date + " " + b.start, 'MM-DD-YYYY h:mm A').format('X'))
            log = log.sort((a, b) => moment(b.date, 'MM-DD-YYYY').format('X') - moment(a.date, 'MM-DD-YYYY').format('X'))
            const map = new Map();
            let result = [];
            for (const item of log) {
              if (!map.has(item.date)) {
                map.set(item.date, true);    // set any value to Map
                result.push(item.date);
              }
            }
            for (var i = 0; i < log.length; i++) {
              if (result.includes(log[i].date)) {
                result.shift();
                // console.log(result)
                const he = {
                  header: true,
                  id: "" + (data.length + i),
                  date: log[i].date
                }
                log.splice(i, 0, he);
              }
            }
            var options = []
            for (const item of ongoing) {
              options.push({ label: item.name, value: item.name })
            }
            for (const item of specific) {
              options.push({ label: item.name, value: item.name })
            }
            global.options = options;
            global.ongoing = ongoing;
            global.specific = specific;
            global.logs = log;
            // console.log(JSON.stringify(data))
            this.setState({ isAppReady: true });
            this.props.navigation.replace('Main')

          }
          else {
            this.setState({ isAppReady: true });
            setTimeout(() => { alert("Server Error"); }, 100);
          }

        }
      }
    }
    else {
      this.setState({ isAppReady: true });
    }
 
  }

  _handleNotification = notification => {
    Vibration.vibrate();
    this.setState({ notification: notification });
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  render() {
    if (!this.state.isAppReady || !this.state.assetsLoaded) {
      return (
        <AppLoading></AppLoading>
      );
    }
      const AppNavigator = createStackNavigator({
        Login: {
          screen: log
        },
        Main: {
          screen: mainscr
        },
        Logdrive: {
          screen: logdrive
        },
        Drives: {
          screen: drives
        },
        Dashboard: {
          screen: dashboard
        },
      },
        {
          initialRouteName: logged ? 'Main' : 'Login',
          headerMode: 'none'
        });

      const AppContainer = createAppContainer(AppNavigator);
      return <AppContainer />;
  }
}

/*  TO GET PUSH RECEIPTS, RUN THE FOLLOWING COMMAND IN TERMINAL, WITH THE RECEIPTID SHOWN IN THE CONSOLE LOGS

    curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
      "ids": ["YOUR RECEIPTID STRING HERE"]
      }'
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});