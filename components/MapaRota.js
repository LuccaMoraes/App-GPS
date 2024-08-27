import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

const MapaRota = ({ route }) => {
  const { caminho } = route.params;

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {caminho.length > 0 && (
          <>
            <Polyline
              coordinates={caminho}
              strokeColor="#000"
              strokeWidth={6}
            />
            {caminho.map((coord, index) => (
              <Marker key={index} coordinate={coord} />
            ))}
          </>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapaRota;
