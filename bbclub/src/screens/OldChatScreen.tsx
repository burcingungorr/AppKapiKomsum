import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UsernameDisplay from '../components/ChatScreenComponents/usernameDisplay';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';

const OldChatScreen = ({route}: any) => {
  const {receiver} = route.params;

  const userUID = useSelector((state: any) => state.user.uid);
  const currentUsername = useSelector((state: any) => state.user.username);

  const [messages, setMessages] = useState<any[]>([]);
  const [yardimDurumu, setYardimDurumu] = useState<boolean | null>(null);

  const navigation = useNavigation<any>();
  const {isDarkMode} = useDarkMode();

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  useEffect(() => {
    if (!receiver || !currentUsername || !userUID) return;

    let unsubscribe: (() => void) | undefined;

    const fetchMessages = async () => {
      try {
        const usersSnapshot = await firestore()
          .collection('users')
          .where('username', '==', receiver)
          .get();

        if (!usersSnapshot.empty) {
          const receiverUID = usersSnapshot.docs[0].id;

          const yardimDoc = await firestore()
            .collection('users')
            .doc(userUID)
            .collection('messages')
            .doc(receiver)
            .get();

          setYardimDurumu(yardimDoc.data()?.yardımdurumu ?? null);

          unsubscribe = firestore()
            .collection('users')
            .doc(userUID)
            .collection('messages')
            .doc(receiver)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
              const docs = snapshot.docs.map(doc => doc.data());

              const days = ['Paz', 'Pzt', 'Sal', 'Çrş', 'Per', 'Cum', 'Cmt'];
              const getFormattedDateTR = (timestamp: any) => {
                const date = timestamp.toDate();
                const dayName = days[date.getDay()];
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${dayName}, ${day}.${month}.${year}`;
              };

              const enrichedMessages = [];
              let lastDate = '';

              for (const msg of docs) {
                const msgDate = getFormattedDateTR(msg.timestamp);
                if (msgDate !== lastDate) {
                  enrichedMessages.push({
                    type: 'date',
                    date: msgDate,
                  });
                  lastDate = msgDate;
                }
                enrichedMessages.push({
                  ...msg,
                  type: 'message',
                });
              }

              setMessages(enrichedMessages);
            });
        } else {
          console.warn('Alıcı bulunamadı.');
        }
      } catch (error) {
        console.error('Mesajlar alınamadı:', error);
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [receiver, currentUsername, userUID]);

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  const renderItem = ({item}: {item: any}) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      );
    }

    const isOwnMessage = item.sender === currentUsername;
    const messageStyle = isOwnMessage ? styles.myMessage : styles.theirMessage;

    return (
      <View style={messageStyle}>
        <Text style={styles.messageText}>{item.text}</Text>
        {item.timestamp && (
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.containerUser}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" color="black" size={25} />
        </TouchableOpacity>
        <UsernameDisplay receiver={receiver} />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Mesaj yok</Text>
        )}
      />

      <Text style={[styles.statusText, {color: isDarkMode ? 'white' : '#333'}]}>
        Yardım Edildi Mi? {yardimDurumu === true ? 'Evet' : 'Hayır'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingHorizontal: 25,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
  containerUser: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginTop: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3E5CB',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffe2b0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  dateContainer: {
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#fdfaf1',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#000',
  },
});

export default OldChatScreen;
