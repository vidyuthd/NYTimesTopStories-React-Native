/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  BackAndroid,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  View
} from 'react-native';
import TopStories from './app/components/TopStories'
import NewsItemWebView from './app/components/NewsItemWebView'
import SideMenu from './app/components/SideMenu'

class nytimes_topstories extends Component {
  constructor(){
    super()
    this.state = {
      section : 'home',
      sectionName : 'Top Stories',
    }

    this._renderScene = this._renderScene.bind(this)
  }
  render() {
    return (
        <SideMenu ref="drawer" onItemClick={this.handleItemClick.bind(this)}>
          <Navigator
          ref = "navigator"
          initialRoute={{id:"LandingPage",name: this.state.sectionName, passProps: {section:this.state.section, sectionName : this.state.sectionName}}}
          renderScene={this._renderScene}
          configureScene = {(route) => {return Navigator.SceneConfigs.FloatFromRight}}
          navigationBar = {this._navigationBar()}
          sceneStyle = {styles.navSceneStyle}
          />
        </SideMenu>
    )
  }
  handleItemClick(section,sectionName){
    this.setState({
      section : section,
      sectionName : sectionName,
    })
    this.refs["navigator"].replace({id:"LandingPage",name: this.state.sectionName, passProps: {section:this.state.section,sectionName : this.state.sectionName}})
  }
  _navigationBar(){
    return (
      <Navigator.NavigationBar
      routeMapper = {this._routeMapper}
      style = {styles.navBarStyle}
      />
    )
  }
  _routeMapper = {
      Title : (route,navigator,index,state) => {
        return (
          <Text
        style={[styles.navBarText,styles.navBarTitleText]}
        numberOfLines={2}
        >
          {route.name}
        </Text>
      )
      },
      LeftButton : (route,navigator,index,state) => {
        let imgsrc =  require("./images/ic_arrow_back_black_24dp.png")
        let onPress = () => {navigator.pop()}
        if(index === 0){
          imgsrc = require("./images/ic_menu_black_24dp.png")
          onPress = () => {this.refs["drawer"].openDrawer()}
        }

        return (
          <TouchableHighlight
            onPress = {onPress}
           >
            <Image
            source={imgsrc}
            style={styles.navBarLeftItemStyle}
            />
          </TouchableHighlight>
        )
      },
      RightButton : (route,navigator,index,state) => {
        return null
      }
  }
  _renderScene(route,navigator){
      const routeId = route.id
      if(routeId === "LandingPage"){
        return (
                  <TopStories
                    navigator = {navigator}
                    {... route.passProps}
                  />
                )
      }
      if(routeId === "NewsItemPage"){
        return ( <NewsItemWebView
                  navigator={navigator}
                  {... route.passProps}
                />
            )
      }
  }
  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const navigator = this.refs["navigator"]
      if(navigator && navigator.getCurrentRoutes().length > 1){
        navigator.pop()
        return true
      }
      return false
    })
  }
}

const styles = StyleSheet.create({
  navBarText : {
    fontSize : 16,
    marginVertical : 9,
  },
  navBarTitleText : {
    fontWeight : "500",
  },
  navBarLeftItemStyle : {
    height : 25,
    width : 25,
    marginLeft : 10,
    marginTop : 10,
  },
  navBarStyle :{
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : 'white',
  },
  navSceneStyle : {
    paddingTop : 45,
    marginBottom : 25,
  }
})

AppRegistry.registerComponent('nytimes_topstories', () => nytimes_topstories);
