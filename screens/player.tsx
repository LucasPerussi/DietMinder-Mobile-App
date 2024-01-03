import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Player: React.FC<{ route: { params: { titulo: string } } }> = ({ route }) => {
  const { titulo } = route.params;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    paddingBottom: 20,
    borderRadius: 20,
    elevation: 2,
  },
  title: {
    margin: 10,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    color: '#fff',
  },
});

export default Player;