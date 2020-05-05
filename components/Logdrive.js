import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Image, ImageBackground, TouchableOpacity, Dimensions, Text, KeyboardAvoidingView } from 'react-native';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import Spinner from 'react-native-loading-spinner-overlay';


export default class Login extends React.Component {

  state = {
    date: moment().format("MM-DD-YYYY"),
    minutes: "",
    event: '',
    loading: false,
    size: 50,
    description: ''
  };

  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;

  }
  static navigationOptions = { headerMode: 'none', gestureEnabled: false };
  render() {
    const placeholder = {
      label: 'Select an event...',
      value: 'Select an event...',
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

    const onPress = () => {
      var uname = String(global.username);
      var date = String(this.state.date);
      var minutes = parseInt(String(this.state.minutes));
      var event = String(this.state.event);
      var description = String(this.state.description)
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
          var data = "?username=" + global.uname + "&date=" + date + "&minutes=" + minutes + "&event=" + event +  "&description=" + description + "&action=addhours";
          console.log(data);
          Http.open("GET", String(url + data));
          Http.send();
          var ok;
          Http.onreadystatechange = (e) => {
            ok = Http.responseText;
            if (Http.readyState == 4) {
              if (ok == "true") {
                var temp = global.hours + global.minutes / 60;
                temp += minutes / 60;
                global.hours = Math.floor(parseFloat(temp));
                global.minutes = Math.round((parseFloat(temp) - global.hours) * 60);
                var temp = global.logs
                temp.push({ date: date, hours: "" + (minutes / 60).toFixed(2), name: event, description: description, type: 'Log' })
                temp = temp.sort((a, b) => moment(b.date, 'MM-DD-YYYY').format('X') - moment(a.date, 'MM-DD-YYYY').format('X'))
                global.logs = temp;
                console.log(global.hours);
                console.log(global.minutes);
                this.setState({ loading: false });
                setTimeout(() => { alert("Success!"); this.props.navigation.replace('Main');}, 100);
                

              }
              else {
                console.log(ok);
                this.setState({ loading: false });
                setTimeout(() => { alert("Server error");}, 100);
                
              }
              
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
    const pickerStyle = {
      inputIOS: {
        color: 'black',
        alignSelf: 'center',
        fontSize: Math.min(this.state.size,rem*15),
        height: '100%',
        width: '100%',
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
        fontSize: Math.min(32*wid,rem*15),
      },

    };
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View style={styles.container}>
          <Spinner
            visible={this.state.loading}
            textContent={'Adding Log...'}
            textStyle={styles.spinnerTextStyle}
          />
          <ImageBackground source={require('../assets/login.png')} style={styles.image}>
            <View style={{ flex: 1, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'WSBB', fontSize: wid * 32, color: 'white', marginTop: '10%' }} >Log Volunteer Hours</Text>
            </View>
            <View style={{
              alignItems: 'center',
              flex: 5,
              width: '90%',
              backgroundColor: "#D1DAE7",
              borderRadius: 20,
              justifyContent: 'center',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.30,
              shadowRadius: 4.65,

              elevation: 8,
            }}>
              <View style={{ width: '100%', height: '95%', alignItems: 'center' }}>
                <View style={{ flex: 1, width: '90%', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Noto', color: '#3C5984', fontSize: rem * 15 }}>Event</Text>
                </View>
                <View style={{
                  width: '90%',
                  flex: 1.5,
                  borderColor: '#3C5984',
                  borderWidth: 2,
                  borderRadius: 15
                }}>
                  <RNPickerSelect
                    style={pickerStyle}
                    //  placeholderTextColor="red"
                    useNativeAndroidPickerStyle={false}
                    placeholder={placeholder}
                    onValueChange={(value) => this.setState({ event: value, size:wid*(50-value.length)})}
                    items={global.options}

                  />
                </View>

                <View style={{ width: '100%', flex: 0.4 }}></View>
                <View style={{ flex: 1, width: '90%', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Noto', color: '#3C5984', fontSize: rem * 15 }}>Date</Text>
                </View>
                <View style={{
                  width: '90%',
                  flex: 1.5,
                  borderColor: '#3C5984',
                  borderWidth: 2,
                  borderRadius: 15,
                  justifyContent:'center'
                }}>
                  <DatePicker
                  style={{ height:'100%', width: '100%', justifyContent:'center'}}
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
                      fontSize: Math.min(32*wid,rem*15),
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ date: date }) }}
                /></View>
                <View style={{ width: '100%', flex: 0.4 }}></View>
                <View style={{ flex: 1, width: '90%', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Noto', color: '#3C5984', fontSize: rem * 15 }}>Minutes</Text>
                </View>
                <View style={{
                  width: '90%',
                  flex: 1.5,
                  borderColor: '#3C5984',
                  borderWidth: 2,
                  borderRadius: 15
                }}>
                  <TextInput
                    style={{ fontSize: Math.min(32*wid,rem*15), width: '100%', height: '100%' }}
                    textAlign={'center'}
                    onChangeText={(value) => this.setState({ minutes: value })}
                    keyboardType='number-pad'
                    value={this.state.minutes}
                    maxLength={3}

                  /></View>
                <View style={{ width: '100%', flex: 0.4 }}></View>
                <View style={{ flex: 1, width: '90%', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Noto', color: '#3C5984', fontSize: rem * 15 }}>Description</Text>
                </View>
                <View style={{
                  width: '90%',
                  flex: 3,
                  borderColor: '#3C5984',
                  borderWidth: 2,
                  borderRadius: 15,
                  justifyContent:'flex-start'
                }}>
                  <TextInput
                    style={{ fontSize: Math.min(32*wid,rem*15), width: '100%', height: '100%' }}
                    textAlign={'center'}
                    maxLength={150}
                    onChangeText={(value) => {this.setState({ description: value })}}
                    value={this.state.description}
                    multiline={true}
                  /></View>
              </View>

            </View>
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
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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