# NewYork Times Top Stories - React Native

[NewYork Times](http://www.nytimes.com/) news reader Android, made with [React-Native](https://github.com/facebook/react-native).

##Features/components
- Uses React Native 0.25.1 with React 0.14.8
- Has [Sqlite](https://github.com/andpor/react-native-sqlite-storage/) storage support to store news
- Switch between different sections topstories
- Pull down to refresh to get latest news
- WebView to view news page
- Pagination natively implemented by ListView

## App Snapshots
![Alt Text](snapshots/home_screen.png "Home Screen")
![Alt Text](snapshots/news_view.png "News View")
![Alt Text](snapshots/drawer_or_sidemenu.png "Side Menu")	
![Alt Text](snapshots/technology_section_after_refresh.png "Technology News")

##Installation
- Clone or download the repo
- cd to directory and do ```npm install```
- You would need [api key of new york times](https://developer.nytimes.com/signup) to run this
- Replace the api key(API_KEY) in [RefreshableTopStoriesList](app/components/RefreshableTopStoriesList.js)
- ```adb reverse tcp:8081 tcp:8081```
- ```react-native run-android```

##Usage
- [Running app on android device](https://facebook.github.io/react-native/docs/running-on-device-android.html#content)

##Future Improvements
- Clean up code
- Proper styling with icons on android drawer
- iOS implementation of app
