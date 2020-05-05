import * as React from 'react';
import { Text, View, StyleSheet, Image, ImageBackground, TouchableOpacity, Dimensions, AsyncStorage, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Progress from 'react-native-progress';
import { NavigationActions, StackActions } from 'react-navigation'


const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;


export default class Mainpage extends React.Component {
  constructor(props) {
    super(props);
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false; 
    this.state = {
      progress1: 0,
    }
  }




  logDrive = () => {
    this.props.navigation.navigate('Logdrive')

  }
  pastDrives = () => {
      this.props.navigation.navigate('Drives')

  }

  dashBoard = () => {
    this.props.navigation.navigate('Dashboard')
  }


  static navigationOptions = { headerMode: 'none', gestureEnabled: false };

  render() {
    const onPress2 = async () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "No"
          },
          {
            text: "Yes", onPress: async () => {
              await AsyncStorage.removeItem('username');
              const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'Login'})],
                key: null,
              });
              this.props.navigation.dispatch(resetAction);
            }
          }
        ],
        { cancelable: false }
      );
    
    }
    const Handbook = () => {
      WebBrowser.openBrowserAsync('https://www.d128.org/vhhs/students/student-activities/nhs/index');
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/login.png')} style={styles.image}>
        <View style={{ flex: 2, width: '100%', alignItems: 'center', marginTop: entireScreenHeight * 0.05, justifyContent: 'center', }}>
            <View style={styles.topcard}>
              <TouchableOpacity style={{ flex: 1, width: '100%', alignItems: 'center' }} onPress={onPress2}>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', width: '90%', alignItems: 'flex-end' }}>
                  <Text style={{ marginTop: entireScreenHeight * 0.96 * 16 / 63 * 0.08, alignItems: 'center', textAlign: 'center', }} numberOfLines={1}>
                    <Text style={{ fontSize: Math.min((70-10*(Math.floor(Math.log10(global.minutes <= 0 ? 1 : global.minutes)) + Math.floor(Math.log10(global.hours <= 0 ? 1 : global.hours)))) * wid, 32 * rem), fontFamily: 'WSR', color: 'white' }} >{global.hours}</Text>
                    <Text style={{ fontSize: Math.min(25 * wid, 16 * rem), fontFamily: 'WSR', color: 'white' }}>{global.hours == 1 ? "hour " : "hours "}</Text>
                    <Text style={{ fontSize: Math.min((70-10*(Math.floor(Math.log10(global.minutes <= 0 ? 1 : global.minutes)) + Math.floor(Math.log10(global.hours <= 0 ? 1 : global.hours)))) * wid, 32 * rem), fontFamily: 'WSR', color: 'white' }}>{global.minutes==''?'0' : global.minutes}</Text>
                    <Text style={{ fontSize: Math.min(25 * wid, 16 * rem), fontFamily: 'WSR', color: 'white' }}>{global.minutes == 1 ? "minute" : "minutes"}</Text>
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Progress.Bar progress={this.state.progress1} width={entireScreenWidth * 0.8} animated={true} height={rem * 20} borderRadius={25} color='#79AEFD' borderColor='#D0D0D0' unfilledColor='white' />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            width: '100%',
            flex: 2,
            flexDirection: 'row',
            alignItems: 'center'
          }} >
            <TouchableOpacity
              style={{
                height: entireScreenWidth / 2 * 0.9,
                flex: 1
              }} onPress={this.logDrive}
            >
              <Image source={require('../assets/logdrive.png')} style={{
                height: '100%',
                width: '100%',
                flex: 1


              }} resizeMode="contain"></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: entireScreenWidth / 2 * 0.9,
                flex: 1
              }} onPress={this.pastDrives}

            >
              <Image source={require('../assets/pdrive.png')} style={{
                height: '100%',
                width: '100%',
                flex: 1


              }} resizeMode="contain"></Image>
            </TouchableOpacity>
          </View>
          <View style={{
            width: '100%',
            flex: 2,
            flexDirection: 'row',
          }}>
            <TouchableOpacity
              style={{
                height: entireScreenWidth / 2 * 0.9,
                flex: 1
              }} onPress={this.dashBoard}
            >
              <Image source={require('../assets/dash.png')} style={{
                height: '100%',
                width: '100%',
                flex: 1


              }} resizeMode="contain"></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: entireScreenWidth / 2 * 0.9,
                flex: 1
              }} onPress={Handbook}
            >
              <Image source={require('../assets/handbook.png')} style={{
                height: '100%',
                width: '100%',
                flex: 1


              }} resizeMode="contain"></Image>
            </TouchableOpacity>
          </View>
        </ImageBackground>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingTop: 8,
    borderRadius: 10,
    height: '60%',
    flex: 2
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20
  },
  counterText: {
    fontSize: entireScreenWidth * 60 / 380, textAlign: 'center',
    color: 'white',
    fontFamily: 'Nova',
  },
  topcard: {
    height: '80%', width: '90%', backgroundColor: '#C2CBE1', borderRadius: 25, shadowColor: "#000",
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
