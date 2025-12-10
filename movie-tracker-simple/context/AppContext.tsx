import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { MovieNote, AppSettings } from '../types';

interface AppContextType {
  notes: MovieNote[];
  settings: AppSettings;
  addNote: (note: MovieNote) => void;
  deleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  isDark: boolean; // ← NUEVO
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [notes, setNotes] = useState<MovieNote[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    sortBy: 'date',
  });
  const [loaded, setLoaded] = useState(false);

  // Calcular si es dark
  const isDark = settings.theme === 'dark' || 
                 (settings.theme === 'system' && systemColorScheme === 'dark');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loaded) {
      saveNotes();
    }
  }, [notes, loaded]);

  useEffect(() => {
    if (loaded) {
      saveSettings();
    }
  }, [settings, loaded]);

  const loadData = async () => {
    try {
      const notesData = await AsyncStorage.getItem('notes');
      const settingsData = await AsyncStorage.getItem('settings');
      
      if (notesData) {
        setNotes(JSON.parse(notesData));
      }
      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoaded(true);
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      console.log('✅ Notas guardadas:', notes.length);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
      console.log('✅ Ajustes guardados');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addNote = (note: MovieNote) => {
    console.log('➕ Añadiendo nota:', note.movieTitle);
    setNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    console.log('🗑️ Eliminando nota:', id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const toggleFavorite = (id: string) => {
    console.log('❤️ Toggle favorito:', id);
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
    ));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    console.log('⚙️ Actualizando ajustes:', updates);
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ 
      notes, 
      settings, 
      addNote, 
      deleteNote, 
      toggleFavorite, 
      updateSettings,
      isDark // ← NUEVO
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};