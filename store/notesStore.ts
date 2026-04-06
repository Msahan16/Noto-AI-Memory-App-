import { createEmbedding } from '@/services/openai';
import { createNote, fetchNotes, removeNote, updateNote } from '@/services/notes';
import { cosineSimilarity } from '@/utils/cosine';
import { NewNoteInput, Note } from '@/utils/types';
import { create } from 'zustand';

interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadNotes: () => Promise<void>;
  addNote: (input: NewNoteInput) => Promise<void>;
  editNote: (noteId: string, values: Partial<Pick<Note, 'title' | 'text'>>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  filterByTag: (tag: string | null) => void;
  semanticSearch: (query: string) => Promise<void>;
  clearFilters: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  filteredNotes: [],
  loading: false,
  saving: false,
  error: null,

  loadNotes: async () => {
    set({ loading: true, error: null });
    try {
      const allNotes = await fetchNotes();
      set({ notes: allNotes, filteredNotes: allNotes });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addNote: async (input) => {
    set({ saving: true, error: null });
    try {
      await createNote(input);
      await get().loadNotes();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ saving: false });
    }
  },

  editNote: async (noteId, values) => {
    set({ saving: true, error: null });
    try {
      await updateNote(noteId, values);
      await get().loadNotes();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ saving: false });
    }
  },

  deleteNote: async (noteId) => {
    set({ saving: true, error: null });
    try {
      await removeNote(noteId);
      await get().loadNotes();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ saving: false });
    }
  },

  filterByTag: (tag) => {
    const { notes } = get();
    if (!tag) {
      set({ filteredNotes: notes });
      return;
    }

    set({ filteredNotes: notes.filter((note) => note.tags.includes(tag)) });
  },

  semanticSearch: async (query) => {
    const trimmed = query.trim();
    const { notes } = get();

    if (!trimmed) {
      set({ filteredNotes: notes });
      return;
    }

    try {
      const queryEmbedding = await createEmbedding(trimmed);
      const ranked = notes
        .map((note) => ({
          note,
          score: cosineSimilarity(queryEmbedding, note.embedding || []),
        }))
        .sort((a, b) => b.score - a.score)
        .map((item) => item.note);

      const hasScores = ranked.some((note) => (note.embedding || []).length > 0);
      if (hasScores) {
        set({ filteredNotes: ranked });
        return;
      }

      const fallback = notes.filter((note) => {
        const haystack = `${note.title} ${note.text} ${note.summary} ${note.tags.join(' ')}`.toLowerCase();
        return haystack.includes(trimmed.toLowerCase());
      });
      set({ filteredNotes: fallback });
    } catch {
      const fallback = notes.filter((note) => {
        const haystack = `${note.title} ${note.text} ${note.summary} ${note.tags.join(' ')}`.toLowerCase();
        return haystack.includes(trimmed.toLowerCase());
      });
      set({ filteredNotes: fallback });
    }
  },

  clearFilters: () => {
    set({ filteredNotes: get().notes });
  },
}));
