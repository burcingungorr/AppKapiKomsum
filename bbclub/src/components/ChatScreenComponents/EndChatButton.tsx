import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {clearReceiver} from '../../redux/slice/receiverSlice';

const EndChatButton = ({
  receiverUsername,
  setMessages,
}: {
  receiverUsername: string;
  setMessages: any;
}) => {
  const navigation = useNavigation<any>();
  const [showModal, setShowModal] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const currentUID = useSelector((state: any) => state.user.uid);
  const currentUsername = useSelector((state: any) => state.user.username);
  const dispatch = useDispatch();

  const confirmClearReceiver = () => setShowModal(true);

  const getReceiverUID = async (username: string): Promise<string | null> => {
    const snapshot = await firestore()
      .collection('users')
      .where('username', '==', username)
      .get();
    if (!snapshot.empty) return snapshot.docs[0].id;
    return null;
  };

  const handleClose = async (yardimEttiMi: boolean) => {
    if (!receiverUsername || !currentUsername) {
      console.warn('Eksik bilgi: alıcı veya kullanıcı yok');
      setShowModal(false);
      return;
    }

    const receiverUID = await getReceiverUID(receiverUsername);
    if (!receiverUID) {
      console.warn('Alıcı bulunamadı');
      setShowModal(false);
      return;
    }

    try {
      // 1️⃣ Önce mesaj olup olmadığını kontrol et
      const messagesSnapshot = await firestore()
        .collection('users')
        .doc(currentUID)
        .collection('messages')
        .doc(receiverUsername)
        .collection('messages')
        .limit(1)
        .get();

      const hasMessages = !messagesSnapshot.empty;

      // 2️⃣ Eğer mesaj yoksa sadece receiver'ı temizle
      if (!hasMessages) {
        console.log('Hiç mesaj yok, sadece receiver temizleniyor...');
        setMessages([]);
        setShowModal(false);
        dispatch(clearReceiver());
        navigation.navigate('MainTabs', {
          screen: 'ChatScreen',
          params: {receiver: null},
        });
        return;
      }

      // 3️⃣ Mesaj varsa konuşma durumu güncellenir
      await firestore()
        .collection('users')
        .doc(currentUID)
        .collection('messages')
        .doc(receiverUsername)
        .set(
          {
            konuşmadurumu: false,
            yardımdurumu: yardimEttiMi,
          },
          {merge: true},
        );

      await firestore()
        .collection('users')
        .doc(receiverUID)
        .collection('messages')
        .doc(currentUsername)
        .set(
          {
            konuşmadurumu: false,
            yardımdurumu: yardimEttiMi,
          },
          {merge: true},
        );

      setShowModal(false);

      if (yardimEttiMi) {
        setRatingModal(true);
      } else {
        finalizeEndChat();
      }
    } catch (error) {
      console.error('Konuşma durumu güncellenemedi:', error);
      setShowModal(false);
      dispatch(clearReceiver());
      navigation.replace('ChatScreen', {receiver: null});
    }
  };

  const finalizeEndChat = () => {
    setMessages([]);
    setShowModal(false);
    setRatingModal(false);
    setSelectedRating(null);
    dispatch(clearReceiver());
    navigation.navigate('MainTabs', {
      screen: 'ChatScreen',
      params: {receiver: null},
    });
  };

  const submitRating = async () => {
    if (selectedRating == null) {
      // Puan seçilmediyse direk chat bitir
      finalizeEndChat();
      return;
    }

    const receiverUID = await getReceiverUID(receiverUsername);
    if (!receiverUID) {
      finalizeEndChat();
      return;
    }

    try {
      const userDocRef = firestore().collection('users').doc(receiverUID);
      const doc = await userDocRef.get();

      const existingData = doc.data()?.totalpoint || {
        total: 0,
        count: 0,
        average: 0,
      };

      const updatedTotal = existingData.total + selectedRating;
      const updatedCount = existingData.count + 1;
      const updatedAverage = updatedTotal / updatedCount;

      await userDocRef.set(
        {
          totalpoint: {
            total: updatedTotal,
            count: updatedCount,
            average: updatedAverage,
          },
        },
        {merge: true},
      );
    } catch (error) {
      console.error('Puan verilirken hata oluştu:', error);
    } finally {
      finalizeEndChat();
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={confirmClearReceiver}>
        <Text style={styles.buttonText}>Konuşmayı Bitir</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Yardım edildi mi?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => handleClose(true)}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={() => handleClose(false)}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={ratingModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => {
            setRatingModal(false);
            finalizeEndChat();
          }}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Komşunu Oyla!</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSelectedRating(star)}>
                  <Text
                    style={[
                      styles.star,
                      selectedRating && star <= selectedRating
                        ? styles.selectedStarText
                        : styles.unselectedStarText,
                    ]}>
                    {star <= (selectedRating ?? 0) ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.modalButton, styles.yesButton, {marginTop: 15}]}
              onPress={submitRating}>
              <Text style={styles.modalButtonText}>Puanı Gönder</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '40%',
    position: 'absolute',
    bottom: 70,
    left: 120,
    zIndex: 999,
  },

  buttonText: {
    color: '#EF7613',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fdfaf1',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  yesButton: {
    backgroundColor: '#66914c',
    marginRight: 5,
  },
  noButton: {
    backgroundColor: 'gray',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  star: {
    fontSize: 30,
    marginHorizontal: 20,
  },
  selectedStarText: {
    color: '#EF7613', // Altın rengi (seçili yıldızlar)
  },
  unselectedStarText: {
    color: '#aaa', // Gri ton (boş yıldızlar)
  },
});

export default EndChatButton;
