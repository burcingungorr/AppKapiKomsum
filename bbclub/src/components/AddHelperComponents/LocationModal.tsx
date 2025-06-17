import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import locationData from '../../data/turkey-geo.json';
import {Province, District, Town} from '../../types/home';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    province: string;
    district: string;
    town: string;
    neighbourhood: string;
  }) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  onSelectLocation,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<
    string | null
  >(null);

  const resetSelection = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedTown(null);
    setSelectedNeighbourhood(null);
  };

  const handleConfirm = () => {
    if (
      selectedProvince &&
      selectedDistrict &&
      selectedTown &&
      selectedNeighbourhood
    ) {
      onSelectLocation({
        province: selectedProvince.Province,
        district: selectedDistrict.District,
        town: selectedTown.Town,
        neighbourhood: selectedNeighbourhood,
      });
      onClose();
    }
  };

  const handleClose = () => {
    resetSelection();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Konum Seç</Text>
          {selectedProvince ? (
            <TouchableOpacity
              style={[styles.option, styles.selectedOption]}
              onPress={() => {
                setSelectedProvince(null);
                setSelectedDistrict(null);
                setSelectedTown(null);
                setSelectedNeighbourhood(null);
              }}>
              <Text>{selectedProvince.Province} (Değiştir)</Text>
            </TouchableOpacity>
          ) : (
            locationData.map(prov => (
              <TouchableOpacity
                key={prov.Province}
                onPress={() => {
                  setSelectedProvince(prov);
                  setSelectedDistrict(null);
                  setSelectedTown(null);
                  setSelectedNeighbourhood(null);
                }}
                style={styles.option}>
                <Text>{prov.Province}</Text>
              </TouchableOpacity>
            ))
          )}

          {selectedProvince && (
            <>
              {selectedDistrict ? (
                <TouchableOpacity
                  style={[styles.option, styles.selectedOption]}
                  onPress={() => {
                    setSelectedDistrict(null);
                    setSelectedTown(null);
                    setSelectedNeighbourhood(null);
                  }}>
                  <Text>{selectedDistrict.District} (Değiştir)</Text>
                </TouchableOpacity>
              ) : (
                selectedProvince.Districts.map(dist => (
                  <TouchableOpacity
                    key={dist.District}
                    onPress={() => {
                      setSelectedDistrict(dist);
                      setSelectedTown(null);
                      setSelectedNeighbourhood(null);
                    }}
                    style={styles.option}>
                    <Text>{dist.District}</Text>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {selectedDistrict && (
            <>
              {selectedTown ? (
                <TouchableOpacity
                  style={[styles.option, styles.selectedOption]}
                  onPress={() => {
                    setSelectedTown(null);
                    setSelectedNeighbourhood(null);
                  }}>
                  <Text>{selectedTown.Town} (Değiştir)</Text>
                </TouchableOpacity>
              ) : (
                selectedDistrict.Towns.map(town => (
                  <TouchableOpacity
                    key={town.Town}
                    onPress={() => {
                      setSelectedTown(town);
                      setSelectedNeighbourhood(null);
                    }}
                    style={styles.option}>
                    <Text>{town.Town}</Text>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {selectedTown && (
            <>
              {selectedNeighbourhood ? (
                <TouchableOpacity
                  style={[styles.option, styles.selectedOption]}
                  onPress={() => setSelectedNeighbourhood(null)}>
                  <Text>{selectedNeighbourhood} (Değiştir)</Text>
                </TouchableOpacity>
              ) : (
                selectedTown.Neighbourhoods.map(neigh => (
                  <TouchableOpacity
                    key={neigh}
                    onPress={() => setSelectedNeighbourhood(neigh)}
                    style={styles.option}>
                    <Text>{neigh}</Text>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Seçimi Onayla</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.close} onPress={handleClose}>
            <Text>Vazgeç</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fdfaf1',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  option: {
    paddingVertical: 8,
    paddingLeft: 10,
    fontSize: 16,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#66914c',
    borderRadius: 5,
    backgroundColor: '#e2f0d9',
    marginVertical: 5,
  },
  confirm: {
    marginTop: 20,
    backgroundColor: '#e2f0d9',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  close: {
    marginVertical: 15,
    alignItems: 'center',
  },
});

export default LocationModal;
