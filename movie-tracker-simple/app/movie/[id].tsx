import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getMovieDetails, getImageUrl } from '../../services/tmdb';
import { useApp } from '../../context/AppContext';
import { Movie, MovieNote } from '../../types';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { notes, addNote, deleteNote } = useApp();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [rating, setRating] = useState(5);
  const [personalImage, setPersonalImage] = useState<string | null>(null);

  // Buscar si ya existe una nota para esta película
  const existingNote = notes.find(n => n.movieId === Number(id));

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const data = await getMovieDetails(Number(id));
      setMovie(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar la película');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPersonalImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPersonalImage(result.assets[0].uri);
    }
  };

  const handleImageAction = () => {
    Alert.alert('Añadir imagen', 'Elige una opción', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Galería', onPress: pickImage },
      { text: 'Cámara', onPress: takePhoto },
    ]);
  };

  const handleSaveNote = () => {
    if (!movie || !noteText.trim()) {
      Alert.alert('Error', 'Escribe una nota antes de guardar');
      return;
    }

    const newNote: MovieNote = {
      id: Date.now().toString(),
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster_path,
      note: noteText,
      personalImage,
      rating,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    addNote(newNote);
    Alert.alert('¡Listo!', 'Tu nota ha sido guardada', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleDeleteNote = () => {
    if (existingNote) {
      Alert.alert(
        'Eliminar nota',
        '¿Estás seguro?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => {
            deleteNote(existingNote.id);
            router.back();
          }},
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  if (!movie) return null;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: getImageUrl(movie.backdrop_path, 'w500') }}
        style={styles.backdrop}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: getImageUrl(movie.poster_path, 'w200') }}
            style={styles.poster}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.year}>{movie.release_date?.split('-')[0]}</Text>
            <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.overview}>{movie.overview || 'Sin descripción'}</Text>
        </View>

        {/* Mostrar nota existente */}
        {existingNote && (
          <View style={styles.section}>
            <View style={styles.existingNoteHeader}>
              <Text style={styles.sectionTitle}>Tu nota</Text>
              <Pressable onPress={handleDeleteNote}>
                <Text style={styles.deleteButton}>🗑️ Eliminar</Text>
              </Pressable>
            </View>
            
            <View style={styles.existingNote}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.star}>
                    {star <= existingNote.rating ? '⭐' : '☆'}
                  </Text>
                ))}
              </View>
              
              {existingNote.personalImage && (
                <Image 
                  source={{ uri: existingNote.personalImage }} 
                  style={styles.existingImage} 
                />
              )}
              
              <Text style={styles.existingNoteText}>{existingNote.note}</Text>
              <Text style={styles.existingNoteDate}>
                {new Date(existingNote.createdAt).toLocaleDateString('es-ES')}
              </Text>
            </View>
          </View>
        )}

        {/* Formulario solo si NO hay nota */}
        {!existingNote && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Añadir Nota Personal</Text>
            
            <Text style={styles.label}>Tu valoración</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)}>
                  <Text style={styles.star}>{star <= rating ? '⭐' : '☆'}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Imagen (opcional)</Text>
            {personalImage ? (
              <View>
                <Image source={{ uri: personalImage }} style={styles.previewImage} />
                <Pressable onPress={() => setPersonalImage(null)} style={styles.removeButton}>
                  <Text>❌ Quitar imagen</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={handleImageAction} style={styles.imageButton}>
                <Text>📷 Añadir imagen</Text>
              </Pressable>
            )}

            <Text style={styles.label}>Tu nota</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tus pensamientos sobre esta película..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
            />

            <Pressable onPress={handleSaveNote} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Guardar Nota</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginTop: -60,
    marginBottom: 24,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  year: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  rating: {
    fontSize: 16,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  existingNoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    fontSize: 14,
    color: '#e74c3c',
  },
  existingNote: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  existingImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 12,
  },
  existingNoteText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  existingNoteDate: {
    fontSize: 12,
    color: '#999',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 28,
  },
  imageButton: {
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    marginTop: 8,
    padding: 8,
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});