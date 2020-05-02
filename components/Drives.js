import React from "react";
import { FlatList, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, View, Image, Alert, TouchableHighlight, Linking } from "react-native";
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base";
import moment from 'moment';
import Swipeable from 'react-native-swipeable-row';
import * as WebBrowser from 'expo-web-browser';
import Spinner from 'react-native-loading-spinner-overlay';


const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
let first = true;
let first2 = true;

export default class App extends React.Component {
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      data: global.drives,
      spinner: false
    };
  }
  export() {
    this.setState({ spinner: true })
    const Http = new XMLHttpRequest();
    const url = 'https://script.google.com/macros/s/AKfycbz21dke8ZWXExmF9VTkN0_3ITaceg-3Yg-i17lO31wtCC_0n00/exec';
    var data = "?username=" + global.uname + "&action=export";
    Http.open("GET", String(url + data));
    Http.send();
    var ok;
    Http.onreadystatechange = (e) => {
      ok = String(Http.responseText);
      if (Http.readyState == 4) {
        this.setState({ spinner: false })
        WebBrowser.openBrowserAsync(ok);
      }
    }
  }
  edit(item) {

    var temp = this.state.data;
    global.drives = temp;
    this.setState({ data: temp });
    global.olddate = String(item.date);
    global.oldtime = String(item.time);
    global.oldminutes = String(item.minutes);
    global.olddescription = String(item.description).trim().replace(/\n/g, " ");
    global.oldroad = item.road;
    global.oldnight = item.tod;
    global.oldweather = item.weather;
    global.oldid = item.id;
    this.props.navigation.navigate('Edit');


  }

  deleteNote(item) {
    Alert.alert(
      "Delete Drive",
      "Are you sure you want to delete your drive?",
      [
        {
          text: "No"
        },
        {
          text: "Yes", onPress: () => {
            var temp = this.state.data;
            for (i = 0; i < temp.length; i++) {
              if (temp[i].id == item.id) {
                temp.splice(i, 1);
                break;
              }
            }
            let result = [];
            const map = new Map();
            for (const item of temp) {
              if (!map.has(item.date) && !item.header) {
                map.set(item.date, true);    // set any value to Map
                result.push(item.date);
              }
            }
            for (i = 0; i < temp.length; i++) {
              if (temp[i].header && !result.includes(temp[i].date) && temp[i].description != 'EXPORT') {
                temp.splice(i, 1);
                break;
              }
            }
            global.drives = temp;
            this.setState({ data: temp });
            var date = String(item.date);
            var time = String(item.time);
            var minutes = parseInt(String(item.minutes));
            var description = String(item.description).trim().replace(/\n/g, " ");
            var road = item.road;
            var night = item.tod;
            var weather = item.weather;
            var temp = global.totalhrs + global.totalmins / 60;
            temp -= minutes / 60;
            global.totalhrs = Math.floor(parseFloat(temp));
            global.totalmins = Math.round((parseFloat(temp) - global.totalhrs) * 60);

            if (night == 'Night') {
              temp = global.nighthrs + global.nightmins / 60;
              temp -= minutes / 60
              global.nighthrs = Math.floor(parseFloat(temp));
              global.nightmins = Math.round((parseFloat(temp) - global.nighthrs) * 60);
            }
            if (road == 'Local')
              global.local -= (minutes / 60);
            else if (road == 'Highway')
              global.highway -= (minutes / 60);
            else if (road == 'Tollway')
              global.tollway -= (minutes / 60);
            else if (road == 'Urban')
              global.urban -= (minutes / 60);
            else if (road == 'Rural')
              global.rural -= (minutes / 60);
            else
              global.plot -= (minutes / 60);

            if (weather == 'Sunny')
              global.sunny -= (minutes / 60);
            else if (weather == 'Rain')
              global.rain -= (minutes / 60);
            else if (weather == 'Snow')
              global.snow -= (minutes / 60);
            else if (weather == 'Fog')
              global.fog -= (minutes / 60);
            else if (weather == 'Hail')
              global.hail -= (minutes / 60);
            else if (weather == 'Sleet')
              global.sleet -= (minutes / 60);
            else
              global.frain -= (minutes / 60);

            const Http = new XMLHttpRequest();
            const url = 'https://script.google.com/macros/s/AKfycbz21dke8ZWXExmF9VTkN0_3ITaceg-3Yg-i17lO31wtCC_0n00/exec';
            var data = "?username=" + global.uname + "&date=" + date + "&time=" + time + "&description=" + description + "&tod=" + night + "&time=" + time + "&minutes=" + minutes + "&road=" + road + "&weather=" + weather + "&action=delete";
          //  // console.log(data);
            Http.open("GET", String(url + data));
            Http.send();
            var ok;
            Http.onreadystatechange = (e) => {
              ok = Http.responseText;
              if (Http.readyState == 4) {
                if (String(ok) == "Success") {

                }
                else {
                  alert("Failed to delete on server, please try again later");
                }
              }
            }
          }
        }
      ],
      { cancelable: false }
    );
  }

  _renderItem = ({ item }) => {
    const rightButtons = [
      <TouchableHighlight style={{ backgroundColor: 'blue', height: '100%', justifyContent: 'center', }} onPress={() => this.edit(item)}><Text style={{ color: 'white', paddingLeft: entireScreenHeight / 30 }}>Edit</Text></TouchableHighlight>,
      <TouchableHighlight style={{ backgroundColor: 'red', height: '100%', justifyContent: 'center', }} onPress={() => this.deleteNote(item)}><Text style={{ color: 'white', paddingLeft: entireScreenHeight / 50 }}>Delete</Text></TouchableHighlight>,
    ];
    if (item.header) {
      if (item.description == "EXPORT"){
        return (
          <View style={{backgroundColor: '#acb5b5', width: '100%', flex: 1}}>
          
        <ListItem>
        <TouchableOpacity style = {{flex:1, width:'100%'}} onPress={() => this.export()}>
          <Body style={{ marginRight: 0, alignItems: 'center' }}>
            <Text style={{ fontWeight: "bold" }}>EXPORT YOUR DRIVES</Text>
          </Body>
          </TouchableOpacity>
        </ListItem>
       
        </View>
        );
      }
      else{
      return (

        <ListItem itemDivider>
          <Body style={{ marginRight: 0, alignItems: 'center' }}>
            <Text style={{ fontWeight: "bold" }}>
              {moment(item.date, 'MM-DD-YYYY').format('MMMM Do, YYYY')}
            </Text>
          </Body>
        </ListItem>



      );
      }
    }
    else {
      var f = false
      if (first) {
        f = true;
        first = false;
      }
      return (
        <Swipeable rightButtons={rightButtons} rightButtonWidth={entireScreenWidth / 5} bounceOnMount={f}>
          <ListItem style={{ marginLeft: 0, backgroundColor: 'transparent' }}>
            <Body>
              <Text style={{ flex: 1, fontFamily: 'WSB', color: 'white' }}>{item.minutes} minutes</Text>
              <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.description}</Text>
              <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.tod} - {item.road} - {item.weather} - {item.time}</Text>
            </Body>
          </ListItem>
        </Swipeable >
      );
    }
  };
  static navigationOptions = { headerMode: 'none', gestureEnabled: false };
  render() {
    //// console.log(global.drives)
    const onPress = () => {
      this.props.navigation.navigate('Main')
    }
    

    
  //  // console.log(JSON.stringify(global.drives))
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
    if (global.drives.length == 1) {
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
              <Text style={{ fontSize: 25 * wid, color: 'white', fontFamily: 'WSB' }}>Please log your first drive!</Text>
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