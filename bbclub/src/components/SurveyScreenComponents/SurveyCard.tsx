import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

interface SurveyCardProps {
  id: string;
  question: string;
  options: string[];
  username: string;
  onDelete?: () => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  id,
  question,
  options,
  username,
  onDelete,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votes, setVotes] = useState<{[option: string]: number}>({});

  const currentUsername = useSelector((state: any) => state.user.username);

  // Oy verilerini oku ve kullanıcı seçimini bul
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('surveys')
      .doc(id)
      .collection('votes')
      .onSnapshot(snapshot => {
        const voteData: {[option: string]: number} = {};
        let userVote: string | null = null;

        snapshot.forEach(doc => {
          const data = doc.data();
          const voted = data.selectedOption;

          if (voted) {
            voteData[voted] = (voteData[voted] || 0) + 1;

            if (doc.id === currentUsername) {
              userVote = voted;
            }
          }
        });

        setVotes(voteData);
        setSelectedOption(userVote);
      });

    return () => unsubscribe();
  }, [id, currentUsername]);

  const handleVote = async () => {
    if (!selectedOption) return;

    try {
      const voteRef = firestore()
        .collection('surveys')
        .doc(id)
        .collection('votes')
        .doc(currentUsername);

      await voteRef.set({selectedOption});
      Alert.alert('Oyunuz güncellendi.', 'Oy verme işlemi başarılı.');
    } catch (error) {
      console.error('Oy verme hatası:', error);
      Alert.alert('Hata', 'Oy verilirken bir sorun oluştu.');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Onay', 'Anketi silmek istiyor musunuz?', [
      {text: 'İptal', style: 'cancel'},
      {
        text: 'Sil',
        onPress: async () => {
          try {
            const surveyRef = firestore().collection('surveys').doc(id);
            const voteSnap = await surveyRef.collection('votes').get();

            const deleteVotes = voteSnap.docs.map(doc => doc.ref.delete());
            await Promise.all(deleteVotes);
            await surveyRef.delete();

            Alert.alert('Anket silindi');
            if (onDelete) onDelete();
          } catch (error) {
            console.error('Silme hatası:', error);
            Alert.alert('Hata', 'Anket silinemedi.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      {username === currentUsername && (
        <TouchableOpacity style={styles.delete} onPress={handleDelete}>
          <MaterialCommunityIcons name="trash-can" size={24} color="#d9534f" />
        </TouchableOpacity>
      )}

      <Text style={styles.question}>{question}</Text>

      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={styles.optionContainer}
          onPress={() => setSelectedOption(option)}>
          <View style={styles.radio}>
            {selectedOption === option && <View style={styles.radioSelected} />}
          </View>
          <Text style={styles.optionText}>
            {option}{' '}
            <Text style={styles.voteCount}>({votes[option] || 0})</Text>
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.voteButton}>
        <TouchableOpacity onPress={handleVote}>
          <Text style={styles.voteText}>Oyla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdfaf1',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
    position: 'relative',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ef7613',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef7613',
  },
  optionText: {
    fontSize: 16,
  },
  voteCount: {
    color: '#777',
    fontSize: 14,
  },
  voteButton: {
    backgroundColor: '#66914c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  voteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  delete: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default SurveyCard;
