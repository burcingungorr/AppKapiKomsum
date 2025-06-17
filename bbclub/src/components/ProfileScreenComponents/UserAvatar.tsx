import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {IMGUR_CLIENT_ID} from '../../config';

const UserAvatar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const user = auth().currentUser;

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(snapshot => {
        setAvatarUri(snapshot.data()?.avatar || null);
      });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleImageUpload = async (uri: string) => {
    try {
      const filePath = uri;
      const base64Image = await RNFS.readFile(filePath, 'base64');

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({image: base64Image, type: 'base64'}),
      });

      const data = await response.json();
      if (data.success) {
        await firestore()
          .collection('users')
          .doc(user?.uid)
          .set({avatar: data.data.link}, {merge: true});
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const openGallery = async () => {
    setModalVisible(false);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      await handleImageUpload(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    setModalVisible(false);
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      await handleImageUpload(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.avatarButton}>
        {avatarUri ? (
          <Image source={{uri: avatarUri}} style={styles.avatarImage} />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={100}
            color="grey"
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profil Fotoğrafı Seç</Text>

            <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
              <Text style={styles.optionText}>Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
              <Text style={styles.optionText}>Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 75,
  },
  avatarButton: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#66914c',
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default UserAvatar;
