import React, {useEffect, useRef} from 'react';
import {FlatList, Text, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const Messages = ({
  messages,
  setMessages,
  receiver,
}: {
  messages: any[];
  setMessages: (msgs: any[]) => void;
  receiver: string;
}) => {
  const currentUsername = useSelector((state: any) => state.user.username);
  const userUID = useSelector((state: any) => state.user.uid);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!receiver || !currentUsername || !userUID) return;

    let unsubscribe: (() => void) | undefined;

    const getFormattedDateTR = (timestamp: any) => {
      if (!timestamp?.toDate) return '';
      const date = timestamp.toDate();
      const days = ['Paz', 'Pzt', 'Sal', 'Çrş', 'Per', 'Cum', 'Cmt'];
      const dayName = days[date.getDay()];
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${dayName}, ${day}.${month}.${year}`;
    };

    const fetchMessages = async () => {
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .where('username', '==', receiver)
          .get();

        const receiverUID = userSnapshot.docs[0]?.id;
        if (!receiverUID) return;

        // Okunmamış mesajları "read: true" yap
        const unreadSnapshot = await firestore()
          .collection('users')
          .doc(userUID)
          .collection('messages')
          .doc(receiver)
          .collection('messages')
          .where('read', '==', false)
          .where('sender', '==', receiver)
          .get();

        const batch = firestore().batch();
        unreadSnapshot.forEach(doc => {
          batch.update(doc.ref, {read: true});
        });
        await batch.commit();

        unsubscribe = firestore()
          .collection('users')
          .doc(userUID)
          .collection('messages')
          .doc(receiver)
          .collection('messages')
          .orderBy('timestamp', 'asc')
          .onSnapshot(snapshot => {
            const docs = snapshot.docs.map(doc => doc.data());
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

        return () => unsubscribe && unsubscribe();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [receiver, currentUsername, userUID]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const formatTime = (timestamp: any) => {
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

    const isMyMessage = item.sender === currentUsername;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.theirMessageContainer,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        {item.timestamp && (
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dateContainer: {
    alignSelf: 'center',
    marginVertical: 15,
    backgroundColor: '#fdfaf1',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#000',
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 7,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3E5CB',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffe2b0',
  },
  messageText: {
    fontSize: 18,
    color: '#000',
  },
  timestamp: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default Messages;
