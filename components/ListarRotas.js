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

  const renderItem = ({ item }) => {
    const nome = item.get('name') || 'Sem nome'; // Certifique-se de que o campo é 'name' se não é 'nome'
    const latitude = item.get('latitude') || [];
    const data = item.get('timestamp') ? new Date(item.get('timestamp')) : new Date(); // Certifique-se de que o campo é 'timestamp'

    return (
      <View style={styles.item}>
        <Text style={styles.texto}>Rota ID: {item.id}</Text>
        <Text style={styles.texto}>Nome: {nome}</Text>
        <Text style={styles.texto}>Pontos: {latitude.length}</Text>
        <Text style={styles.texto}>Data e Hora: {data.toLocaleString()}</Text>
      </View>
    );
  };

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
    backgroundColor: '#F5F5F5', // Adicionado para uma aparência mais suave
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333', // Melhor contraste
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#FFFFFF', // Fundo branco para melhor leitura
    marginBottom: 10, // Espaço entre itens
  },
  texto: {
    fontSize: 16,
    color: '#333333', // Melhor contraste para o texto
  },
});

export default ListarRotas;
