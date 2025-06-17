import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setReceiver} from '../../redux/slice/receiverSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatAnimation from './ChatAnimation';

// React.memo ile sarmalanmış ChatListItem
const ChatListItem = React.memo(({item, onPress, onDelete}: any) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => onPress(item.username, item.hasUnread)}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        {item.hasUnread && <View style={styles.unreadDot} />}

        <Image
          source={{
            uri:
              item.avatar ||
              'https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png',
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(item.username)}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="red"
        />
      </TouchableOpacity>
    </View>
  );
});

const ChatListScreen = () => {
  const userUID = useSelector((state: any) => state.user.uid);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = firestore()
      .collection('users')
      .doc(userUID)
      .collection('messages')
      .onSnapshot(async snapshot => {
        const usernames = snapshot.docs.map(doc => doc.id);

        const promises = usernames.map(async username => {
          const userSnapshotPromise = firestore()
            .collection('users')
            .where('username', '==', username)
            .limit(1)
            .get();

          const lastMsgSnapPromise = firestore()
            .collection('users')
            .doc(userUID)
            .collection('messages')
            .doc(username)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

          const unreadSnapPromise = firestore()
            .collection('users')
            .doc(userUID)
            .collection('messages')
            .doc(username)
            .collection('messages')
            .where('sender', '==', username)
            .where('read', '==', false)
            .get();

          const [userSnapshot, lastMsgSnap, unreadSnap] = await Promise.all([
            userSnapshotPromise,
            lastMsgSnapPromise,
            unreadSnapPromise,
          ]);

          const userData = !userSnapshot.empty
            ? userSnapshot.docs[0].data()
            : null;
          const lastMessageData = lastMsgSnap.docs[0]?.data();
          const timestamp = lastMessageData?.timestamp?.toDate() ?? null;

          return {
            username,
            lastMessage: lastMessageData?.text ?? '',
            hasUnread: !unreadSnap.empty,
            avatar: userData?.avatar || null,
            timestamp,
          };
        });

        const users = (await Promise.all(promises)).sort((a, b) => {
          const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return bTime - aTime;
        });

        setChatUsers(users);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [userUID]);

  const handlePress = useCallback(
    (username: string, hasUnread: boolean) => {
      if (hasUnread) {
        dispatch(setReceiver(username));
        navigation.navigate('Chat');
      } else {
        dispatch(setReceiver(null));
        navigation.navigate('OldChat', {receiver: username});
      }
    },
    [dispatch, navigation],
  );

  const handleDeleteConversation = useCallback((username: string) => {
    Alert.alert(
      'Konuşmayı Sil',
      `${username} ile olan konuşmayı silmek istiyor musunuz?`,
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteConversation(username),
        },
      ],
      {cancelable: true},
    );
  }, []);

  const deleteConversation = async (username: string) => {
    try {
      const messagesRef = firestore()
        .collection('users')
        .doc(userUID)
        .collection('messages')
        .doc(username)
        .collection('messages');

      const snapshot = await messagesRef.get();
      const batch = firestore().batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      const mainDocRef = firestore()
        .collection('users')
        .doc(userUID)
        .collection('messages')
        .doc(username);

      batch.delete(mainDocRef);

      await batch.commit();

      setChatUsers(prev => prev.filter(user => user.username !== username));
    } catch (error) {
      console.error('Konuşma silinemedi:', error);
    }
  };

  const renderItem = useCallback(
    ({item}: any) => (
      <ChatListItem
        item={item}
        onPress={handlePress}
        onDelete={handleDeleteConversation}
      />
    ),
    [handlePress, handleDeleteConversation],
  );

  return (
    <View style={{flex: 1, padding: 16}}>
      <Text style={styles.title}>Mesaj Kutusu</Text>

      {loading ? (
        <ChatAnimation />
      ) : chatUsers.length === 0 ? (
        <Text>Mesaj yok</Text>
      ) : (
        <FlatList
          data={chatUsers}
          keyExtractor={item => item.username}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffe2b0',
    marginVertical: 5,
    borderRadius: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  lastMessage: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default ChatListScreen;
