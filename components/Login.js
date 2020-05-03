import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Image, ImageBackground, TouchableOpacity, Alert, Dimensions, AsyncStorage } from 'react-native';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';


export default class Login extends React.Component {
  state = {
    username: '',
    password: '',
    loading: false
  };

  static navigationOptions = { headerMode: 'none', gestureEnabled: false };
  render() {
    const entireScreenHeight = Dimensions.get('window').height;
    const rem = entireScreenHeight / 380;
    const entireScreenWidth = Dimensions.get('window').width;
    const wid = entireScreenWidth / 380;
    var ree;
    if (entireScreenWidth >= 0.92 * entireScreenHeight * 4 / 9 * 1524 / 1200) {
      ree = rem;
    }
    else {
      ree = 1.75 * wid;
    }
    const onPress = () => {
      var uname = this.state.username;
      var pword = this.state.password;
      this.setState({ loading: true });
      const Http = new XMLHttpRequest();
      const url = 'https://script.google.com/macros/s/AKfycbxMNgxSn85f9bfVMc5Ow0sG1s0tBf4d2HwAKzASfCSuu9mePQYm/exec';
      var data = "?username=" + uname + "&password=" + pword + "&action=login";
      Http.open("GET", String(url + data));
      Http.send();
      var ok;
      Http.onreadystatechange = (e) => {
        ok = Http.responseText;
        if (Http.readyState == 4) {
          console.log(String(ok));
          
          if (ok.substring(0,4) == "true"){
            // console.log(response.toString());
            global.uname = uname;
            var total = parseFloat(ok.substring(5,ok.indexOf(",",5)));
            global.hours = Math.floor(total);
            global.minutes = (total-global.hours)*60;
            var data = JSON.parse(ok.substring(ok.indexOf(",",5)+1,ok.length))
            
            // console.log(JSON.stringify(data))
            var ongoing = [];
            var specific = [];
            var log = [];
            for (var x=0; x<data.length;x++){
              if (data[x].type == "Log"){
                data[x]["id"] = x;
                log.push(data[x]);
              }
              else if (data[x].type == "Ongoing"){
                data[x]["id"] = x;
                ongoing.push(data[x]);
              }
              else if (data[x].type == "Specific"){
                data[x]["id"] = x;
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
            for (i = 0; i < log.length; i++) {
              if (result.includes(log[i].date)) {
                result.shift();
                // console.log(result)
                const he = {
                  header: true,
                  id: "" + (data.length+i),
                  date: log[i].date
                }
                log.splice(i, 0, he);
              }
            }

            global.ongoing = ongoing;
            global.specific = specific;
            global.logs = log;
            // console.log(JSON.stringify(data))
            this.setState({ loading: false });
            this.props.navigation.replace('Main')

          }
          else if (ok.substring(0,5) == "false") {
            this.setState({ loading: false });
            setTimeout(() => {  alert("Failed Login"); }, 100);

          }
          else {
            this.setState({ loading: false });
            setTimeout(() => {  alert("Server Error"); }, 100);
          }

        }
      }
    }
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>

        <View style={styles.container}>
          <Spinner
            visible={this.state.loading}
            textContent={'Logging in...'}
            textStyle={styles.spinnerTextStyle}
          />
          <ImageBackground source={require('../assets/login.png')} style={styles.image}>

            <Image source={require('../assets/vh.png')} style={styles.imagefront} resizeMode="contain"></Image>
            <ImageBackground source={require('../assets/form.png')} style={{
              alignItems: 'center',
              flex: 4,
              width: '100%',

            }} resizeMode="contain">
              <View style={{
                width: 200 * wid,
                flex: 1,
                justifyContent: 'flex-end'
              }}>
                <TextInput
                  style={{ fontSize: 12 * rem, width: 200 * wid, marginBottom: 24 * ree, }}
                  textAlign={'center'}
                  autoCapitalize='none'
                  autoCompleteType='off'
                  onChangeText={(value) => this.setState({ username: value })}
                  value={this.state.username}

                /></View>
              <View style={{
                width: 200 * wid,
                flex: 1,

              }}>
                <TextInput
                  style={{ fontSize: 12 * rem, width: 200 * wid, marginTop: ree * 37 }}
                  textAlign={'center'}
                  onChangeText={(value) => this.setState({ password: value })}
                  value={this.state.password}
                  secureTextEntry={true}
                />

              </View>
            </ImageBackground>
            <View style={{
              width: '73%',
              flex: 2,
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
                <Image source={require('../assets/logbut.png')} style={{
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
    marginTop: '9%',
    paddingTop:'5%',
    height: '25%',
    width: '80%',
    flex: 3,

  },
  spinnerTextStyle: {
    color: '#FFF',
    top: 60
  },

});
