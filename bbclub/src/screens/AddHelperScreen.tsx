import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from 'react-native';
import Input from '../components/AddHelperComponents/Input';
import Title from '../components/Title';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/AddHelperComponents/Button';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {fetchUserInfo} from '../redux/slice/UsernameSlice';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';

const AddHelperScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState({
    province: '',
    district: '',
    town: '',
    neighbourhood: '',
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const {username} = useSelector((state: any) => state.user);
  const uid = useSelector((state: any) => state.user.uid);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const {isDarkMode} = useDarkMode();
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const iconColor = isDarkMode ? '#fdfaf1' : 'black';

  return (
    <View style={[styles.container, containerStyle]}>
      <SafeAreaView>
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
          <Title title="Yardım İste" />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inputWrapper}
        keyboardVerticalOffset={80}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Input
            setTitle={setTitle}
            setDescription={setDescription}
            setCategory={setCategory}
            setLocation={setLocation}
            onImageUploaded={setImageUrl}
          />

          <View style={styles.fixedButtonWrapper} pointerEvents="box-none">
            <View style={styles.fixedButton}>
              <Button
                title={title}
                description={description}
                category={category}
                location={location}
                username={username}
                imageUrl={imageUrl}
                uid={uid}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
  fixedButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fixedButton: {
    margin: 10,
    backgroundColor: 'transparent',
  },
});

export default AddHelperScreen;
