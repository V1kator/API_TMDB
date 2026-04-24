import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieListItem from '../components/MovieListItem';
import { searchMovies } from '../services/tmdb';
import { colors, radii, spacing } from '../theme';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const lastQueryRef = useRef('');

  const runSearch = useCallback(async (text, nextPage = 1) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }
    const isFirstPage = nextPage === 1;
    if (isFirstPage) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const data = await searchMovies({ query: trimmed, page: nextPage });
      lastQueryRef.current = trimmed;
      setHasSearched(true);
      setPage(data.page || nextPage);
      setTotalPages(data.total_pages || 0);
      setResults((prev) =>
        isFirstPage ? data.results || [] : [...prev, ...(data.results || [])]
      );
    } catch (err) {
      if (isFirstPage) setResults([]);
      setError(err?.message || 'Falha ao buscar filmes.');
    } finally {
      if (isFirstPage) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  const handleSubmit = () => {
    Keyboard.dismiss();
    runSearch(query, 1);
  };

  const handleEndReached = () => {
    if (loading || loadingMore) return;
    if (!lastQueryRef.current) return;
    if (page >= totalPages) return;
    runSearch(lastQueryRef.current, page + 1);
  };

  const renderEmpty = () => {
    if (loading) return null;
    if (!hasSearched) {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Busque um filme</Text>
          <Text style={styles.emptyText}>
            Digite um título no campo acima e toque em Buscar.
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, styles.errorTitle]}>Ops!</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <Pressable
            onPress={() => runSearch(query, 1)}
            style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Nenhum filme encontrado</Text>
        <Text style={styles.emptyText}>
          Tente outro termo — verifique a grafia ou use palavras-chave diferentes.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          placeholder="Ex.: Interestelar"
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
        />
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            (loading || pressed) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MovieListItem
              movie={item}
              onPress={() =>
                navigation.navigate('Details', {
                  movieId: item.id,
                  title: item.title,
                })
              }
            />
          )}
          contentContainerStyle={
            results.length === 0 ? styles.listEmpty : styles.listContent
          }
          ListEmptyComponent={renderEmpty}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.muted} />
              </View>
            ) : null
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#1a1407',
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  errorTitle: {
    color: colors.danger,
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
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
  footer: {
    paddingVertical: spacing.lg,
  },
});
