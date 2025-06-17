import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import UsernameDisplay from '../components/ChatScreenComponents/usernameDisplay';
import EndChatButton from '../components/ChatScreenComponents/EndChatButton';
import Messages from '../components/ChatScreenComponents/Messages';
import MessageInput from '../components/ChatScreenComponents/MessageInput';
import ChatListScreen from '../components/ChatScreenComponents/ChatListScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const receiver = useSelector((state: any) => state.receiver.receiver);
  const [messages, setMessages] = useState<any[]>([]);
  const {isDarkMode} = useDarkMode();

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  if (!receiver) {
    return (
      <View style={[styles.containerother, containerStyle]}>
        <ChatListScreen />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={isDarkMode ? 'white' : 'black'}
            size={25}
          />
        </TouchableOpacity>

        <UsernameDisplay receiver={receiver} />
      </View>

      <EndChatButton receiverUsername={receiver} setMessages={setMessages} />
      <Messages
        messages={messages}
        setMessages={setMessages}
        receiver={receiver}
      />
      <MessageInput receiver={receiver} setMessages={setMessages} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
  containerother: {
    flex: 1,
    backgroundColor: '#faf2dc',
    paddingTop: 28,
    paddingHorizontal: 5,
  },
  backButton: {
    marginLeft: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
});

export default ChatScreen;
