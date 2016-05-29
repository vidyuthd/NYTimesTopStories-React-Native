import React, { Component } from 'react'
import {
  View,
  ToolbarAndroid,
  StyleSheet,
  DrawerLayoutAndroid,
  Text,
  Dimensions,
  ListView,
  TouchableHighlight,
} from 'react-native'
import RefreshableTopStoriesList from './RefreshableTopStoriesList'

class TopStories extends Component {
  constructor(props){
    super(props)
    this.state = {
      format : "json",
      pageId : "NewsItemPage",
    }
  }
  render() {
    return (
      <View style={{flex:1}}>
        <RefreshableTopStoriesList
          section={this.props.section}
          format={this.state.format}
          pageId={this.state.pageId}
          pageLoadingText={"Loading "+this.props.sectionName+" ..."}
          title="Top Stories"
          navigator={this.props.navigator}
          style={styles.listStyle}
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  toolbar: {
    height: 56,
  },
  section:{
    height:50,
  },
  sectionText:{
    fontSize : 18,
    textAlign : 'left',
    color: 'black',
  },
  drawerListViewStyle :{
    paddingTop:40,
  }
})

export default TopStories
