import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  WebView,
} from 'react-native';

class NewsItemWebView extends Component{
  render(){
    return (
      <View style={{flex:1}}>
         <WebView
         source={{uri:this.props.url}}
         javaScriptEnabled={true}
         domStorageEnabled={true}
         />
      </View>
    )
  }
}

export default NewsItemWebView
