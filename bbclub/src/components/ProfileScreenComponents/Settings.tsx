import React, {useState} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import signOut from '@react-native-firebase/auth';
import DarkModeToggle from './DarkModeToggle';

const Settings: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const goToSupportScreen = () => {
    navigation.navigate('Support');
    setModalVisible(!isModalVisible);
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          onPress: async () => {
            try {
              await signOut();

              dispatch({type: 'RESET_USER'});
              navigation.navigate('Login');
              Alert.alert('Hesabınız başarıyla silindi.');
            } catch (error) {
              console.error('Hesap silme işlemi başarısız:', error);
              Alert.alert('Bir hata oluştu, lütfen tekrar deneyin.');
            }
          },
        },
      ],
    );
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <MaterialCommunityIcons name="cog" size={30} color="grey" />
        <Text style={styles.buttonText}>Ayarlar</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Ayarlar</Text>

            <DarkModeToggle />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={goToSupportScreen}>
              <Text style={styles.settingText}>Yardım ve Destek</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleAccountDeletion}>
              <Text style={styles.settingText}>Hesabı Sil</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fdfaf1',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fdfaf1',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
  closeText: {
    fontSize: 16,
    color: 'black',
    marginTop: 20,
  },
});

export default Settings;
