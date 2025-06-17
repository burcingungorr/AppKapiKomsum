import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const MessageInput = ({
  receiver,
  setMessages,
}: {
  receiver: string;
  setMessages: (msgs: any[]) => void;
}) => {
  const [message, setMessage] = useState('');
  const currentUsername = useSelector((state: any) => state.user.username);
  const userUID = useSelector((state: any) => state.user.uid);

  const sendMessage = async () => {
    if (!message.trim() || !receiver) return;

    const msg = {
      sender: currentUsername,
      receiver,
      text: message.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    try {
      const usersSnapshot = await firestore()
        .collection('users')
        .where('username', '==', receiver)
        .get();

      if (usersSnapshot.empty) return console.warn('Kullanıcı bulunamadı.');

      const receiverUID = usersSnapshot.docs[0].id;

      // Gönderenin altına yaz (read bilgisi gerekmez)
      await firestore()
        .collection('users')
        .doc(userUID)
        .collection('messages')
        .doc(receiver)
        .collection('messages')
        .add(msg);

      await firestore()
        .collection('users')
        .doc(userUID)
        .collection('messages')
        .doc(receiver)
        .set({konuşmadurumu: true, yardımdurumu: false}, {merge: true});

      // Alıcının altına yaz (read: false olarak ekleniyor)
      await firestore()
        .collection('users')
        .doc(receiverUID)
        .collection('messages')
        .doc(currentUsername)
        .collection('messages')
        .add({...msg, read: false});

      await firestore()
        .collection('users')
        .doc(receiverUID)
        .collection('messages')
        .doc(currentUsername)
        .set({konuşmadurumu: true, yardımdurumu: false}, {merge: true});

      setMessage('');
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Mesaj yaz..."
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <MaterialCommunityIcons name="send" color="white" size={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 20,
    marginRight: 8,
    backgroundColor: '#fdfaf1',
  },
  sendButton: {
    backgroundColor: '#66914c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default MessageInput;
