import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { posterUrl } from '../services/tmdb';
import { colors, radii, spacing } from '../theme';

function formatYear(date) {
  if (!date) return '—';
  return String(date).slice(0, 4);
}

export default function MovieListItem({ movie, onPress }) {
  const poster = posterUrl(movie.poster_path, 'w185');
  const [imageError, setImageError] = React.useState(false);
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}, ${formatYear(movie.release_date)}`}
    >
      {poster && !imageError ? (
        <Image 
          source={{ uri: poster }} 
          style={styles.poster}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.poster, styles.posterFallback]}>
          <Text style={styles.posterFallbackText}>Sem{'\n'}imagem</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.meta}>
          {formatYear(movie.release_date)}
          {typeof movie.vote_average === 'number' && movie.vote_average > 0
            ? ` · ★ ${movie.vote_average.toFixed(1)}`
            : ''}
        </Text>
        <Text style={styles.overview} numberOfLines={3}>
          {movie.overview || 'Sinopse não disponível.'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.75,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterFallbackText: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  overview: {
    color: colors.text,
    opacity: 0.85,
    fontSize: 13,
    marginTop: spacing.sm,
  },
});
