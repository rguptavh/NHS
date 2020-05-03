import * as React from 'react';
import { View, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert, Dimensions, AsyncStorage, FlatList, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { Text, ListItem,Body} from "native-base";

import { NavigationActions, StackActions } from 'react-navigation'
import Swipeable from 'react-native-swipeable-row';
import Spinner from 'react-native-loading-spinner-overlay';





const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
let first = true;
export default class Login extends React.Component {
  state = {
    spinner: false,
    data: global.logs,
  };
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
  }
  componentDidMount() {

    try {
      //AsyncStorage.removeItem('username');  // Clear username for testing


      if (global.drives == null) {
        let times = setInterval(() => {
          // // console.log(global.logging)
          if (global.drives != null) {
            this.checkdate();
            setTimeout(() => {
              this.setState({ progress1: (global.totalhrs * 60 + global.totalmins) / 2400 });
              this.setState({ progress2: (global.nighthrs * 60 + global.nightmins) / 600 });
            }, 500);

            clearInterval(this.state.times);
          }

        }, 100);
        this.setState({ times });
      }
      else {
        this.checkdate();
        setTimeout(() => {
          this.setState({ progress1: (global.totalhrs * 60 + global.totalmins) / 3000 });
          this.setState({ progress2: (global.nighthrs * 60 + global.nightmins) / 600 });
        }, 500);
      }
      return true;
    }
    catch (exception) {
      return false;
    }
  }
  async checkdate() {
    dat = await AsyncStorage.getItem('date')
    var d1 = moment(dat, 'MM-DD-YYYY')
    var d2 = moment();
    var total = global.totalhrs * 60 + global.totalmins;
    var night = global.nighthrs * 60 + global.nightmins;
    var day = total - night;
    if (dat != null && d1.isSameOrAfter(d2, 'day')) {
      // // console.log(dat);
      this.setState({ date: dat });
      var a = moment();
      var b = moment(dat, 'MM-DD-YYYY')
      if (night > 600 && day > 2400) {
        this.setState({ hoursneeded: 'Done!' })
      }
      else {
        const hrs = b.diff(a, 'days') + 1
        if (hrs < 7) {
          var needed = (600 - Math.min(night, 600) + 2400 - Math.min(day, 2400)) / 60;
          needed = Math.round((needed + Number.EPSILON) * 100) / 100
          this.setState({ hoursneeded: String(needed) })
        }

        else {
          //   // console.log(hrs)
          const weeks = Math.round(hrs / 7)
          var needed = (600 - Math.min(night, 600) + 2400 - Math.min(day, 2400)) / weeks / 60;
          needed = Math.round((needed + Number.EPSILON) * 100) / 100
          this.setState({ hoursneeded: String(needed) })
        }
      }

    }
  }
  static navigationOptions = { headerMode: 'none', gestureEnabled: false };
  _renderItem = ({ item }) => {
    const rightButtons = [
      <TouchableHighlight style={{ backgroundColor: 'blue', height: '100%', justifyContent: 'center', }} onPress={() => this.edit(item)}><Text style={{ color: 'white', paddingLeft: entireScreenHeight / 30 }}>Edit</Text></TouchableHighlight>,
      <TouchableHighlight style={{ backgroundColor: 'red', height: '100%', justifyContent: 'center', }} onPress={() => this.deleteNote(item)}><Text style={{ color: 'white', paddingLeft: entireScreenHeight / 50 }}>Delete</Text></TouchableHighlight>,
    ];

      var f = false
      if (first) {
        f = true;
        first = false;
      }
      return (
        <Swipeable rightButtons={rightButtons} rightButtonWidth={entireScreenWidth / 5} bounceOnMount={f}>
          <ListItem style={{ marginLeft: 0, backgroundColor: 'transparent' }}>
            <Body>
              <Text style={{ flex: 1, fontFamily: 'WSB', color: 'white' }}>{item.hours} hours</Text>
              <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>Event Name: {item.name}</Text>
            </Body>
          </ListItem>
        </Swipeable >
      );
    };
  render() {

    var ree;
    const onPress = () => {
      this.props.navigation.navigate('Main')
    }

    if (entireScreenWidth >= 0.92 * entireScreenHeight * 4 / 9 * 1524 / 1200) {
      ree = rem;
    }
    else {
      ree = 1.75 * wid;
    }

    if (global.logs.length == 0) {
      return (

        <View style={styles.container}>
          <ImageBackground source={require('../assets/login.png')} style={styles.image}>
            <View style={{ flex: 1, width: '90%', alignItems: 'center' }}>
              <Image source={require('../assets/pastdrives.png')} style={{
                height: '100%',
                width: '84%',
                marginTop: '10%',
                flex: 1,
              }} resizeMode="contain"></Image>
            </View>
            <View style={{ width: '100%', flex: 6, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 25 * wid, color: 'white', fontFamily: 'WSB' }}>Please create your first log!</Text>
            </View>
            <View style={{
              width: '73%',
              flex: 1,
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                style={{
                  height: entireScreenWidth * 0.73 * 276 / 1096,
                  width: '100%',
                }}
                onPress={onPress}
                disabled={this.state.loading}

              >
                <Image source={require('../assets/backbut.png')} style={{
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
    else {
      return (

        <View style={styles.container}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Creating Your Driving Log...'}
            textStyle={styles.spinnerTextStyle}
          />
          <ImageBackground source={require('../assets/login.png')} style={styles.image}>
            <View style={{ flex: 1, width: '90%', alignItems: 'center' }}>
              <Image source={require('../assets/pastdrives.png')} style={{
                height: '100%',
                width: '100%',
                marginTop: '10%',
                flex: 1,
              }} resizeMode="contain"></Image></View>
            <View style={{ width: '100%', flex: 6 }}>
              <FlatList style={{ width: '100%' }}
                data={this.state.data}
                renderItem={this._renderItem}
                keyExtractor={item => item.id}
                scrollEnabled={!this.state.isSwiping}
              // stickyHeaderIndices={this.state.stickyHeaderIndices}
              />
            </View>
            <View style={{
              width: '73%',
              flex: 1,
              paddingBottom: '2%',
              paddingTop: '2%',
              justifyContent: 'center',
              alignItems: 'center'

            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  width: entireScreenHeight / 8 * 0.96,
                }}
                onPress={onPress}
                disabled={this.state.loading}

              >
                <Image source={require('../assets/backbut.png')} style={{
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
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0, top: 0, position: 'absolute'

  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  topcard: {
    height: '85%', width: '90%', backgroundColor: '#D0D0D0', borderRadius: 25, shadowColor: "#000",
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },

  midcard: {
    height: '90%', width: '90%', backgroundColor: '#D0D0D0', borderRadius: 25, shadowColor: "#000",
    flexDirection: 'row', alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },
  midcard2: {
    height: '90%', width: '90%', backgroundColor: '#D0D0D0', borderRadius: 25, shadowColor: "#000",
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  }

});