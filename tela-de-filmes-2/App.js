import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

const Stack = createNativeStackNavigator();
const API_KEY = 'https://www.themoviedb.org/';
function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=SUA_CHAVE_API_AQUI&language=pt-BR`)
      .then(response => {
        setMovies(response.data.results);
      })
      .catch(error => {
        console.error('Erro ao buscar filmes:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando filmes...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.movieItem}
          onPress={() => navigation.navigate('MovieDetails', { movie: item })}
        >
          <Image
            style={styles.movieImage}
            source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image' }}
          />
          <Text style={styles.movieTitle}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

function MovieDetails({ route }) {
  const { movie } = route.params;

  return (
    <View style={styles.container}>
      <Image
        style={styles.detailsImage}
        source={{ uri: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : 'https://via.placeholder.com/500x300?text=No+Image' }}
      />
      <Text style={styles.detailsTitle}>{movie.title}</Text>
      <Text style={styles.detailsOverview}>{movie.overview}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Lista de Filmes' }} />
        <Stack.Screen name="MovieDetails" component={MovieDetails} options={{ title: 'Detalhes do Filme' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  movieImage: {
    width: 80,
    height: 120,
    marginRight: 10,
  },
  movieTitle: {
    fontSize: 18,
    flexShrink: 1,
  },
  detailsImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  detailsOverview: {
    fontSize: 16,
    textAlign: 'justify',
  },
});
