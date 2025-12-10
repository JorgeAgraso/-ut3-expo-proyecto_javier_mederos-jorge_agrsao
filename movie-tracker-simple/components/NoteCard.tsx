import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { MovieNote } from '../types';
import { getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';

interface NoteCardProps {
  note: MovieNote;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { toggleFavorite, deleteNote } = useApp();

  const handleDelete = () => {
    Alert.alert(
      'Eliminar nota',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteNote(note.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: getImageUrl(note.moviePoster, 'w200') }}
          style={styles.poster}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {note.movieTitle}
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star}>{star <= note.rating ? '⭐' : '☆'}</Text>
            ))}
          </View>
        </View>
      </View>

      {note.personalImage && (
        <Image
          source={{ uri: note.personalImage }}
          style={styles.personalImage}
        />
      )}

      <Text style={styles.note} numberOfLines={3}>
        {note.note}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(note.createdAt).toLocaleDateString('es-ES')}
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={() => toggleFavorite(note.id)} style={styles.actionButton}>
            <Text style={styles.actionText}>{note.isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.actionButton}>
            <Text style={styles.actionText}>🗑️</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  stars: {
    flexDirection: 'row',
  },
  personalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 20,
  },
});