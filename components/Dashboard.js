import * as React from 'react';
import { View, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert, Dimensions, AsyncStorage, Text, ScrollView } from 'react-native';
import moment from 'moment';
import * as Progress from 'react-native-progress';
import DatePicker from 'react-native-datepicker';
import { NavigationActions, StackActions } from 'react-navigation'






export default class Login extends React.Component {
  state = {
    license: '',
    progress1: 0,
    progress2: 0,
    date: '',
    hoursneeded: '-',
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
  render() {

    const entireScreenHeight = Dimensions.get('window').height;
    const rem = entireScreenHeight / 380;
    const entireScreenWidth = Dimensions.get('window').width;
    const wid = entireScreenWidth / 380;
    var ree;
    const onPress = () => {
      this.props.navigation.navigate('Main')
    }
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
              await AsyncStorage.removeItem('date');
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
    if (entireScreenWidth >= 0.92 * entireScreenHeight * 4 / 9 * 1524 / 1200) {
      ree = rem;
    }
    else {
      ree = 1.75 * wid;
    }

    return (

      <View style={styles.container}>

        <ImageBackground source={require('../assets/login.png')} style={styles.image}>
          <View style={{ flex: 16, width: '100%', alignItems: 'center', marginTop: entireScreenHeight * 0.04, justifyContent: 'center' }}>
            <View style={styles.topcard}>
              <TouchableOpacity style={{ flex: 1, width: '100%', alignItems: 'center' }} onPress={() => {
                Alert.alert("Detailed Drive Data", "Total Hours: " + Math.abs((global.totalhrs + global.totalmins / 60)).toFixed(3) + "\n" + "Day Hours: " + Math.abs(((global.totalhrs + global.totalmins / 60) - (global.nighthrs + global.nightmins / 60))).toFixed(3) + "\n" + "Night Hours: " + Math.abs((global.nighthrs + global.nightmins / 60)).toFixed(3) + "\n" + "Local Road Hours: " + Math.abs(global.local).toFixed(3) + "\n" + "Highway Hours: " + Math.abs(global.highway).toFixed(3) + "\n" + "Tollway Hours: " + Math.abs(global.tollway).toFixed(3) + "\n" + "Urban Hours: " + Math.abs(global.urban).toFixed(3) + "\n" + "Rural Hours: " + Math.abs(global.rural).toFixed(3) + "\n" +
                  "Parking Lot Hours: " + Math.abs(global.plot).toFixed(3) + "\n" + "Sunny Hours: " + Math.abs(global.sunny).toFixed(3) + "\n" + "Rain Hours: " + Math.abs(global.rain).toFixed(3) + "\n" + "Snow Hours: " + Math.abs(global.snow).toFixed(3) + "\n" + "Fog Hours: " + Math.abs(global.fog).toFixed(3) + "\n" + "Hail Hours: " + Math.abs(global.hail).toFixed(3) + "\n" + "Sleet Hours: " + Math.abs(global.sleet).toFixed(3) + "\n" +
                  "Freezing Rain Hours: " + Math.abs(global.frain).toFixed(3)
                )
              }}>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', width: '90%', alignItems: 'flex-end' }}>
                  <Text style={{ marginTop: entireScreenHeight * 0.96 * 16 / 63 * 0.08, alignItems: 'center', textAlign: 'center', }} numberOfLines={1}>
                    <Text style={{ fontSize: Math.min(50 * wid, 30 * rem), fontFamily: 'WSR', color: 'white' }} >{global.totalhrs}</Text>
                    <Text style={{ fontSize: Math.min(25 * wid, 15 * rem), fontFamily: 'WSR', color: 'white' }}>{global.totalhrs == 1 ? "hour" : "hours"}</Text>
                    <Text style={{ fontSize: Math.min(50 * wid, 30 * rem), fontFamily: 'WSR', color: 'white' }}>{global.totalmins}</Text>
                    <Text style={{ fontSize: Math.min(25 * wid, 15 * rem), fontFamily: 'WSR', color: 'white' }}>{global.totalmins == 1 ? "minute" : "minutes"}</Text>
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Progress.Bar progress={this.state.progress1} width={entireScreenWidth * 0.8} animated={true} height={rem * 20} borderRadius={25} color='#BBE2FF' borderColor='#D0D0D0' unfilledColor='white' />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 12, width: '100%', alignItems: 'center' }}>
            <View style={styles.midcard}>
              <View style={{ height: '100%', flex: 2 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row' }}>
                  <Text style={{}}>
                    <Text style={{ fontSize: wid * 40, fontFamily: 'WSR', color: 'white' }}>{global.nighthrs}</Text>
                    <Text style={{ fontSize: wid * 20, fontFamily: 'WSR', color: 'white' }}>{global.nighthrs == 1 ? "hour" : "hours"}</Text>
                    <Text style={{ fontSize: wid * 40, fontFamily: 'WSR', color: 'white' }}>{global.nightmins}</Text>
                    <Text style={{ fontSize: wid * 20, fontFamily: 'WSR', color: 'white' }}>{global.nightmins == 1 ? "minute" : "minutes"}</Text>
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Progress.Bar progress={this.state.progress2} width={entireScreenWidth * 0.5} animated={true} height={rem * 15} borderRadius={25} color='#BBE2FF' borderColor='#D0D0D0' unfilledColor='white' />
                </View>
              </View>
              <View style={{ height: '90%', flex: 1 }}>
                <Image source={require('../assets/night.png')} style={{
                  height: '100%',
                  width: '90%',
                  flex: 1,
                }} resizeMode="contain"></Image>
              </View>
            </View>
          </View>
          <View style={{ flex: 12, width: '100%', alignItems: 'center' }}>
            <View style={styles.midcard2}>
              <View style={{ height: '100%', flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{}}>
                    <Text style={{ fontSize: wid * 22, fontFamily: 'WSR', color: 'white' }}>License Date:</Text>
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                  <View style={{ width: '80%', height: '80%', borderRadius: 10, backgroundColor: '#D0D0D0', borderColor: 'white', borderWidth: 2, marginBottom: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    {global.drives != null && <DatePicker
                      style={{ width: 120 * wid, marginBottom: 10 * ree, backgroundColor: 'transparent' }}
                      date={this.state.date}
                      mode="date"
                      minDate={moment().add(1, 'days').format("MM-DD-YYYY")}
                      maxDate = {moment().add(5, 'years').format("MM-DD-YYYY")}
                      format="MM-DD-YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      placeholder=' '

                      customStyles={{

                        dateInput: { borderWidth: 0, backgroundColor: 'transparent' },
                        dateText: {
                          fontSize: 20 * wid,
                          color: 'white',
                          fontFamily: 'WSR'
                        }
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={(date) => {
                        this.setState({ date: date });
                        AsyncStorage.setItem('date', date);
                        var a = moment();
                        var b = moment(date, 'MM-DD-YYYY')
                        var total = global.totalhrs * 60 + global.totalmins;
                        var night = global.nighthrs * 60 + global.nightmins;
                        var day = total - night;
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
                            //    // console.log(hrs)
                            const weeks = Math.round(hrs / 7)
                            var needed = (600 - Math.min(night, 600) + 2400 - Math.min(day, 2400)) / weeks / 60;
                            needed = Math.round((needed + Number.EPSILON) * 100) / 100
                            this.setState({ hoursneeded: String(needed) })
                          }
                        }
                      }
                      }

                    />}
                  </View>
                </View>
              </View>
              <View style={{ height: '90%', flex: 0.05, alignItems: 'center', justifyContent: 'center' }}>
                <Progress.Bar progress={0} width={entireScreenWidth * 0.9 * 0.1 / 2.1 * 0.5} animated={true} height={rem * 46} borderRadius={25} color='#BBE2FF' borderColor='#D0D0D0' unfilledColor='white' />
              </View>
              <View style={{ height: '90%', flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row' }}>
                  <Text style={{}}>
                    <Text style={{ fontSize: wid * 17, fontFamily: 'WSR', color: 'white' }}>Hours Per Week:</Text>
                  </Text>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ marginTop: '0%' }}>
                    <Text style={{ fontSize: wid * 50, fontFamily: 'WSR', color: 'white' }}>{this.state.hoursneeded}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 15, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <View style={[styles.topcard, { height: '100%' }]}>
              <View style={{ flex: 1, alignItems: 'center', maxWidth: '90%' }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Text style={{ fontSize: Math.min(wid * 25,rem*18), fontFamily: 'WSB', color: 'white' }}>Teacher Comments: </Text>
                </View>
                <View style={{ flex: 4 }}>
                  <ScrollView style={{ width: '100%', flex: 4 }} bounces={false}>
                    <Text style={{ fontSize: wid * 25, fontFamily: 'WSR', color: 'white' }}>{global.comments}</Text>
                  </ScrollView>
                </View>
              </View>

            </View>
          </View>
          <View style={{
            width: '100%',
            flex: 8,
            paddingBottom: '2%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

          }}>
            <View style={{ flex: 1, height: '100%', alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={{
                  height: '90%',
                  width: entireScreenHeight / 8 * 0.9 * 0.98,
                  marginTop: '5%',
                  marginRight: '10%'
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
            <View style={{ flex: 1, height: '100%' }}>
              <TouchableOpacity
                style={{
                  height: '90%',
                  width: entireScreenHeight / 8 * 0.9 * 0.98,
                  marginTop: '5%',
                  marginLeft: '10%'
                }}
                onPress={onPress2}
                disabled={this.state.loading}

              >
                <Image source={require('../assets/logout.png')} style={{
                  height: '100%',
                  width: '100%',
                  flex: 1


                }} resizeMode="contain"></Image>
              </TouchableOpacity>
            </View>
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