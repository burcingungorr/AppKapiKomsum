import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import SurveyCard from './SurveyCard';
import SurveyAnimation from './SurveyAnimation';

const Surveys: React.FC = () => {
  const [surveys, setSurveys] = useState<SurveyItems[]>([]);

  const location = useSelector((state: any) => state.user || {});

  const handleDeleteSurvey = (id: string) => {
    setSurveys(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    if (
      !location.city ||
      !location.district ||
      !location.neighborhood ||
      !location.town
    ) {
      console.warn('Konum bilgileri eksik, anketler getirilemedi.');
      return;
    }
    const unsubscribe = firestore()
      .collection('surveys')
      .where('city', '==', location.city)
      .where('district', '==', location.district)
      .where('neighborhood', '==', location.neighborhood)
      .where('town', '==', location.town)
      .onSnapshot(
        snapshot => {
          const fetchedSurveys = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as SurveyItems[];

          setSurveys(fetchedSurveys);
        },
        error => {
          console.error('Anketleri getirirken hata oluştu:', error);
        },
      );

    return () => unsubscribe();
  }, [location]);

  return (
    <View style={styles.container}>
      {surveys.length === 0 ? (
        <SurveyAnimation />
      ) : (
        <FlatList
          data={surveys}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <SurveyCard
              id={item.id}
              question={item.question}
              options={item.options}
              username={item.username}
              onDelete={() => handleDeleteSurvey(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  createSurveyContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
  },
});

export default Surveys;
