import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import HelperCard from './HelperCard';
import HelpAnimation from './HelpAnimation';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {HelperCardListProps} from '../../types/home';
import {useNavigation} from '@react-navigation/native';

const HelperCardList: React.FC<HelperCardListProps> = ({
  selectedCategory,
  selectedLocation,
}) => {
  const navigation = useNavigation<any>();

  const [helperCards, setHelperCards] = useState<any[]>([]);
  const handleMessagePress = (username: string) => {
    navigation.navigate('Chat', {receiver: username});
  };

  useEffect(() => {
    const fetchHelperCards = async () => {
      try {
        const helpsRef = firestore().collection('helps');

        let query = helpsRef as FirebaseFirestoreTypes.Query;

        if (selectedCategory) {
          query = query.where('category', '==', selectedCategory);
        }

        if (selectedLocation) {
          const {province, district, town, neighbourhood} = selectedLocation;

          if (province) {
            query = query.where('location.province', '==', province);
          }
          if (district) {
            query = query.where('location.district', '==', district);
          }
          if (town) {
            query = query.where('location.town', '==', town);
          }
          if (neighbourhood) {
            query = query.where('location.neighbourhood', '==', neighbourhood);
          }
        }

        const snapshot = await query.get();
        const cards = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setHelperCards(cards);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchHelperCards();
  }, [selectedCategory, selectedLocation]);

  const handleDelete = async (id: string) => {
    try {
      await firestore().collection('helps').doc(id).delete();
      setHelperCards(helperCards.filter(card => card.id !== id));

      Alert.alert('Başarılı', 'Yardım isteği silindi!');
    } catch (error) {
      console.error('Silme hatası:', error);

      Alert.alert('Hata', 'Yardım isteği silinemedi.');
    }
  };

  return (
    <View style={styles.container}>
      {helperCards.length === 0 ? (
        <HelpAnimation />
      ) : (
        <FlatList
          data={helperCards}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <HelperCard
              topic={item.category}
              title={item.title}
              content={item.description}
              username={item.username}
              date={new Date(
                item.createdAt.seconds * 1000,
              ).toLocaleDateString()}
              imageUrl={item.imageUrl}
              location={item.location}
              onDelete={() => handleDelete(item.id)}
              onMessagePress={user => handleMessagePress(user)}
            />
          )}
        />
      )}
    </View>
  );
};

export default HelperCardList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
