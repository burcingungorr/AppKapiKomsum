import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

const categories = [
  'Eşya Yardımı',
  'Gıda Yardımı',
  'Bilgi Paylaşımı',
  'Fiziksel Yardım',
  'Psikolojik Destek',
  'Sağlık Yardımı',
  'Acil Yardım',
  'Hayvan Yardımı',
  'Toplum Destek',
  'Çocuk Yardımı',
  'Yaşlı Bakımı',
  'Eğitim Yardımı',
  'Ev Temizliği',
  'Ulaşım Yardımı',
  'Barınma Yardımı',
  'Sosyal Destek',
  'Çevre Temizliği',
  'Aile Danışmanlığı',
  'Elektrik ve Su Desteği',
];

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  onSelectCategory,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Kategori Seç</Text>
              <ScrollView>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={styles.option}
                    onPress={() => {
                      onSelectCategory(category);
                      onClose();
                    }}>
                    <Text>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.close} onPress={onClose}>
                <Text>Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#fdfaf1',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 8,
    paddingLeft: 10,
  },
  close: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default CategoryModal;
