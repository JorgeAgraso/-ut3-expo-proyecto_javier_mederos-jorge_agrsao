import { StyleSheet, FlatList, View, Text } from 'react-native';
import { useApp } from '../../context/AppContext';
import { NoteCard } from '../../components/NoteCard';
import { COLORS } from '../../constants';

export default function FavoritesScreen() {
  const { notes, settings, isDark } = useApp();
  
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  const favorites = notes.filter(n => n.isFavorite);
  
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (settings.sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (settings.sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      return a.movieTitle.localeCompare(b.movieTitle);
    }
  });

  console.log('❤️ Favoritos ordenados por:', settings.sortBy, '- Total:', sortedFavorites.length);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {sortedFavorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>❤️</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            No tienes favoritos aún
          </Text>
          <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
            Marca películas como favoritas desde Explorar
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteCard note={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
});