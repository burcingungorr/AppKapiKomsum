import React from 'react';
import {View, StyleSheet} from 'react-native';
import Title from '../components/Title';
import Filter from '../components/HomeScreenComponents/Filter';
import HelperCardList from '../components/HomeScreenComponents/HelperCardsList';
import {LocationType} from '../types/home';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const [selectedLocation, setSelectedLocation] =
    React.useState<LocationType | null>(null);

  const handleLocationSelect = (location: LocationType) => {
    setSelectedLocation(location);
  };
  const {isDarkMode} = useDarkMode();
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  return (
    <View style={[styles.container, containerStyle]}>
      <Title title="Yardım İstekleri" />
      <Filter
        onCategorySelect={setSelectedCategory}
        onLocationSelect={handleLocationSelect}
      />
      <HelperCardList
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
});

export default HomeScreen;
