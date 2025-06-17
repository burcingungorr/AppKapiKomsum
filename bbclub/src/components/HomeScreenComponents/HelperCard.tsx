import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setReceiver} from '../../redux/slice/receiverSlice';
import {HelperCardProps, LocationType} from '../../types/home';

const IMAGE_SIZE = 95;

const HelperCard: React.FC<
  HelperCardProps & {imageUrl?: string; location?: LocationType}
> = ({
  topic,
  title,
  content,
  username,
  date,
  onDelete,
  imageUrl,
  onMessagePress,
  location,
}) => {
  const currentUsername = useSelector((state: any) => state.user.username);
  const isOwner = currentUsername === username;
  const dispatch = useDispatch();
  const currentReceiver = useSelector((state: any) => state.receiver.receiver);

  const handleDelete = () => {
    Alert.alert('Silme Onayı', 'Bu yardımı silmek istiyor musunuz?', [
      {text: 'İptal', style: 'cancel'},
      {text: 'Sil', onPress: onDelete},
    ]);
  };

  const address = location
    ? [
        location.province,
        location.district,
        location.town,
        location.neighbourhood,
      ]
        .filter(Boolean)
        .join(' - ')
    : '';

  return (
    <View style={styles.card}>
      <View style={styles.topContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.topic}>{topic}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </View>

        {imageUrl && (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      {!isOwner && onMessagePress && (
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => {
            if (currentReceiver && currentReceiver !== username) {
              Alert.alert(
                'Zaten bir konuşma açık',
                'Lütfen önce mevcut konuşmayı bitirin.',
                [{text: 'Tamam', style: 'cancel'}],
              );
              return;
            }

            dispatch(setReceiver(username));
            onMessagePress(username);
          }}>
          <MaterialCommunityIcons name="message" size={28} color="#66914c" />
        </TouchableOpacity>
      )}
      <View style={styles.footer}>
        <View style={styles.userDateContainer}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.date}> - {date}</Text>
        </View>
      </View>

      {address.length > 0 && <Text style={styles.address}>{address}</Text>}

      {isOwner && (
        <TouchableOpacity style={styles.delete} onPress={handleDelete}>
          <MaterialCommunityIcons name="trash-can" size={24} color="#d9534f" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdfaf1',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  topic: {
    backgroundColor: '#E3E5CB',
    color: '#2d5217',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    marginTop: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  userDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    color: '#888',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  address: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  delete: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  messageButton: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
});

export default HelperCard;
