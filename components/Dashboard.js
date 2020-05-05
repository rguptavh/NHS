import * as React from 'react';
import { View, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert, Dimensions, AsyncStorage, FlatList, TouchableHighlight, Linking } from 'react-native';
import moment from 'moment';
import { Text, ListItem,Body, Badge, Icon} from "native-base";
import * as WebBrowser from 'expo-web-browser';
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

   validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  open(item){
    if(this.validURL(item.description)){
      console.log("press")
      WebBrowser.openBrowserAsync(item.description);
    }
    else{
      if(item.type=='Specific'){
        if (item.signed == 'false'){
        Alert.alert(
          "Sign-Up",
          "Description: "+item.description+"\nAre you sure you want to sign-up for "+item.name+"?\nNOTE: You will have to email a NHS sponsor to cancel your sign-up",
          [
            {
              text: "No"
            },
            {
              text: "Yes", onPress: () => {
 

                this.setState({spinner: true})
                const Http = new XMLHttpRequest();
                const url = 'https://script.google.com/macros/s/AKfycbxMNgxSn85f9bfVMc5Ow0sG1s0tBf4d2HwAKzASfCSuu9mePQYm/exec';
                var data = "?username=" + global.uname + "&event="+item.name+"&action=signup";
              //  // console.log(data);
                Http.open("GET", String(url + data));
                Http.send();
                var ok;
                Http.onreadystatechange = (e) => {
                  ok = Http.responseText;
                  console.log(ok);
                  if (Http.readyState == 4) {
                    if (String(ok) == "true") {
                      this.setState({spinner: false})
                      setTimeout(() => { alert("You have been signed up for "+item.name);}, 100);
                      var temp = this.state.specific;
                      for (var x=0, l = temp.length; x<l;x++){
                        if (item.name == temp[x].name){
                          temp[x]["signed"] = "true";
                          break;
                        }
                      }
                      this.setState({specific: temp});
                    }
                    else if(String(ok) == "false"){
                      this.setState({spinner: false})
                      setTimeout(() => {  alert("You are already signed up for "+item.name);}, 100);
                    }
                    else if(String(ok) == "nospots"){
                      this.setState({spinner: false})
                      setTimeout(() => {  alert("Sorry, all the spots for " + item.name + " are taken");}, 100);
                    }
                    else{
                      this.setState({spinner: false})
                      setTimeout(() => {  alert("Failed to sign-up on server. Please try again.");}, 100);
                    }
                  }
                }
              }
            
            
          }
            ],
            { cancelable: false }
          );
          }
        else{
          alert("You are already signed up for "+item.name+"!");
        }
      }
      else{
        alert(item.description);

      }
    }
  }
  
  static navigationOptions = { headerMode: 'none', gestureEnabled: false };
  _renderItem = ({ item }) => {

      var f = false
      if (first) {
        f = true;
        first = false;
      }
      return (
      
          <ListItem style={{ marginLeft: 0, backgroundColor: 'transparent' }} iconRight iconStyle={{ color: "green" , marginLeft:'5%'}} >

            <TouchableOpacity onPress={() => this.open(item)} style = {{width:'90%'}}>

            <Body>

            <Text style={{ flex: 1, fontFamily: 'WSB', color: 'white' }}>{item.name}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.address}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.contact}</Text>
            </Body>
            </TouchableOpacity>
            
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
            <TouchableOpacity onPress={() => this.open(item)} style = {{width:'90%'}}>

              <Body>
              <Text style={{ flex: 1, fontFamily: 'WSB', color: 'white' }}>{item.name}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.address}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.contact}</Text>
                <Text style={{ flex: 1, fontFamily: 'WSR', color: 'white' }}>{item.start} to {item.end} on {item.date}</Text>
              </Body>
              </TouchableOpacity>
              {item.signed == 'true' ? <Icon name='ios-checkmark' style = {{marginLeft:'5%', color:'green'}}></Icon> : null}
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
            textContent={'Signing Up...'}
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
              <View style = {{width:'100%', flex:4, justifyContent: this.state.ongoing.length ==0 ? 'center' : 'flex-start'}}>
              
              {this.state.ongoing.length == 0 ? <Text style={{ fontSize: 30 * wid, color: 'white', fontFamily: 'WSB', alignSelf:'center', }}>No Ongoing Events</Text> :<FlatList style={{ width: '100%' }}
                data={this.state.ongoing}
                renderItem={this._renderItem}
                keyExtractor={item => item.id}
              // stickyHeaderIndices={this.state.stickyHeaderIndices}
              />}
              </View>
              <View style = {{width:'100%', flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text style={{ fontSize: Math.min(25 * wid, 16 * rem), fontFamily: 'WSBB', color: 'white' }}>Specific Opportunities</Text>
              </View>
              <View style = {{width:'100%', flex:4, justifyContent: this.state.specific.length ==0 ? 'center' : 'flex-start'}}>
              
              {this.state.specific.length == 0 ? <Text style={{ fontSize: 30 * wid, color: 'white', fontFamily: 'WSB', alignSelf:'center', }}>No Specific Events</Text> : <FlatList style={{ width: '100%' }}
                data={this.state.specific}
                renderItem={this._renderItem2}
                keyExtractor={item => item.id}
              // stickyHeaderIndices={this.state.stickyHeaderIndices}
              />}
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
  },
  spinnerTextStyle: {
    color: '#FFF',
    top: 60
  },

});