import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useNotesStore } from '@/store/notesStore';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Platform, ScrollView, Text, View } from 'react-native';

export default function AddNoteScreen() {
  const { addNote, saving } = useNotesStore();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [audioUri, setAudioUri] = useState<string | undefined>();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow microphone access.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(newRecording);
    } catch {
      Alert.alert('Recording error', 'Unable to start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI() ?? undefined;
      setAudioUri(uri);
      setRecording(null);
    } catch {
      Alert.alert('Recording error', 'Unable to stop recording.');
    }
  };

  const onSave = async () => {
    if (!title.trim() || !text.trim()) {
      Alert.alert('Missing info', 'Please add both title and note text.');
      return;
    }

    try {
      await addNote({
        title: title.trim(),
        text: text.trim(),
        imageUri,
        audioUri,
      });

      setTitle('');
      setText('');
      setImageUri(undefined);
      setAudioUri(undefined);

      Alert.alert('Saved', 'Your note has been stored and processed by AI.');
      router.push('/(tabs)/home');
    } catch {
      Alert.alert('Save failed', 'Could not save note. Please retry.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-4 pt-4 dark:bg-slate-950" contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Create note</Text>

      <View className="mb-3">
        <AppInput value={title} onChangeText={setTitle} placeholder="Note title" />
      </View>

      <View className="mb-4">
        <AppInput value={text} onChangeText={setText} placeholder="Write your note here..." multiline numberOfLines={8} />
      </View>

      <View className="mb-3">
        <AppButton label="Upload Image" onPress={pickImage} variant="secondary" />
      </View>
      {imageUri ? <Image source={{ uri: imageUri }} className="mb-4 h-48 w-full rounded-xl" resizeMode="cover" /> : null}

      <View className="mb-3">
        {recording ? (
          <AppButton label="Stop Recording" onPress={stopRecording} variant="danger" />
        ) : (
          <AppButton label="Record Voice" onPress={startRecording} variant="secondary" />
        )}
      </View>
      {audioUri ? <Text className="mb-4 text-sm text-slate-600 dark:text-slate-300">Voice note attached.</Text> : null}

      <AppButton label="Save with AI" onPress={onSave} loading={saving} />

      {Platform.OS === 'web' ? (
        <Text className="mt-4 text-xs text-slate-500">
          Tip: Voice recording behavior on web depends on browser support for microphone capture.
        </Text>
      ) : null}

      {saving ? <LoadingOverlay label="AI is organizing your note" /> : null}
    </ScrollView>
  );
}
