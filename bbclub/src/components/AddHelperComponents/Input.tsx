import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LocationModal from './LocationModal';
import CategoryModal from './CategoryModal';
import {useDarkMode} from '../ProfileScreenComponents/DarkModeContext';
import {InputProps, LocationType} from '../../types/home';
import {IMGUR_CLIENT_ID} from '../../config';

const Input: React.FC<InputProps> = ({
  setTitle,
  setDescription,
  setCategory,
  setLocation,
  onImageUploaded,
}) => {
  const {isDarkMode} = useDarkMode();
  const labelStyle = isDarkMode ? styles.darkLabel : styles.lightLabel;

  const [location, setLocationState] = useState<LocationType>({
    province: '',
    district: '',
    town: '',
    neighbourhood: '',
  });

  const [category, setCategoryState] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadToImgur = async (imageUri: string): Promise<void> => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        if (onImageUploaded) onImageUploaded(data.data.link);
      } else {
        console.error('Imgur yükleme hatası:', data);
      }
    } catch (error) {
      console.error('Imgur hata:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelected = (uri: string) => {
    setLocalImageUri(uri);
    uploadToImgur(uri).catch(err => console.error('Upload error:', err));
  };

  const handleImagePicker = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
        handleImageSelected(response.assets[0].uri!);
        setImageModalVisible(false);
      }
    });
  };

  const handleCameraLaunch = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
        handleImageSelected(response.assets[0].uri!);
        setImageModalVisible(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={labelStyle}>Başlık</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="grey"
        placeholder="Başlık gir"
        onChangeText={setTitle}
      />

      <Text style={labelStyle}>Açıklama</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholderTextColor="grey"
        placeholder="Açıklama gir"
        onChangeText={setDescription}
        multiline
      />

      <Text style={labelStyle}>Kategori</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setCategoryModalVisible(true)}>
        <Text style={styles.buttonText}>{category || 'Kategori seç'}</Text>
      </TouchableOpacity>

      <Text style={labelStyle}>Konum</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>
          {location.province
            ? `${location.province} / ${location.district} / ${location.town} / ${location.neighbourhood}`
            : 'Konum seç'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setImageModalVisible(true)}>
        <MaterialCommunityIcons name="camera-plus" size={20} color="#66914c" />
        <Text style={styles.buttonText}>Fotoğraf Ekle</Text>
      </TouchableOpacity>

      {localImageUri && (
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <Image
            source={{uri: localImageUri}}
            style={{width: 100, height: 100, borderRadius: 10}}
            resizeMode="cover"
          />
          {uploading && (
            <ActivityIndicator
              style={{marginTop: 10}}
              size="small"
              color="#66914c"
            />
          )}
        </View>
      )}

      <LocationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectLocation={selectedLocation => {
          setLocationState(selectedLocation);
          setLocation(selectedLocation);
          setModalVisible(false);
        }}
      />

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSelectCategory={selectedCategory => {
          setCategoryState(selectedCategory);
          setCategory(selectedCategory);
          setCategoryModalVisible(false);
        }}
      />

      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fotoğraf Seç</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleImagePicker}>
              <Text style={styles.modalButtonText}>Galeri</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCameraLaunch}>
              <Text style={styles.modalButtonText}>Kamera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setImageModalVisible(false)}
              style={[styles.modalButton, {backgroundColor: '#ddd'}]}>
              <Text style={[styles.modalButtonText, {color: '#000'}]}>
                Kapat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 25,
  },
  lightLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  darkLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fdfaf1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
    fontSize: 18,
    backgroundColor: '#fdfaf1',
    color: 'black',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fdfaf1',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    fontSize: 16,
  },
  buttonText: {
    marginLeft: 5,
    color: 'grey',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#66914c',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Input;
