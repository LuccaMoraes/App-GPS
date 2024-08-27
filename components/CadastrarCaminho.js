import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Parse from 'parse/react-native.js';

Parse.initialize('mztd62TNdIWwMtKqgZX8XPAs8nVjNkKWAzEBPQN3', 'bjkBkYiEaKV8i3PKbGZhukYfF4HzPIzlIyqAj4P7');
Parse.serverURL = 'https://parseapi.back4app.com/';

const CadastrarCaminho = () => {
  const [Caminho, ColocarCaminho] = useState(false);
  const [rota, colocarRota] = useState([]);
  const [nome, setRouteName] = useState('');
  const [initialRegion, setInitialRegion] = useState({
    latitude: -23.1123,
    longitude: -47.7229,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const watchId = useRef(null);
  const saveInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (watchId.current) {
        watchId.current.remove();
      }
      if (saveInterval.current) {
        clearInterval(saveInterval.current);
      }
    };
  }, []);

  const ComecarCaminho = async () => {
    ColocarCaminho(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a localização foi negada');
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

    saveInterval.current = setInterval(SalvarPontoAtual, 1000);
  };

  const SalvarPontoAtual = async () => {
    if (rota.length > 0) {
      const ultimoPonto = rota[rota.length - 1];
      const currentDate = new Date();

      const PontoObject = new Parse.Object('PontoRota');
      PontoObject.set('nome', nome);
      PontoObject.set('latitude', ultimoPonto.latitude);
      PontoObject.set('longitude', ultimoPonto.longitude);
      PontoObject.set('timestamp', currentDate);

      try {
        await PontoObject.save();
        console.log('Ponto salvo:', ultimoPonto);
      } catch (error) {
        console.log('Erro ao salvar ponto:', error.message);
      }
    }
  };

  const PararCaminho = async () => {
    if (watchId.current) {
      watchId.current.remove();
    }
    if (saveInterval.current) {
      clearInterval(saveInterval.current);
    }
    ColocarCaminho(false);

    if (!nome) {
      alert('Por favor, insira um nome para a rota.');
      return;
    }

    const RotaObject = new Parse.Object('rota');
    const currentDate = new Date();

    RotaObject.set('nome', nome);
    RotaObject.set('data', currentDate);
    RotaObject.set('caminho', rota);
    RotaObject.set('timestamp', currentDate);

    try {
      await RotaObject.save();
      alert('Rota salva!');
      colocarRota([]);
      setRouteName('');
    } catch (error) {
      alert('Falha em salvar rota: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Caminho Rota</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome da Rota"
        value={nome}
        onChangeText={setRouteName}
      />

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        region={initialRegion}
      >
        <Polyline
          coordinates={rota}
          strokeColor="#000"
          strokeWidth={6}
        />
        {rota.map((coord, index) => (
          <Marker key={index} coordinate={coord} />
        ))}
      </MapView>

      {Caminho ? (
        <Button title="Parar Caminho" onPress={PararCaminho} />
      ) : (
        <Button title="Começar Caminho" onPress={ComecarCaminho} />
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

export default CadastrarCaminho;
