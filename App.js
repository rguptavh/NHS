import React from 'react';
import { Text, View, Button, Vibration, Platform, StyleSheet,AsyncStorage, BackHandler, } from 'react-native';
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
import edit from './components/Editdrive';
import { AppLoading } from 'expo';

//import moment from 'moment';
let logged = false;
export default class AppContainer extends React.Component {
  state = {
    expoPushToken: '',
    notification: {},
    assetsLoaded: false,
  };
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
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
  }

  _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  render() {

    if (this.state.assetsLoaded) {
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
        Edit: {
          screen: edit
        }
      },
        {
          initialRouteName: logged ? 'Main' : 'Login',
          headerMode: 'none'
        });

      const AppContainer = createAppContainer(AppNavigator);
      return <AppContainer />;
    }
    else {
      return <AppLoading></AppLoading>;
    }
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