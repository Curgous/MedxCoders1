import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, Image } from 'react-native';

const videos = [
  {
    id: 1,
    title: 'CPR Demonstration',
    url: 'https://youtu.be/YEsQ36KeETo?si=-ooArCfQ8Jo5dQPw',
    thumbnail: 'https://img.youtube.com/vi/YEsQ36KeETo/hqdefault.jpg',
  },
  {
    id: 2,
    title: 'Demo to use Epi-pen',
    url: 'https://youtu.be/f2tCYa1JtC8?si=thzti5gbyrljLqeY',
    thumbnail: 'https://img.youtube.com/vi/f2tCYa1JtC8/hqdefault.jpg',
  },
];

export default function EmergencyCareVideos() {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => alert('Failed to open link:', err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Emergency Care Videos</Text>
      {videos.map((video) => (
        <TouchableOpacity key={video.id} style={styles.videoCard} onPress={() => openLink(video.url)}>
          <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
          <Text style={styles.title}>{video.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#eaf7fa',
    marginTop: 22,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#3a4d5c',
  },
  videoCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  title: {
    padding: 12,
    fontSize: 16,
    color: '#205099',
    fontWeight: 'bold',
  },
});
