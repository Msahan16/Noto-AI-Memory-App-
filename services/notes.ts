import { auth, firestore, storage } from '@/services/firebase';
import { createEmbedding, summarizeAndTagNote, transcribeAudio } from '@/services/openai';
import { NewNoteInput, Note } from '@/utils/types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const getNotesCollection = (uid: string) =>
  collection(firestore, 'users', uid, 'notes');

const uploadAsset = async (uri: string, path: string): Promise<string> => {
  const blob = await fetch(uri).then((res) => res.blob());
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
};

export const fetchNotes = async (): Promise<Note[]> => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    return [];
  }

  const q = query(getNotesCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Note, 'id'>),
  }));
};

export const createNote = async (payload: NewNoteInput): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to create notes.');
  }

  const now = Date.now();
  let imageUrl = '';
  let audioUrl = '';
  let transcript = '';

  if (payload.imageUri) {
    imageUrl = await uploadAsset(payload.imageUri, `users/${user.uid}/images/${now}.jpg`);
  }

  if (payload.audioUri) {
    audioUrl = await uploadAsset(payload.audioUri, `users/${user.uid}/audio/${now}.m4a`);
    try {
      transcript = await transcribeAudio(payload.audioUri);
    } catch {
      transcript = '';
    }
  }

  const aiText = `${payload.title}\n${payload.text}\n${transcript}`.trim();

  let summary = 'AI summary unavailable.';
  let tags: string[] = [];
  let category: Note['category'] = 'Other';
  let embedding: number[] = [];

  try {
    const ai = await summarizeAndTagNote(aiText || payload.text);
    summary = ai.summary;
    tags = ai.tags;
    category = ai.category;
    embedding = await createEmbedding(aiText || payload.text);
  } catch {
    // Note creation should still work if AI endpoint is unavailable.
  }

  await addDoc(getNotesCollection(user.uid), {
    userId: user.uid,
    title: payload.title,
    text: payload.text,
    transcript,
    imageUrl,
    audioUrl,
    summary,
    tags,
    category,
    embedding,
    createdAt: now,
    updatedAt: now,
  });
};

export const updateNote = async (noteId: string, values: Partial<Pick<Note, 'title' | 'text'>>): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Not authenticated.');
  }

  await updateDoc(doc(firestore, 'users', uid, 'notes', noteId), {
    ...values,
    updatedAt: Date.now(),
  });
};

export const removeNote = async (noteId: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Not authenticated.');
  }

  await deleteDoc(doc(firestore, 'users', uid, 'notes', noteId));
};
