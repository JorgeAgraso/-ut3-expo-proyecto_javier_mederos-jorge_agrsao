import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, TextInput, ActivityIndicator } from 'react-native';
import { getPopularMovies, searchMovies } from '../../services/tmdb';
import { MovieCard } from '../../components/MovieCard';
import { Movie } from '../../types';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants';

export default function ExploreScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark } = useApp();

  const colors = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await getPopularMovies();
      setMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      loadMovies();
      return;
    }

    try {
      setLoading(true);
      const data = await searchMovies(text);
      setMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.searchInput, { 
          backgroundColor: colors.card,
          color: colors.text,
        }]}
        placeholder="Buscar películas..."
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard movie={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  loader: {
    marginTop: 50,
  },
});