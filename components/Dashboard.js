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
    ongoing: global.ongoing,
    specific: global.specific,
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
   validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
  
  static navigationOptions = { headerMode: 'none', gestureEnabled: false };
  _renderItem = ({ item }) => {

      var f = false
      if (first) {
        f = true;
        first = false;
      }
      return (
      
          <ListItem style={{ marginLeft: 0, backgroundColor: 'transparent' }}>
            <Body>
            <Text style={{ flex: 1, fontFamily: 'WSB', color: 'white' }}>{item.name}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.address}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.contact}</Text>
            </Body>
          </ListItem>
      );
    };
    _renderItem2 = ({ item }) => {

  
        var f = false
        if (first) {
          f = true;
          first = false;
        }
        return (
      
            <ListItem style={{ marginLeft: 0, backgroundColor: 'transparent' }}>
              <Body>
              <Text style={{ flex: 1, fontFamily: 'WSB', color: 'white' }}>{item.name}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.address}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.contact}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.start} to {item.end} on {item.date}</Text>
              </Body>
            </ListItem>
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
              <View style = {{width:'100%', flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text style={{ fontSize: Math.min(25 * wid, 16 * rem), fontFamily: 'WSBB', color: 'white' }}>Ongoing Opportunities</Text>
              </View>
              <View style = {{width:'100%', flex:4}}>
              
              <FlatList style={{ width: '100%' }}
                data={this.state.ongoing}
                renderItem={this._renderItem}
                keyExtractor={item => item.id}
                scrollEnabled={!this.state.isSwiping}
              // stickyHeaderIndices={this.state.stickyHeaderIndices}
              />
              </View>
              <View style = {{width:'100%', flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text style={{ fontSize: Math.min(25 * wid, 16 * rem), fontFamily: 'WSBB', color: 'white' }}>Specific Opportunities</Text>
              </View>
              <View style = {{width:'100%', flex:4}}>
              
              <FlatList style={{ width: '100%' }}
                data={this.state.specific}
                renderItem={this._renderItem2}
                keyExtractor={item => item.id}
                scrollEnabled={!this.state.isSwiping}
              // stickyHeaderIndices={this.state.stickyHeaderIndices}
              />
              </View>
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