import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Parse from 'parse/react-native.js';

const ListarRotas = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const buscarRotas = async () => {
      const Rota = Parse.Object.extend('Rota');
      const query = new Parse.Query(Rota);
      try {
        const results = await query.find();
        setRoutes(results);
      } catch (error) {
        alert('Falha ao buscar rotas: ' + error.message);
      }
    };

    buscarRotas();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.texto}>Rota ID: {item.id}</Text>
      <Text style={styles.texto}>Nome: {item.get('nome') || 'Sem nome'}</Text>
      <Text style={styles.texto}>Pontos: {item.get('latitude')?.length || 0}</Text>
      <Text style={styles.texto}>Data e Hora: {item.get('data')?.toLocaleString() || 'Sem data'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Rotas Salvas</Text>
      <FlatList
        data={routes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  texto: {
    fontSize: 16,
  },
});

export default ListarRotas;
