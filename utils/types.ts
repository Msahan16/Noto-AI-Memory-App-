export type NoteCategory = 'Work' | 'Personal' | 'Ideas' | 'Learning' | 'Other';

export interface Note {
  id: string;
  userId: string;
  title: string;
  text: string;
  transcript?: string;
  imageUrl?: string;
  audioUrl?: string;
  summary: string;
  tags: string[];
  category: NoteCategory;
  embedding: number[];
  createdAt: number;
  updatedAt: number;
}

export interface NewNoteInput {
  title: string;
  text: string;
  imageUri?: string;
  audioUri?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}
