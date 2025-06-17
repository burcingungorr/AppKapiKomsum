import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import locationData from '../../data/turkey-geo.json';

import AuthButton from './AuthButton';
import FormInput from './RegisterFormInput';
import LocationSelector from './LocationSelector';
import LocationModal from './LocationModal';
import {useDarkMode} from '../ProfileScreenComponents/DarkModeContext';
import {Alert} from 'react-native';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Kullanıcı adı gerekli'),
  email: Yup.string()
    .email('Geçerli bir e-posta girin')
    .required('E-posta gerekli'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalı')
    .required('Şifre gerekli'),
  city: Yup.string().required('Şehir gerekli'),
  district: Yup.string().required('İlçe gerekli'),
  town: Yup.string().required('Bölge gerekli'),
  neighborhood: Yup.string().required('Mahalle gerekli'),
});

const RegisterArea: React.FC = () => {
  const navigation = useNavigation<any>();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalLevel, setModalLevel] = useState<
    'city' | 'district' | 'town' | 'neighborhood' | null
  >(null);
  const [modalItems, setModalItems] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedTown, setSelectedTown] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFirebaseRegister = async (values: FormValues) => {
    try {
      setErrorMessage('');

      const usernameLower = values.username.toLowerCase();

      const usernameSnapshot = await firestore()
        .collection('users')
        .where('usernameLower', '==', usernameLower)
        .get();

      if (!usernameSnapshot.empty) {
        throw new Error('Bu kullanıcı adı zaten kullanılıyor');
      }
      const userCredential = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );

      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        username: values.username,
        usernameLower: usernameLower,
        email: values.email,
        city: values.city,
        district: values.district,
        town: values.town,
        neighborhood: values.neighborhood,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await auth().signOut();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Bu e-posta zaten kullanılıyor');
      } else if (error.message === 'Bu kullanıcı adı zaten kullanılıyor') {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Kayıt sırasında hata oluştu: ' + error.message);
      }
    }
  };
  const openModal = (
    level: 'city' | 'district' | 'town' | 'neighborhood',
    values: FormValues,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    setModalLevel(level);

    switch (level) {
      case 'city':
        setModalItems(locationData.map(p => p.Province));
        break;
      case 'district':
        if (selectedCity) {
          setModalItems(selectedCity.Districts.map((d: any) => d.District));
        }
        break;
      case 'town':
        if (selectedDistrict) {
          setModalItems(selectedDistrict.Towns.map((t: any) => t.Town));
        }
        break;
      case 'neighborhood':
        if (selectedTown) {
          setModalItems(selectedTown.Neighbourhoods);
        }
        break;
    }

    setModalVisible(true);
  };

  const handleLocationSelect = (
    item: string,
    values: FormValues,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    switch (modalLevel) {
      case 'city':
        const city = locationData.find(p => p.Province === item);
        setFieldValue('city', item);
        setSelectedCity(city);
        break;
      case 'district':
        const district = selectedCity.Districts.find(
          (d: any) => d.District === item,
        );
        setFieldValue('district', item);
        setSelectedDistrict(district);
        break;
      case 'town':
        const town = selectedDistrict.Towns.find((t: any) => t.Town === item);
        setFieldValue('town', item);
        setSelectedTown(town);
        break;
      case 'neighborhood':
        setFieldValue('neighborhood', item);
        break;
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        city: '',
        district: '',
        town: '',
        neighborhood: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleFirebaseRegister}>
      {({
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Kayıt</Text>

          {errorMessage ? (
            <Text style={{color: 'red', marginBottom: 8}}>{errorMessage}</Text>
          ) : null}

          <FormInput
            placeholder="Kullanıcı Adı"
            value={values.username}
            onChangeText={handleChange('username')}
            error={touched.username ? errors.username : undefined}
          />

          <FormInput
            placeholder="E-posta"
            value={values.email}
            onChangeText={handleChange('email')}
            error={touched.email ? errors.email : undefined}
          />

          <FormInput
            placeholder="Şifre"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
            error={touched.password ? errors.password : undefined}
            icon={<MaterialCommunityIcons name="key" size={24} color="grey" />}
          />

          <View style={styles.row}>
            <View style={styles.rowcontainer}>
              <LocationSelector
                label={values.city || 'Şehir seçin'}
                onPress={() => openModal('city', values, setFieldValue)}
                error={touched.city ? errors.city : undefined}
              />
            </View>
            <View style={styles.rowcontainer}>
              <LocationSelector
                label={values.district || 'İlçe seçin'}
                onPress={() => openModal('district', values, setFieldValue)}
                error={touched.district ? errors.district : undefined}
                disabled={!values.city}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowcontainer}>
              <LocationSelector
                label={values.town || 'Bölge seçin'}
                onPress={() => openModal('town', values, setFieldValue)}
                error={touched.town ? errors.town : undefined}
                disabled={!values.district}
              />
            </View>
            <View style={styles.rowcontainer}>
              <LocationSelector
                label={values.neighborhood || 'Mahalle seçin'}
                onPress={() => openModal('neighborhood', values, setFieldValue)}
                error={touched.neighborhood ? errors.neighborhood : undefined}
                disabled={!values.town}
              />
            </View>
          </View>

          <AuthButton button="Kayıt Ol" onPress={handleSubmit} />

          <LocationModal
            visible={modalVisible}
            level={modalLevel}
            items={modalItems}
            onSelect={item => handleLocationSelect(item, values, setFieldValue)}
            onClose={() => setModalVisible(false)}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginVertical: 8,
    color: '#525252',
  },
  row: {flexDirection: 'row'},
  rowcontainer: {
    flex: 1,
    marginHorizontal: 1,
  },
  label: {
    fontWeight: 'bold',
    color: '#fdfaf1',
  },
});

export default RegisterArea;
