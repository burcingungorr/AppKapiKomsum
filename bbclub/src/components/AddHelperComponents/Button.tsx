import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

type LocationType = {
  province: string;
  district: string;
  town: string;
  neighbourhood: string;
};

type ButtonProps = {
  title: string;
  description: string;
  category: string;
  location: LocationType;
  username: string;
  imageUrl?: string | null;
  uid: string;
};

const Button: React.FC<ButtonProps> = ({
  title,
  description,
  category,
  location,
  username,
  imageUrl,
  uid,
}) => {
  const navigation = useNavigation<any>();

  const handleSubmit = async () => {
    try {
      await firestore()
        .collection('helps')
        .add({
          title,
          description,
          category,
          location,
          username,
          uid,
          imageUrl: imageUrl || null,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert('Başarılı', 'Yardım talebi gönderildi!');
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Firestore hata:', error);
      Alert.alert('Hata', 'Yardım talebi gönderilemedi.');
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#66914c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    width: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
