import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface RatingProps {
  userId: string;
}

const Rating: React.FC<RatingProps> = ({userId}) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(doc => {
        const data = doc.data();
        console.log('Firestore data:', data);

        if (
          data &&
          data.totalpoint &&
          typeof data.totalpoint.average === 'number'
        ) {
          setRating(data.totalpoint.average);
        } else {
          console.log('totalPoint veya average bulunamadı');
          setRating(0);
        }
      });

    return () => unsubscribe();
  }, [userId]);

  const renderStars = (count: number) => {
    const fullStars = Math.floor(count);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <View key={i}>
          <Text style={styles.star}>{i < fullStars ? '★' : '☆'}</Text>
        </View>,
      );
    }

    return stars;
  };

  return <View style={styles.container}>{renderStars(rating)}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  star: {
    fontSize: 30,
    color: '#EF7613',
    marginHorizontal: 5,
  },
});

export default Rating;
