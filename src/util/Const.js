import md5 from 'md5';
class Const {
  static PUBLIC_KEY = '0eaddd37a9c90b7af5fba49de8bad7ae';
  static PRIVATE_KEY = '64d8eb4c63e4dc710b9d55e768b4531a8ab0e2d9';
  static TS = '1';
  static HASH_KEY = md5(this.TS + Const.PRIVATE_KEY + Const.PUBLIC_KEY);
  static BASE_URL = 'https://gateway.marvel.com/v1/public/';
  static SERIES = 'series';
  static COMIC = 'comic';
}

export default Const;
