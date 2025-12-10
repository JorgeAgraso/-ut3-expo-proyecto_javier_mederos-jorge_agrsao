import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants';

export default function SettingsScreen() {
  const { notes, settings, updateSettings, isDark } = useApp();
  
  const colors = isDark ? COLORS.dark : COLORS.light;

  const themes = [
    { value: 'light', label: 'Claro', icon: '☀️' },
    { value: 'dark', label: 'Oscuro', icon: '🌙' },
    { value: 'system', label: 'Sistema', icon: '📱' },
  ];

  const sortOptions = [
    { value: 'date', label: 'Fecha', icon: '📅' },
    { value: 'rating', label: 'Valoración', icon: '⭐' },
    { value: 'title', label: 'Título', icon: '🔤' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Estadísticas */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Estadísticas</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🎬</Text>
            <View>
              <Text style={[styles.statValue, { color: colors.text }]}>{notes.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Notas totales</Text>
            </View>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>❤️</Text>
            <View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {notes.filter(n => n.isFavorite).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favoritos</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tema */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tema</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {themes.map((theme) => (
            <Pressable
              key={theme.value}
              style={styles.option}
              onPress={() => updateSettings({ theme: theme.value as any })}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>{theme.icon}</Text>
                <Text style={[styles.optionText, { color: colors.text }]}>{theme.label}</Text>
              </View>
              {settings.theme === theme.value && (
                <Text style={[styles.check, { color: colors.primary }]}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Ordenar */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ordenar notas por</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {sortOptions.map((option) => (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => updateSettings({ sortBy: option.value as any })}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={[styles.optionText, { color: colors.text }]}>{option.label}</Text>
              </View>
              {settings.sortBy === option.value && (
                <Text style={[styles.check, { color: colors.primary }]}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Versión</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>API</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>TMDB</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 16,
  },
  check: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});