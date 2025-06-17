import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import CategorySelector from './CategorySelector';
import LocationSelector from './LocationSelector';
import {FiltreProps, LocationType} from '../../types/home';

const Filtre: React.FC<FiltreProps> = ({
  onCategorySelect,
  onLocationSelect,
}) => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionType, setSelectionType] = useState<
    'category' | 'location' | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocationText, setSelectedLocationText] = useState<
    string | null
  >(null);

  const handlePress = () => {
    setModalVisible(true);
    setSelectionType(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectionType(null);
  };

  const handleCategorySelected = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
    closeModal();
  };

  const handleLocationSelected = (location: LocationType) => {
    const {province, district, town, neighbourhood} = location;
    setSelectedLocationText(
      `${province} / ${district} / ${town} / ${neighbourhood}`,
    );
    onLocationSelect(location);
    closeModal();
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    onCategorySelect(null);
  };
  const handleClearLocation = () => {
    setSelectedLocationText(null);
    onLocationSelect({
      province: '',
      district: '',
      town: '',
      neighbourhood: '',
    });
  };

  const renderSelectionMenu = () => (
    <>
      <Text style={styles.modalTitle}>Filtreleme Türünü Seç</Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setSelectionType('category')}>
        <Text style={styles.optionText}>Kategoriye Göre</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setSelectionType('location')}>
        <Text style={styles.optionText}>Şehir / İlçe / Bölge / Mahalle</Text>
      </TouchableOpacity>
    </>
  );

  const renderList = () => {
    switch (selectionType) {
      case 'category':
        return <CategorySelector onCategorySelect={handleCategorySelected} />;
      case 'location':
        return <LocationSelector onLocationSelected={handleLocationSelected} />;
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <MaterialCommunityIcons
            name="filter-variant"
            color="#EF7613"
            size={25}
          />
          <Text style={styles.buttonText}>
            Kategoriye/Mahalleye Göre Filtrele
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonNavigate}
          onPress={() => navigation.navigate('AddHelper')}>
          <MaterialCommunityIcons
            name="pencil-plus-outline"
            size={25}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {selectedCategory && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>{selectedCategory}</Text>
          <TouchableOpacity onPress={handleClearCategory}>
            <Text style={styles.clearText}>x</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedLocationText && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>{selectedLocationText}</Text>
          <TouchableOpacity onPress={handleClearLocation}>
            <Text style={styles.clearText}>x</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <MaterialCommunityIcons name="close" size={25} color="black" />
            </TouchableOpacity>
            {selectionType === null ? renderSelectionMenu() : renderList()}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ffe2b0',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 15,
  },
  buttonNavigate: {
    marginLeft: 16,
    backgroundColor: '#ffe2b0',
    padding: 10,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fdfaf1',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    maxHeight: 400,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 12,
    backgroundColor: '#ffe2b0',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionText: {
    fontWeight: 'bold',
  },
  selectedBox: {
    padding: 10,
    flexDirection: 'row',
    borderRadius: 10,
  },
  selectedText: {
    fontWeight: 'bold',
    marginTop: 4,
    marginLeft: 12,
    fontSize: 16,
  },
  clearText: {
    fontSize: 18,
    color: 'red',
    marginLeft: 10,
  },
});

export default Filtre;
