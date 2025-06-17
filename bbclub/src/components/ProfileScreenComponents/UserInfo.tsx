import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Rating from './Rating';
import {useDarkMode} from './DarkModeContext';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UserInfo: React.FC = () => {
  const {isDarkMode} = useDarkMode();

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  const {username, neighborhood, city, district, uid} = useSelector(
    (state: any) => state.user,
  );

  const [yardimlasmaSayisi, setYardimlasmaSayisi] = useState(0);

  useEffect(() => {
    if (!uid) return;

    firestore()
      .collection('users')
      .doc(uid)
      .collection('messages')
      .get()
      .then(snapshot => {
        const count = snapshot.docs.filter(doc => {
          const data = doc.data();
          return data.yardımdurumu === true;
        }).length;

        setYardimlasmaSayisi(count);
      });
  }, [uid]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.username, {color: isDarkMode ? 'white' : 'black'}]}>
        {username}
      </Text>
      {uid && <Rating userId={uid} />}
      <View style={styles.column}>
        <View style={{alignItems: 'center', marginBottom: 16, marginRight: 80}}>
          <Text style={[styles.text, {color: isDarkMode ? 'white' : 'black'}]}>
            {neighborhood}
          </Text>
          <Text
            style={[
              styles.columntext,
              {color: isDarkMode ? 'white' : 'black'},
            ]}>
            {district}/{city}
          </Text>
        </View>
        <View style={styles.column}>
          <MaterialCommunityIcons
            name="handshake"
            size={30}
            color="#EF7613"
            style={styles.icon}
          />

          <Text style={styles.numbertext}>{yardimlasmaSayisi}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  username: {
    fontSize: 25,
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 35,
  },
  column: {
    flexDirection: 'row',
  },
  columntext: {
    fontSize: 13,
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 8,
  },
  numbertext: {
    fontSize: 18,
    marginLeft: 4,
    marginTop: 4,
    fontWeight: '500',
    color: '#EF7613',
    marginRight: 10,
  },
  icon: {
    marginTop: 5,
  },
  darkContainer: {
    color: '#fdfaf1',
  },
  lightContainer: {},
});

export default UserInfo;
