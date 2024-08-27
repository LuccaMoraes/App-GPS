import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Parse from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';

const ListarRotas = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const buscarRotas = async () => {
    setLoading(true); // Inicia o carregamento
    const Rota = Parse.Object.extend('rota');
    const query = new Parse.Query(Rota);
    
    try {
      const results = await query.find();
      setRoutes(results);
    } catch (error) {
      alert('Falha ao buscar rotas: ' + error.message);
    } finally {
      setLoading(false); // Termina o carregamento
    }
  };

  useEffect(() => {
    buscarRotas();
  }, []);

  const reiniciarLista = () => {
    setRoutes([]); // Limpa a lista
    buscarRotas(); // Recarrega os dados
  };

  const renderPonto = (ponto, index) => {
    return (
      <View key={index} style={styles.ponto}>
        <Text style={styles.textoPonto}>
          Ponto {index + 1}: Latitude: {ponto.latitude}, Longitude: {ponto.longitude}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const nome = item.get('nome') || 'Sem nome';
    const caminho = item.get('caminho') || [];
    const data = item.get('timestamp') ? new Date(item.get('timestamp')) : new Date();

    return (
      <TouchableOpacity 
        style={styles.item} 
        onPress={() => navigation.navigate('MapaRota', { caminho })}
      >
        <Text style={styles.texto}>Rota ID: {item.id}</Text>
        <Text style={styles.texto}>Nome: {nome}</Text>
        <Text style={styles.texto}>Data e Hora: {data.toLocaleString()}</Text>
        <Text style={styles.texto}>Total de Pontos: {caminho.length}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Rotas Salvas</Text>
      <Button title="Reiniciar" onPress={reiniciarLista} />
      {loading ? (
        <Text style={styles.texto}>Carregando...</Text>
      ) : (
        <FlatList
          data={routes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    color: '#333333',
  },
  ponto: {
    marginTop: 5,
    paddingLeft: 10,
  },
  textoPonto: {
    fontSize: 14,
    color: '#555555',
  },
});

export default ListarRotas;
