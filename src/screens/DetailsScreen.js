import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { backdropUrl, getMovieDetails, posterUrl } from '../services/tmdb';
import { colors, radii, spacing } from '../theme';

function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatDate(date) {
  if (!date) return '—';
  const [y, m, d] = String(date).split('-');
  if (!y || !m || !d) return date;
  return `${d}/${m}/${y}`;
}

export default function DetailsScreen({ route }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovieDetails(movieId);
      setMovie(data);
    } catch (err) {
      setError(err?.message || 'Não foi possível carregar os detalhes.');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorTitle}>Ops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          onPress={load}
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!movie) return null;

  const backdrop = backdropUrl(movie.backdrop_path);
  const poster = posterUrl(movie.poster_path, 'w342');
  const runtime = formatRuntime(movie.runtime);
  const genres = (movie.genres || []).map((g) => g.name).join(' · ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {backdrop && (
        <Image source={{ uri: backdrop }} style={styles.backdrop} resizeMode="cover" />
      )}
      <View style={styles.header}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Text style={styles.posterFallbackText}>Sem imagem</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{movie.title}</Text>
          {movie.tagline ? (
            <Text style={styles.tagline}>{movie.tagline}</Text>
          ) : null}
          <View style={styles.metaRow}>
            {typeof movie.vote_average === 'number' && movie.vote_average > 0 ? (
              <Text style={styles.rating}>
                ★ {movie.vote_average.toFixed(1)}
                <Text style={styles.meta}> ({movie.vote_count || 0})</Text>
              </Text>
            ) : null}
          </View>
          <Text style={styles.meta}>Lançamento: {formatDate(movie.release_date)}</Text>
          {runtime ? <Text style={styles.meta}>Duração: {runtime}</Text> : null}
          {genres ? <Text style={styles.meta}>{genres}</Text> : null}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Sinopse</Text>
      <Text style={styles.overview}>
        {movie.overview || 'Sinopse não disponível.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  backdrop: {
    width: '100%',
    height: 200,
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: 'row',
    padding: spacing.lg,
    marginTop: -40,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: radii.md,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterFallbackText: {
    color: colors.muted,
    fontSize: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'flex-end',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  tagline: {
    color: colors.muted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  rating: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 16,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  overview: {
    color: colors.text,
    opacity: 0.9,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  errorTitle: {
    color: colors.danger,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.muted,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
  },
  retryPressed: {
    opacity: 0.7,
  },
  retryText: {
    color: colors.text,
    fontWeight: '600',
  },
});
