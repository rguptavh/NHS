import React from "react";
import { FlatList, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, View, Image, Alert, TouchableHighlight, Linking } from "react-native";
import { Text, ListItem, Body} from "native-base";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';


const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
let first = true;

export default class App extends React.Component {
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      data: global.logs,
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



  _renderItem = ({ item }) => {
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
          <ListItem style={{ marginLeft: 0, backgroundColor: 'transparent' }}>
            <Body>
            <Text style={{ flex: 1, fontFamily: 'WSB', color: 'white' }}>Event Name: {item.name}</Text>
              <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.hours} {item.hours == 1 ? "hour" : "hours"}</Text>
              <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.description}</Text>
              
            </Body>
          </ListItem>
      );
    }
  };
  static navigationOptions = { headerMode: 'none', gestureEnabled: false, };
  render() {
    //// console.log(global.logs)
    const onPress = () => {
      this.props.navigation.navigate('Main')
    }
    

    
  //  // console.log(JSON.stringify(global.logs))
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
    if (global.logs.length == 0) {
      return (

        <View style={styles.container}>
          <ImageBackground source={require('../assets/login.png')} style={styles.image}>
            <View style={{ flex: 2, width: '90%', alignItems: 'center' }}>
              <Image source={require('../assets/pastVol.png')} style={{
                height: '100%',
                width: '90%',
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
              <Image source={require('../assets/pastVol.png')} style={{
                height: '75%',
                width: '90%',
                marginTop: '8%',
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