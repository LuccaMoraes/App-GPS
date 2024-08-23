import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Parse from 'parse/react-native.js';


// Inicialize o Parse
Parse.initialize('mztd62TNdIWwMtKqgZX8XPAs8nVjNkKWAzEBPQN3', 'bjkBkYiEaKV8i3PKbGZhukYfF4HzPIzlIyqAj4P7');
Parse.serverURL = 'https://parseapi.back4app.com/';

const ExibirCaminho = () => {
  const [Caminho, ColocarCaminho] = useState(false);
  const [route, colocarRota] = useState([]);
  const [routeName, setRouteName] = useState('');
  const [initialRegion, setInitialRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const watchId = useRef(null);

  useEffect(() => {
    // Cleanup function to stop watching location when the component unmounts
    return () => {
      if (watchId.current) {
        watchId.current.remove();
      }
    };
  }, []);

  const ComecarCaminho = async () => {
    ColocarCaminho(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    watchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const newCoord = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        colocarRota((prevRoute) => [...prevRoute, newCoord]);
        setInitialRegion({
          ...initialRegion,
          latitude: newCoord.latitude,
          longitude: newCoord.longitude,
        });
        console.log('Nova localização capturada:', newCoord);
      }
    );
  };

  const PararCaminho = async () => {
    if (watchId.current) {
      watchId.current.remove();
    }
    ColocarCaminho(false);
    const RouteObject = new Parse.Object('Rota');

    const latitudeArray = route.map(coord => coord.latitude);
    const longitudeArray = route.map(coord => coord.longitude);
    const currentDate = new Date();

    RouteObject.set('latitude', latitudeArray);
    RouteObject.set('longitude', longitudeArray);
    RouteObject.set('name', routeName);
    RouteObject.set('timestamp', currentDate);

    try {
      await RouteObject.save();
      alert('Route saved successfully!');
      colocarRota([]);
      setRouteName('');
    } catch (error) {
      alert('Falha em salvar rota: ' + error.message);
      console.error('Erro ao salvar a rota:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Caminho Route</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome da Rota"
        value={routeName}
        onChangeText={setRouteName}
      />

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        region={initialRegion}
      >
        <Polyline
          coordinates={route}
          strokeColor="#000"
          strokeWidth={6}
        />
        {route.map((coord, index) => (
          <Marker key={index} coordinate={coord} />
        ))}
      </MapView>

      {Caminho ? (
        <Button title="Stop Caminho" onPress={PararCaminho} />
      ) : (
        <Button title="Start Caminho" onPress={ComecarCaminho} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
});

export default ExibirCaminho;
