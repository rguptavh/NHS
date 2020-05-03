import * as React from 'react';
import { Text, View, StyleSheet, Image, ImageBackground, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import * as Progress from 'react-native-progress';


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
      startDisable: false,
      loading: global.logging,
      progress1: 0,
    }
  }

  componentWillUnmount() {
    deactivateKeepAwake();
    clearInterval(this.state.timer);
  }

  componentDidMount() {
    try {
     // AsyncStorage.removeItem('username');  // Clear username for testing
      // console.log(this.state.loading)
      if (global.logs == null) {
        let times = setInterval(() => {
         // // console.log(global.logging)
          if (global.logs != null) {
            this.setState({ loading: false });
            this.setState({ progress1: (global.hours * 60 + global.minutes) / 2400 });
            clearInterval(this.state.times);
          }

        }, 100);
        this.setState({ times });
      }
      else {
        setTimeout(() => {
          this.setState({ progress1: (global.hours * 60 + global.minutes) / 3000 });
        }, 500);
      }
      return true;
    }
    catch (exception) {
      return false;
    }
  }


  logDrive = () => {
    this.props.navigation.navigate('Logdrive')

  }
  pastDrives = () => {
    if (this.state.loading) {
      alert("Your drives are loading")
    }
    else {
      this.props.navigation.navigate('Drives')
    }

  }

  dashBoard = () => {
    if (this.state.loading) {
      alert("Your dashboard is loading")
    }
    else{
    this.props.navigation.navigate('Dashboard')
    }
  }


  static navigationOptions = { headerMode: 'none', gestureEnabled: false };

  render() {

    const Handbook = () => {
      WebBrowser.openBrowserAsync('https://www.cyberdriveillinois.com/publications/pdf_publications/dsd_a112.pdf');
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/login.png')} style={styles.image}>
        <View style={{ flex: 2, width: '100%', alignItems: 'center', marginTop: entireScreenHeight * 0.05, justifyContent: 'center', }}>
            <View style={styles.topcard}>
              <TouchableOpacity style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', width: '90%', alignItems: 'flex-end' }}>
                  <Text style={{ marginTop: entireScreenHeight * 0.96 * 16 / 63 * 0.08, alignItems: 'center', textAlign: 'center', }} numberOfLines={1}>
                    <Text style={{ fontSize: Math.min(70 * wid, 35 * rem), fontFamily: 'WSR', color: 'white' }} >{global.hours}</Text>
                    <Text style={{ fontSize: Math.min(30 * wid, 20 * rem), fontFamily: 'WSR', color: 'white' }}>{global.hours == 1 ? "hour" : "hours"}</Text>
                    <Text style={{ fontSize: Math.min(70 * wid, 35 * rem), fontFamily: 'WSR', color: 'white' }}>{global.minutes}</Text>
                    <Text style={{ fontSize: Math.min(30 * wid, 20 * rem), fontFamily: 'WSR', color: 'white' }}>{global.minutes == 1 ? "minute" : "minutes"}</Text>
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
