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
      const url = 'https://script.google.com/macros/s/AKfycbz21dke8ZWXExmF9VTkN0_3ITaceg-3Yg-i17lO31wtCC_0n00/exec';
      var data = "?username=" + uname + "&password=" + pword + "&action=login";
      Http.open("GET", String(url + data));
      Http.send();
      var ok;
      Http.onreadystatechange = (e) => {
        ok = Http.responseText;
        if (Http.readyState == 4) {
          // console.log(String(ok));
          var response = String(ok).split(",");
          // console.log(response.join(","))
          if (response[0] == "true") {

            global.uname = this.state.username;
            AsyncStorage.setItem('username', this.state.username);
            var data = [];
            global.comments = response[1];
            global.totalhrs = Math.floor(parseFloat(response[2]));
            global.totalmins = Math.round((parseFloat(response[2]) - global.totalhrs) * 60);
            global.day = response[3];
            global.nighthrs = Math.floor(parseFloat(response[4]));
            global.nightmins = Math.round((parseFloat(response[4]) - global.nighthrs) * 60);
            global.local = parseFloat(response[5]);
            global.highway = parseFloat(response[6]);
            global.tollway = parseFloat(response[7]);
            global.urban = parseFloat(response[8]);
            global.rural = parseFloat(response[9]);
            global.plot = parseFloat(response[10]);
            global.sunny = parseFloat(response[11]);
            global.rain = parseFloat(response[12]);
            global.snow = parseFloat(response[13]);
            global.fog = parseFloat(response[14]);
            global.hail = parseFloat(response[15]);
            global.sleet = parseFloat(response[16]);
            global.frain = parseFloat(response[17]);
            response.splice(1, 17);
            // console.log(response.toString());

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
            // console.log(JSON.stringify(data))
            this.setState({ loading: false });
            this.props.navigation.replace('Main')

          }
          else if (response[0] == "false") {
            alert("Failed login");
            this.setState({ loading: false });
          }
          else {
            alert("Server error");
            this.setState({ loading: false });
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
            <Image source={require('../assets/dtime.png')} style={{
              height: '5%',
              width: '74%',
              flex: 1,
            }} resizeMode="contain"></Image>
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
    flex: 2,

  },
  spinnerTextStyle: {
    color: '#FFF',
    top: 60
  },

});
