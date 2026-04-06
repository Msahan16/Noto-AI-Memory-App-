import { Note } from '@/utils/types';
import { formatDate, trimText } from '@/utils/format';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { TagChip } from './TagChip';

interface NoteCardProps {
  note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <Pressable
      onPress={() => router.push(`/note/${note.id}`)}
      className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="flex-1 pr-3 text-base font-semibold text-slate-900 dark:text-white">{note.title}</Text>
        <Text className="text-xs text-slate-500">{formatDate(note.createdAt)}</Text>
      </View>

      <Text className="mb-2 text-sm text-slate-700 dark:text-slate-300">{trimText(note.summary || note.text)}</Text>

      {note.imageUrl ? <Image source={{ uri: note.imageUrl }} className="mb-3 h-40 w-full rounded-xl" resizeMode="cover" /> : null}

      <View className="mb-2 flex-row flex-wrap items-center">
        <TagChip tag={note.category} />
        {note.tags.slice(0, 3).map((tag) => (
          <TagChip key={tag} tag={`#${tag}`} />
        ))}
      </View>
    </Pressable>
  );
};
