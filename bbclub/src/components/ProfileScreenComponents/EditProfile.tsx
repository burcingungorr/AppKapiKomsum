import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import locationData from '../../data/turkey-geo.json'; // Buraya kendi json dosyanızın yolu

const EditProfile: React.FC = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector((state: any) => state.user);
  const user = auth().currentUser;

  const [modalVisible, setModalVisible] = useState(false);

  // Hangi küçük modal açık? city, district, town, neighborhood veya null
  const [pickerModal, setPickerModal] = useState<
    null | 'city' | 'district' | 'town' | 'neighborhood'
  >(null);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    city: '',
    district: '',
    town: '',
    neighborhood: '',
  });

  useEffect(() => {
    if (userRedux && userRedux.uid === user?.uid) {
      setForm({
        city: userRedux.city || '',
        district: userRedux.district || '',
        town: userRedux.town || '',
        neighborhood: userRedux.neighborhood || '',
      });
      setLoading(false);
    } else {
      const fetchUser = async () => {
        if (user) {
          const doc = await firestore().collection('users').doc(user.uid).get();
          const data = doc.data();
          if (data) {
            setForm({
              city: data.city || '',
              district: data.district || '',
              town: data.town || '',
              neighborhood: data.neighborhood || '',
            });
          }
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [user, userRedux]);

  const handleChange = (field: string, value: string) => {
    // İlçe, bölge, mahalle seçimi değişince alt alanları resetle (ör: şehir değişince ilçe, bölge vs sıfırlanır)
    if (field === 'city') {
      setForm(prev => ({
        ...prev,
        city: value,
        district: '',
        town: '',
        neighborhood: '',
      }));
    } else if (field === 'district') {
      setForm(prev => ({...prev, district: value, town: '', neighborhood: ''}));
    } else if (field === 'town') {
      setForm(prev => ({...prev, town: value, neighborhood: ''}));
    } else {
      setForm(prev => ({...prev, [field]: value}));
    }
  };

  const handleSave = async () => {
    try {
      await firestore().collection('users').doc(user?.uid).update({
        city: form.city,
        district: form.district,
        town: form.town,
        neighborhood: form.neighborhood,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Redux state’ini manuel güncelle
      dispatch({
        type: 'user/fetchUserInfo/fulfilled',
        payload: {
          ...userRedux,
          city: form.city,
          district: form.district,
          town: form.town,
          neighborhood: form.neighborhood,
        },
      });

      setModalVisible(false);
      Alert.alert('Başarılı', 'Adres bilgileri güncellendi');
    } catch (error) {
      Alert.alert('Hata', 'Güncelleme sırasında bir hata oluştu');
    }
  };

  // Location listelerini çekiyoruz
  const cities = locationData.map(c => c.Province);

  const districts = () => {
    const cityObj = locationData.find(c => c.Province === form.city);
    return cityObj ? cityObj.Districts.map(d => d.District) : [];
  };

  const towns = () => {
    const cityObj = locationData.find(c => c.Province === form.city);
    const districtObj = cityObj?.Districts.find(
      d => d.District === form.district,
    );
    return districtObj ? districtObj.Towns.map(t => t.Town) : [];
  };

  const neighborhoods = () => {
    const cityObj = locationData.find(c => c.Province === form.city);
    const districtObj = cityObj?.Districts.find(
      d => d.District === form.district,
    );
    const townObj = districtObj?.Towns.find(t => t.Town === form.town);
    return townObj ? townObj.Neighbourhoods : [];
  };

  // Seçim yapılacak listeyi döndür
  const getPickerData = () => {
    switch (pickerModal) {
      case 'city':
        return cities;
      case 'district':
        return districts();
      case 'town':
        return towns();
      case 'neighborhood':
        return neighborhoods();
      default:
        return [];
    }
  };

  if (loading) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}>
        <Icon name="human-edit" size={30} color="#66914c" />
        <Text style={styles.buttonText}>Profili Düzenle</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{width: '100%'}}>
              <Text style={styles.label}>Şehir</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setPickerModal('city')}>
                <Text>{form.city || 'Seçiniz'}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>İlçe</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setPickerModal('district')}
                disabled={!form.city}>
                <Text>
                  {form.district ||
                    (form.city ? 'Seçiniz' : 'Önce şehir seçin')}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Bölge</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setPickerModal('town')}
                disabled={!form.district}>
                <Text>
                  {form.town || (form.district ? 'Seçiniz' : 'Önce ilçe seçin')}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Mahalle</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setPickerModal('neighborhood')}
                disabled={!form.town}>
                <Text>
                  {form.neighborhood ||
                    (form.town ? 'Seçiniz' : 'Önce bölge seçin')}
                </Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}>
                  <Text style={styles.buttonText}>Kaydet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, {backgroundColor: '#ccc'}]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={pickerModal !== null} animationType="fade" transparent>
        <View style={styles.pickerModalContainer}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>
              {pickerModal === 'city'
                ? 'Şehir Seçiniz'
                : pickerModal === 'district'
                ? 'İlçe Seçiniz'
                : pickerModal === 'town'
                ? 'Bölge Seçiniz'
                : 'Mahalle Seçiniz'}
            </Text>

            <FlatList
              data={getPickerData()}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    handleChange(pickerModal!, item);
                    setPickerModal(null);
                  }}>
                  <Text style={styles.pickerItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={{maxHeight: 300}}
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                {backgroundColor: 'white', marginTop: 10},
              ]}
              onPress={() => setPickerModal(null)}>
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  label: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 15,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#66914c',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  pickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  pickerModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    height: 430,
  },
  pickerModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  pickerItemText: {
    fontSize: 16,
  },
});

export default EditProfile;
