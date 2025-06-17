import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const AddSurvey: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const location = useSelector((state: any) => state.user);
  const username = useSelector((state: any) => state.user.username);

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    const updated = [...options];
    updated.splice(index, 1);
    setOptions(updated);
  };

  const closeModal = () => {
    setModalVisible(false);
    setQuestion('');
    setOptions([]);
  };

  const saveSurvey = async () => {
    if (!question.trim() || options.length === 0) return;

    try {
      await firestore()
        .collection('surveys')
        .add({
          question,
          options,
          username: username,
          city: location.city || '',
          district: location.district || '',
          neighborhood: location.neighborhood || '',
          town: location.town || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Anket başarıyla kaydedildi!');
    } catch (error) {
      console.error('Anket kaydedilirken hata oluştu:', error);
    }

    setModalVisible(false);
    setQuestion('');
    setOptions([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Yeni Anket</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Anket Oluştur</Text>

            <TextInput
              style={styles.input}
              placeholder="Soru yazın"
              value={question}
              onChangeText={setQuestion}
              placeholderTextColor="grey"
            />

            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View style={styles.optionRow}>
                  <Text style={styles.optionItem}>{item}</Text>
                  <TouchableOpacity onPress={() => removeOption(index)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={styles.optionInputContainer}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                placeholder="Seçenek ekleyin"
                value={newOption}
                onChangeText={setNewOption}
                placeholderTextColor="grey"
              />
              <TouchableOpacity style={styles.addButton} onPress={addOption}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveSurvey}>
                <Text style={styles.modalButtonText}>Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}>
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    backgroundColor: '#66914c',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  optionItem: {
    fontSize: 16,
    color: 'black',
  },
  removeText: {
    color: 'red',
    fontSize: 18,
    paddingHorizontal: 10,
  },
  optionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#66914c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#EF7613',
  },
  cancelButton: {
    backgroundColor: 'grey',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AddSurvey;
