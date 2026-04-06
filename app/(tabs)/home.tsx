import { EmptyState } from '@/components/EmptyState';
import { NoteCard } from '@/components/NoteCard';
import { TagChip } from '@/components/TagChip';
import { useNotesStore } from '@/store/notesStore';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const { notes, filteredNotes, loadNotes, filterByTag, semanticSearch, loading } = useNotesStore();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes]),
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((note) => note.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).slice(0, 12);
  }, [notes]);

  const onTagPress = (tag: string) => {
    const nextTag = tag === activeTag ? null : tag;
    setActiveTag(nextTag);
    filterByTag(nextTag);
  };

  const onSearch = async (text: string) => {
    setSearch(text);
    await semanticSearch(text);
  };

  return (
    <View className="flex-1 bg-slate-50 px-4 pt-4 dark:bg-slate-950">
      <Text className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">Noto AI Memory</Text>

      <View className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <TextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Search with natural language..."
          placeholderTextColor="#94A3B8"
          className="text-base text-slate-900 dark:text-slate-100"
        />
      </View>

      <View className="mb-3 flex-row flex-wrap">
        {allTags.map((tag) => (
          <TagChip key={tag} tag={`#${tag}`} active={activeTag === tag} onPress={() => onTagPress(tag)} />
        ))}
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshing={loading}
        onRefresh={loadNotes}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListEmptyComponent={
          <EmptyState title="No notes yet" subtitle="Tap the plus button and save your first memory." />
        }
      />

      <Pressable
        onPress={() => router.push('/(tabs)/add')}
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-brand-500 shadow-lg"
      >
        <Text className="text-3xl text-white">+</Text>
      </Pressable>
    </View>
  );
}
