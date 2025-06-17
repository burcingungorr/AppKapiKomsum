import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image, View, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useDarkMode} from '../ProfileScreenComponents/DarkModeContext';
// useDarkMode hook'unu import edin, örnek:

const UsernameDisplay = ({receiver}: {receiver: string}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [average, setAverage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const {isDarkMode} = useDarkMode();

  useEffect(() => {
    if (!receiver) return;

    const unsubscribe = firestore()
      .collection('users')
      .where('username', '==', receiver)
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setAvatarUrl(userData.avatar);
            const totalPoint = userData.totalpoint;
            if (totalPoint && typeof totalPoint.average === 'number') {
              setAverage(totalPoint.average);
            }
            setLoading(false);
          }
        },
        error => {
          console.error('Gerçek zamanlı kullanıcı verisi alınamadı:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [receiver]);

  if (loading) {
    return <ActivityIndicator style={{marginTop: 20}} />;
  }

  const renderStars = (count: number) => {
    const fullStars = Math.floor(count);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star]}>
          {i < fullStars ? '★' : '☆'}
        </Text>,
      );
    }

    return stars;
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      <Image
        source={{
          uri:
            avatarUrl ||
            'https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png',
        }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.receiverText,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}>
          {receiver}
        </Text>
        <View style={styles.starsContainer}>{renderStars(average)}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    width: '100%',
    paddingBottom: 10,
  },
  darkContainer: {},
  lightContainer: {},
  infoContainer: {
    marginLeft: 10,
  },
  receiverText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 5,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 22,
    color: '#EF7613',
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
});

export default UsernameDisplay;
