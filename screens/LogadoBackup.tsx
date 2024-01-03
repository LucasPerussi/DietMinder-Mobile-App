import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';


// Define an interface for the user type
interface User {
  name: string;
  email: string;
  picture: string;
  company: {
    com_name: string;
    com_picture: string;
  };
}

// Define an interface for the route parameters
interface RouteParams {
  // token: string;
  user: User;
}

type RootStackParamList = {
  Logado: { user: User };
};

type LogadoScreenProps = StackScreenProps<RootStackParamList, 'Logado'>;

const Logado = ({ route }: LogadoScreenProps) => {


  const { user }: RouteParams = route.params;

  // Check if user is an object before accessing its properties
  const userName = user && typeof user === 'object' ? user.name : 'Nome de Usuário Desconhecido';
  const userEmail = user && typeof user === 'object' ? user.email : 'Email Desconhecido';
  const userPicture = user && typeof user === 'object' ? user.picture : null;
  const companyName = user && typeof user === 'object' && user.company ? user.company.com_name : 'Empresa Desconhecida';
  const companyPicture = user && typeof user === 'object' && user.company ? user.company.com_picture : null;

  return (
    <View style={styles.container}>
      <Text>Logado</Text>
      <Text>Nome do usuário: {userName}</Text>
      <Text>Email do usuário: {userEmail}</Text>

      {userPicture && <Image source={{ uri: userPicture }} style={{ width: 200, height: 200 }} />}
      <Text>Nome da empresa: {companyName}</Text>
      {companyPicture && <Image source={{ uri: companyPicture }} style={{ width: 300, height: 200 }} />}
    </View>
  );
};

export default Logado;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});