import React from 'react';
import {FlatList, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SelectCategoryProps} from '../../types/home';

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

const CategorySelector: React.FC<SelectCategoryProps> = ({
  onCategorySelect,
}) => {
  return (
    <>
      <Text style={styles.modalTitle}>Kategoriler</Text>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => onCategorySelect(item)}
            style={styles.categoryItem}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CategorySelector;
