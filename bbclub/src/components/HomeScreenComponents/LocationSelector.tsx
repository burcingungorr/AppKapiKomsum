import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import locationData from '../../data/turkey-geo.json';
import {LocationType} from '../../types/home';

export interface LocationSelectorProps {
  onLocationSelected: (location: LocationType) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelected,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedTown, setSelectedTown] = useState<string | null>(null);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<
    string | null
  >(null);

  // Veri bulma
  const currentProvinceData = locationData.find(
    p => p.Province === selectedProvince,
  );
  const currentDistrictData = currentProvinceData?.Districts.find(
    d => d.District === selectedDistrict,
  );
  const currentTownData = currentDistrictData?.Towns.find(
    t => t.Town === selectedTown,
  );

  // Seçimi onayla
  const handleConfirm = () => {
    if (
      selectedProvince &&
      selectedDistrict &&
      selectedTown &&
      selectedNeighbourhood
    ) {
      onLocationSelected({
        province: selectedProvince,
        district: selectedDistrict,
        town: selectedTown,
        neighbourhood: selectedNeighbourhood,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Konum Seç</Text>
      <View style={styles.selectedContainer}>
        {selectedProvince && (
          <TouchableOpacity
            onPress={() => {
              setSelectedProvince(null);
              setSelectedDistrict(null);
              setSelectedTown(null);
              setSelectedNeighbourhood(null);
            }}
            style={styles.selectedItem}>
            <Text>{selectedProvince} (Değiştir)</Text>
          </TouchableOpacity>
        )}
        {selectedDistrict && (
          <TouchableOpacity
            onPress={() => {
              setSelectedDistrict(null);
              setSelectedTown(null);
              setSelectedNeighbourhood(null);
            }}
            style={styles.selectedItem}>
            <Text>{selectedDistrict} (Değiştir)</Text>
          </TouchableOpacity>
        )}
        {selectedTown && (
          <TouchableOpacity
            onPress={() => {
              setSelectedTown(null);
              setSelectedNeighbourhood(null);
            }}
            style={styles.selectedItem}>
            <Text>{selectedTown} (Değiştir)</Text>
          </TouchableOpacity>
        )}
        {selectedNeighbourhood && (
          <TouchableOpacity
            onPress={() => setSelectedNeighbourhood(null)}
            style={styles.selectedItem}>
            <Text>{selectedNeighbourhood} (Değiştir)</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.selectionList}>
        {!selectedProvince &&
          locationData.map(prov => (
            <TouchableOpacity
              key={prov.Province}
              onPress={() => {
                setSelectedProvince(prov.Province);
                setSelectedDistrict(null);
                setSelectedTown(null);
                setSelectedNeighbourhood(null);
              }}
              style={styles.option}>
              <Text>{prov.Province}</Text>
            </TouchableOpacity>
          ))}

        {selectedProvince &&
          !selectedDistrict &&
          currentProvinceData?.Districts.map(dist => (
            <TouchableOpacity
              key={dist.District}
              onPress={() => {
                setSelectedDistrict(dist.District);
                setSelectedTown(null);
                setSelectedNeighbourhood(null);
              }}
              style={styles.option}>
              <Text>{dist.District}</Text>
            </TouchableOpacity>
          ))}

        {selectedDistrict &&
          !selectedTown &&
          currentDistrictData?.Towns.map(town => (
            <TouchableOpacity
              key={town.Town}
              onPress={() => {
                setSelectedTown(town.Town);
                setSelectedNeighbourhood(null);
              }}
              style={styles.option}>
              <Text>{town.Town}</Text>
            </TouchableOpacity>
          ))}

        {selectedTown &&
          !selectedNeighbourhood &&
          currentTownData?.Neighbourhoods.map((neigh, idx) => (
            <TouchableOpacity
              key={idx.toString()}
              onPress={() => setSelectedNeighbourhood(neigh)}
              style={styles.option}>
              <Text>{neigh}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {selectedProvince &&
        selectedDistrict &&
        selectedTown &&
        selectedNeighbourhood && (
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}>
            <Text style={styles.confirmText}>Seçimi Onayla</Text>
          </TouchableOpacity>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 350,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  selectedItem: {
    backgroundColor: '#e2f0d9',
    borderColor: '#66914c',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginRight: 10,
    marginVertical: 5,
    width: '100%',
    fontSize: 18,
  },
  selectionList: {
    maxHeight: 280,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: '#66914c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationSelector;
