import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import Const from '../util/Const';

class Series extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    //Have a try and catch block for catching errors.
    try {
      let url = Const.BASE_URL + Const.SERIES + `?${queryString}`;
      console.log(url);
      fetch(url)
        .then((response) => response.json())
        .then((json) => this.setState({data: json.data.results}))
        .catch((error) => console.error(error))
        .finally(() => this.setState({isLoading: false}));
    } catch (err) {
      console.log('Error fetching data-----------', err);
    }
  }

  renderItem(data) {
    console.log(data.title);
    return (
      <View style={styles.itemView}>
        <Image
          style={{width: '80%', height: 80}}
          source={{uri: getUrlThumb(data)}}
        />
        <Text style={styles.text}>{data.title}</Text>
      </View>
    );
  }

  render() {
    const {data, isLoading} = this.state;
    if (isLoading) return <ActivityIndicator />;
    else
      return (
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={(index, item) => item.title}
            renderItem={({item}) => this.renderItem(item)}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {width: '100%'},
  text: {color: 'black', fontSize: 16},
  itemView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '100%',
    height: 100,
    marginTop: 10,
  },
});

const queryString = objToQueryString({
  orderBy: '-modified',
  limit: 10,
  offset: 0,
  ts: Const.TS,
  apikey: Const.PUBLIC_KEY,
  hash: Const.HASH_KEY,
});

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
