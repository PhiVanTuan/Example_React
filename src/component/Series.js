import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Const from '../util/Const';

class Series extends Component {
  constructor({navigation}) {
    super();
    this.state = {
      data: [],
      isLoading: true,
      offset: 0,
    };
  }

  async componentDidMount() {
    //Have a try and catch block for catching errors.
    this.loadDataFromApi(0);
  }

  loadDataFromApi(offset) {
    try {
      this.setState({isLoading: true});
      let url = Const.BASE_URL + Const.SERIES + `?${queryString(offset)}`;
      let data = this.state.data;
      console.log(url);
      fetch(url)
        .then((response) => response.json())
        .then((json) =>
          this.setState({
            data: data.concat(json.data.results),
            offset: offset + 10,
          }),
        )
        .catch((error) => console.error(error))
        .finally(() => this.setState({isLoading: false}));
    } catch (err) {
      console.log('Error fetching data-----------', err);
    }
  }

  renderItem(data) {
    return (
      <TouchableOpacity onPress={() => this.actionClick(data)}>
        <View style={styles.itemView}>
          <Image
            style={{width: '100%', height: 150}}
            source={{uri: getUrlThumb(data)}}
          />
          <Text style={styles.text}>{data.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          alignSelf: 'center',
          backgroundColor: '#fff',
        }}
      />
    );
  };

  renderFooter() {
    if (!this.state.isLoading) {
      return null;
    } else {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" style={{color: 'yellow'}} />
        </View>
      );
    }
  }

  onRefresh() {
    this.setState({data: [], isLoading: true, offset: 0}); // true isRefreshing flag for enable pull to refresh indicator
    this.loadDataFromApi(0);
  }

  handleLoadmore = () => {
    if (!this.state.isLoading) {
      this.loadDataFromApi(this.state.offset);
    }
  };

  actionClick(item) {
    this.props.navigation.navigate('ComicSeries', {data: item});
  }

  render() {
    const {data, isLoading, offset} = this.state;
    if (isLoading && offset == 0)
      return (
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            style={{alignSelf: 'center', color: 'yellow'}}
          />
        </View>
      );
    else
      return (
        <View style={styles.container}>
          <FlatList
            data={data}
            renderItem={({item}) => this.renderItem(item)}
            ItemSeparatorComponent={this.renderSeparator}
            refreshControl={
              <RefreshControl onRefresh={this.onRefresh.bind(this)} />
            }
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter.bind(this)}
            onEndReachedThreshold={0.4}
            onEndReached={this.handleLoadmore.bind(this)}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {width: '100%', backgroundColor: 'black'},
  text: {color: 'white', fontSize: 16, marginTop: 5},
  itemView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '90%',
    marginTop: 10,
  },
  footer: {
    padding: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

function queryString(offset) {
  return objToQueryString({
    orderBy: '-modified',
    seriesType: 'collection',
    contains: 'comic',
    limit: 10,
    offset: offset,
    ts: Const.TS,
    apikey: Const.PUBLIC_KEY,
    hash: Const.HASH_KEY,
  });
}

function objToQueryString(obj) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]),
    );
  }
  return keyValuePairs.join('&');
}

function getUrlThumb(data) {
  return data.thumbnail.path + '.' + data.thumbnail.extension;
}

export default Series;
