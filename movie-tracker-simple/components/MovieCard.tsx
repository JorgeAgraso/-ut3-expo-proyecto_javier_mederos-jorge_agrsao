import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();
  const { notes, toggleFavorite, isDark } = useApp();
  
  const colors = isDark ? COLORS.dark : COLORS.light;

  // Buscar si existe una nota para esta película
  const movieNote = notes.find(n => n.movieId === movie.id);

  const handlePress = () => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: movie.id.toString() }
    } as any);
  };

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    if (movieNote) {
      toggleFavorite(movieNote.id);
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={handlePress}
    >
      <Image
        source={{ uri: getImageUrl(movie.poster_path, 'w200') }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={[styles.year, { color: colors.textSecondary }]}>
          {movie.release_date?.split('-')[0] || 'N/A'}
        </Text>
        <View style={styles.bottom}>
          <Text style={[styles.rating, { color: colors.text }]}>
            ⭐ {movie.vote_average.toFixed(1)}
          </Text>
          
          {movieNote && (
            <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
              <Text style={styles.favoriteIcon}>
                {movieNote.isFavorite ? '❤️' : '🤍'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: 100,
    height: 150,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  year: {
    fontSize: 14,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});