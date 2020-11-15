import React, {Component} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import Const from '../util/Const';
class ComicSeries extends Component {
  constructor(props) {
    super(props);
    this.item = props.route.params.data;
    console.log(this.item.title + ' : ' + this.item.id);
    this.state = {
      data: [],
      isLoading: true,
      offset: 0,
    };
  }

  loadDataFromApi(itemID, offset) {
    try {
      this.setState({isLoading: true});
      let url =
        Const.BASE_URL +
        Const.SERIES +
        '/' +
        itemID +
        '/' +
        Const.COMIC +
        `?${queryString(offset)}`;
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

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: '100%', height: 200}}
          source={{uri: getUrlThumb(this.item)}}
        />
        <Text style={styles.textHeaderStyle}>{this.item.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#212121',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textHeaderStyle: {
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
    fontSize: 18,
  },
  textItemStyle: {
    color: 'white',
    fontSize: 16,
  },
});

function getUrlThumb(data) {
  return data.thumbnail.path + '.' + data.thumbnail.extension;
}

function queryString(offset) {
  return objToQueryString({
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
export default ComicSeries;
