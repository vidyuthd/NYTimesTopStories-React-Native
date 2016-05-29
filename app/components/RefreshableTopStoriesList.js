import React,{ Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  RefreshControl,
  TouchableHighlight,
} from 'react-native'
import NewsItemWebView from './NewsItemWebView'
import SQLite from 'react-native-sqlite-storage'

SQLite.DEBUG(true)
SQLite.enablePromise(true)
SQLite.enablePromise(false)

const retreivenytimesurl = (section,format,apikey) => { return `https://api.nytimes.com/svc/topstories/v2/${section}.${format}?api-key=${apikey}`
}

const API_KEY = '<API_KEY>';
const default_thumbnail = 'http://d3biamo577v4eu.cloudfront.net/static/images/redesign/poster_default_thumb.gif'

const database_name = "Test.db"
const database_version = "1.0"
const database_displayname = "SQLite Test Database"
const database_size = 200000
var db

class RefreshableTopStoriesList extends Component{
  constructor(props){
    super(props)
    this.state = {
      loaded : false,
      refreshing : false,
      dataSource : new ListView.DataSource({
        rowHasChanged : (row1,row2) => row1 !== row2,
      }),
    }

    this.querySectionData = this.querySectionData.bind(this)
    this.populateDb = this.populateDb.bind(this)
    this.getNews = this.getNews.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this.renderNewsItem = this.renderNewsItem.bind(this)
  }
  // this is for the initial render
  componentDidMount(){
    this.fetchData()
  }
  componentWillUnmount(){
    //console.warn('unmounting')
  }
  loadingView(){
    return (
      <View style={styles.container}>
        <Text>
            {this.props.pageLoadingText}
        </Text>
      </View>
    )
  }
  purgeSectionData(){
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM NEWS_DATA where section = ? ',[this.props.section])
    })
  }
  _onRefresh() {
    this.setState({refreshing: true})
    this.purgeSectionData()
    this.fetchData()
    this.setState({refreshing: false})
  }
  openCB(){
    console.log("database opened")
  }
  errorCB(err) {
     console.log("error: ",err);
     return false;
 }
 successCB() {
     console.log("SQL executed ...");
 }
 closeCB(){
   console.log("closing db")
 }
 populateDatabase(db){
    db.executeSql('SELECT 1 from Version LIMIT 1',[],
    () => {
      db.transaction(this.querySectionData,this.errorCB,() => {
          console.log('completed transaction')
      })
    },
    (error) => {
      console.log("received version error:", error);
      db.transaction(this.populateDb,this.errorCB,() => {
        console.log('completed transaction')
        db.transaction(this.querySectionData,this.errorCB,function(){
            console.log('completed transaction')
            this.closeDatabase()
        })
      })
    })
  }
  populateDb(tx){
    tx.executeSql('DROP TABLE IF EXISTS NEWS_DATA')
    tx.executeSql('CREATE TABLE IF NOT EXISTS VERSION (version_id INTEGER PRIMARY KEY NOT NULL )',[],this.successCB,this.errorCB)
    tx.executeSql('CREATE TABLE IF NOT EXISTS NEWS_DATA (section VARCHAR(32), json VARCHAR(65536))',[],this.successCB,this.errorCB)

    this._fetchData(this.props.section).
             then((response) => response.json()).
             then((responseData) => {
                  db.transaction((tx) =>
                    tx.executeSql('INSERT INTO NEWS_DATA(section,json) values  (?,?)',[this.props.section,JSON.stringify(responseData.results)])
                  )
             }).
             done()
  }
  querySectionData(tx){
    tx.executeSql('SELECT json from NEWS_DATA where section = ?',[this.props.section],this.getNews,this.errorCB)
  }
  getNews(tx,results){
    const row = results.rows.item(0);
    if(!!row && !!row.json){
      const news_json = JSON.parse(row.json)
      this.setState({
        loaded : true,
        dataSource : this.state.dataSource.cloneWithRows(news_json),
      })
    }
    else{
      this._fetchData(this.props.section).
               then((response) => response.json()).
               then((responseData) => {
                    db.transaction((tx) => {
                      tx.executeSql('INSERT INTO NEWS_DATA(section,json) values  (?,?)',[this.props.section,JSON.stringify(responseData.results)])
                      this.querySectionData(tx)
                    })
               }).
               done()
    }
  }
  closeDatabase(){
    const that = this
    if(db){
      db.close(that.closeCB,that,errorCB)
    }
  }
  loadAndQueryDB(){
    db = SQLite.openDatabase(database_name,database_version,database_displayname,database_size,this.openCB,this.errorCB)
    this.populateDatabase(db)
  }
  async _fetchData(section){
    const data =  await fetch(retreivenytimesurl(section,this.props.format,API_KEY))
    return data
  }
  fetchData(section=this.props.section){
    this.setState({
      loaded : false
    })
    this.loadAndQueryDB()
  }
  _renderSeparator(sectionID,rowID){
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={styles.separator}
      />
    )
  }
  render(){
    if(!this.state.loaded){
      return this.loadingView()
    }

    return (
          <ListView
           refreshControl = {
             <RefreshControl
             refreshing={this.state.refreshing}
             onRefresh={this._onRefresh}
            />
          }
           dataSource={this.state.dataSource}
           renderRow = {this.renderNewsItem}
           style = {styles.listView}
           renderSeparator={(sectionID,rowID) => this._renderSeparator(sectionID,rowID)}
          />
    )
  }
  renderNewsItem(newsitem){
    const imgsrc = newsitem.multimedia[0] ? newsitem.multimedia[0].url :  default_thumbnail
    const url = newsitem.url
    const title = newsitem.title
    return (
      <TouchableHighlight
      onPress = {() => {return this.handleNewsItemClick(url,title)}}
      underlayColor = {'grey'}
      activeOpacity = {0.25}
      >
        <View style={styles.container}>
          <Image source={{uri:imgsrc}} style={styles.thumbnail} />
          <View style={styles.rightContainer}>
            <Text style={styles.title} numberOfLines={3}>{newsitem.title}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  handleNewsItemClick(url,title){
    this.props.navigator.push({
      id : this.props.pageId,
      component : NewsItemWebView,
      name : title,
      passProps: {url:url,title:this.props.title},
    })
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection : 'row',
    alignItems: 'center',
    paddingLeft : 15,
    paddingRight : 15,
    paddingTop : 5,
    paddingBottom : 5,
  },
  rightContainer : {
    flex : 1,
    justifyContent :  'flex-start'
  },
  title:{
    fontSize : 16,
    textAlign : 'left',
    marginLeft : 10,
  },
  year :{
    textAlign : 'center'
  },
  thumbnail: {
    width : 60,
    height : 60,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginLeft : 15,
    marginRight : 15,
  },
})

export default RefreshableTopStoriesList
