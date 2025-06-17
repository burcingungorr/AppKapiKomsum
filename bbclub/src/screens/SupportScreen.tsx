import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Title from '../components/Title';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import SupportForm from '../components/SupportScreenComponents/SupportForm';
import SupportFormButton from '../components/SupportScreenComponents/SupportFormButton';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';

const SupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const username = useSelector((state: any) => state.user.username);

  const handleSubmit = async () => {
    if (!topic || !description) {
      setError('Konu ve açıklama gerekli');
      return;
    }

    try {
      await firestore().collection('supports').add({
        username: username,
        topic: topic,
        description: description,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setTopic('');
      setDescription('');
      setError(undefined);

      Alert.alert('Talebiniz başarıyla gönderildi!');
    } catch (error) {
      console.error('Support talebi gönderilemedi:', error);
      Alert.alert('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  const {isDarkMode} = useDarkMode();
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const iconColor = isDarkMode ? '#fdfaf1' : 'black';

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={iconColor}
            size={25}
          />
        </TouchableOpacity>
        <Title title="Yardım ve Destek" />
      </View>

      <SupportForm
        topic={topic}
        description={description}
        setTopic={setTopic}
        setDescription={setDescription}
        error={error}
      />

      <SupportFormButton onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    marginTop: 45,
    marginLeft: 15,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
});

export default SupportScreen;
