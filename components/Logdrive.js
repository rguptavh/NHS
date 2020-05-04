import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import Spinner from 'react-native-loading-spinner-overlay';


export default class Login extends React.Component {

  state = {
    date: moment().format("MM-DD-YYYY"),
    minutes: global.minutes,
    event: '',
    loading: false
  };


  static navigationOptions = { headerMode: 'none', gestureEnabled: false };
  render() {
    const placeholder = {
      label: 'Select an event...',
      value: null,
      color: '#9EA0A4',
    };

    const entireScreenHeight = Dimensions.get('window').height;
    const rem = entireScreenHeight / 380;
    const entireScreenWidth = Dimensions.get('window').width;
    const wid = entireScreenWidth / 380;
    var ree;
    // console.log(global.uname);
    // console.log(global.minutes);

    if (entireScreenWidth >= entireScreenHeight * 3 / 4 * 1360 / 2360 * 0.9) {
      ree = rem;
    }
    else {
      ree = 1.75 * wid;
    }
    const pickerStyle = {
      inputIOS: {
        color: 'black',
        alignSelf: 'center',
        fontSize: 12 * ree,
        paddingBottom: 3 * ree,
        height: '100%',
        width: '95%',
        textAlign: 'center'
      },
      inputAndroid: {
        color: 'black',
        alignSelf: 'center',
        fontSize: 12 * ree,
        paddingBottom: 3 * ree,
        height: '100%',
        width: '95%',
        textAlign: 'center'

      },
      placeholder: {
        color: 'red',
        fontSize: 12 * ree,
      },

    };
    const onPress = () => {
      var uname = String(global.username);
      var date = String(this.state.date);
      var minutes = parseInt(String(this.state.minutes));
      var event = String(this.state.event);
      if (uname == '') {
        alert("Please log in again");
      }

      else if (date != '' && event != '' && !isNaN(minutes)) {

        if (minutes == '0') {
          alert("Can't log 0 minutes")
        }
        else {




          this.setState({ loading: true });
          const Http = new XMLHttpRequest();
          const url = 'https://script.google.com/macros/s/AKfycbxMNgxSn85f9bfVMc5Ow0sG1s0tBf4d2HwAKzASfCSuu9mePQYm/exec';
          var data = "?username=" + global.uname + "&date=" + date + "&minutes=" + minutes+"&event="+event+"&action=addhours";
          console.log(data);
          Http.open("GET", String(url + data));
          Http.send();
          var ok;
          Http.onreadystatechange = (e) => {
            ok = Http.responseText;
            if (Http.readyState == 4) {

              // console.log(String(ok));
              //var response = String(ok).split(",");
              // console.log(response.join(","))
              if (ok == "true") {
                var temp = global.hours + global.minutes / 60;
                temp += minutes / 60;
                global.hours = Math.floor(parseFloat(temp));
                global.minutes = Math.round((parseFloat(temp) - global.hours) * 60);
                var temp = global.logs
                temp.push({date: date, hours:""+(minutes/60).toFixed(2),name:event,type:'Log'})
                temp = temp.sort((a, b) => moment(b.date, 'MM-DD-YYYY').format('X') - moment(a.date, 'MM-DD-YYYY').format('X'))
                global.logs = temp;
                console.log(global.hours);
                console.log(global.minutes);
                /*var data = [];
                for (var x = 0; x < (response.length - 1) / 7; x++) {
                  data.push({
                    description: response[7 * x + 1],
                    tod: response[7 * x + 2],
                    date: response[7 * x + 3],
                    time: response[7 * x + 4],
                    minutes: response[7 * x + 5],
                    road: response[7 * x + 6],
                    weather: response[7 * x + 7],
                    id: "" + x,
                    header: false
                  }
                  )
                }
                // console.log(JSON.stringify(data))
                data = data.sort((a, b) => moment(b.date + " " + b.time, 'MM-DD-YYYY h:mm A').format('X') - moment(a.date + " " + a.time, 'MM-DD-YYYY h:mm A').format('X'))
                const map = new Map();
                let result = [];
                for (const item of data) {
                  if (!map.has(item.date)) {
                    map.set(item.date, true);    // set any value to Map
                    result.push(item.date);
                  }
                }
                const length = data.length;
                const length2 = result.length;
                for (i = 0; i < data.length; i++) {
                  if (result.includes(data[i].date)) {
                    result.shift();
                    // console.log(result)
                    const he = {
                      header: true,
                      description: 'HEADER',
                      tod: 'HEADER',
                      time: 'HEADER',
                      minutes: 'HEADER',
                      road: 'HEADER',
                      weather: 'HEADER',
                      id: "" + (length + (length2 - result.length)),
                      date: data[i].date
                    }
                    data.splice(i, 0, he);
                  }
                }
                data.unshift({
                  description: "EXPORT",
                  tod: "EXPORT",
                  date: "EXPORT",
                  time: "EXPORT",
                  minutes: "EXPORT",
                  road: "EXPORT",
                  weather: "EXPORT",
                  id: "" + (data.length+1),
                  header: true
                });
                global.drives = data;
                // console.log(JSON.stringify(data))*/
                alert("Success!");
                this.props.navigation.replace('Main')

              }
              else if (ok == "false") {
                alert("Failed login");
              }
              else {
                console.log(ok);
                alert("Server error");
              }
              this.setState({ loading: false });
            }
          }
        }
      }
      else {
        alert("Please fill all fields");
      }
    }
    const onPress2 = () => {
      global.minutes = '';
      this.props.navigation.navigate('Main')
    }
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View style={styles.container}>
        <Spinner
            visible={this.state.loading}
            textContent={'Adding Log...'}
            textStyle={styles.spinnerTextStyle}
          />
          <ImageBackground source={require('../assets/login.png')} style={styles.image}>
            <View style={{ flex: 1, width: '90%', alignItems: 'center' }}>
              <Image source={require('../assets/drivelog.png')} style={{
                height: '100%',
                width: '84%',
                marginTop: '10%',
                flex: 1,
              }} resizeMode="contain"></Image></View>
            <ImageBackground source={require('../assets/bigform.png')} style={{
              alignItems: 'center',
              flex: 6,
              width: '100%'
            }} resizeMode="contain">

              <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <DatePicker
                  style={{ width: 250 * wid, marginTop: 10 * ree }}
                  date={this.state.date}
                  mode="date"
                  maxDate={moment().format("MM-DD-YYYY")}
                  minDate="01-01-2018"
                  format="MM-DD-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  customStyles={{

                    dateInput: { borderWidth: 0 },
                    dateText: {
                      fontSize: 12 * rem,
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ date: date }) }}
                />
              </View>
  
              <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                  style={{ fontSize: 12 * rem, width: 200 * wid, marginTop: 0 * ree, }}
                  textAlign={'center'}
                  onChangeText={(value) => this.setState({ minutes: value })}
                  keyboardType='number-pad'
                  value={this.state.minutes}
                  maxLength={3}

                />
              </View>
              <View style={{ flex: 1, width: entireScreenHeight*3/4*1360/2360, }}>
                <RNPickerSelect
                  style={pickerStyle}
                  //  placeholderTextColor="red"
                  useNativeAndroidPickerStyle={false}
                  placeholder={placeholder}
                  onValueChange={(value) => this.setState({ event: value })}
                  items={global.options}

                />
              </View>



            </ImageBackground>
            <View style={{
              width: '95%',
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <TouchableOpacity
                style={{
                  height: entireScreenWidth * 0.73 * 276 / 1096,
                  width: '100%', flex: 1
                }}
                onPress={onPress2}
                disabled={this.state.loading}


              >
                <Image source={require('../assets/cancelbut.png')} style={{
                  height: '100%',
                  width: '100%',
                  flex: 1


                }} resizeMode="contain"></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: entireScreenWidth * 0.73 * 276 / 1096,
                  width: '100%', flex: 1
                }}
                onPress={onPress}
                disabled={this.state.loading}

              >
                <Image source={require('../assets/savebut.png')} style={{
                  height: '100%',
                  width: '100%',
                  flex: 1


                }} resizeMode="contain"></Image>
              </TouchableOpacity>
            </View>

          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
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
  imagefront: {
    marginTop: '8%',
    height: '25%',
    width: '80%',
    flex: 2,

  },
  spinnerTextStyle: {
    color: '#FFF',
    top: 60
  },

});