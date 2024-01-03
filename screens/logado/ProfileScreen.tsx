// ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal, Linking, Pressable, useColorScheme, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Storage from 'react-native-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Html from "react-native-render-html";

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
  });

  interface User {
    name: string;
    email: string;
    picture: string;
    company: {
      com_name: string;
      com_picture: string;
    };
  }
  
  
const apagarDadosUsuario = async (navigation: any) => {
    try {
      await storage.remove({ key: 'user' });
      await storage.remove({ key: 'token' });
      await AsyncStorage.clear();
     
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao apagar dados do usuário:', error);
    }
  };

const ProfileScreen = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const navigation = useNavigation();
  
    useEffect(() => {
      carregarDadosUsuario();
    }, []);
  
    const carregarDadosUsuario = async () => {
      try {
        const user = await storage.load<User>({ key: 'user' });
        setUserData(user);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };
  
    return (
      <View style={styles.containerProfile}>
        {userData && userData.picture && (
          <Image source={{ uri: userData.picture }} style={styles.profileImage} />
        )}
  
        <Text style={styles.headerText}>{userData && userData.name}</Text>
        <Text style={styles.profileInfoItem}>{userData && userData.email}</Text>
        <Text style={styles.profileInfoItem}>{userData && userData.company?.com_name}</Text>
  
        <TouchableOpacity style={styles.logout} onPress={() => apagarDadosUsuario(navigation)}>
          <Text style={styles.textLogout}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default ProfileScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerProfile: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    profileInfo: {
      width: '100%',
    },
    profileInfoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    labelText: {
      fontWeight: 'bold',
      alignItems: 'center',
      marginRight: 5,
    },
    valueText: {
      flex: 1,
      alignItems: 'center',
  
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginVertical: 10,
    },
    logout: {
      width: '50%',
      margin: '25%',
      padding: 10,
      marginTop: 20,
      backgroundColor: '#333',
      color: '#fff',
      borderRadius: 20
    },
    textLogout: {
      color: '#fff',
      fontSize: 15,
      textAlign: 'center'
    }
  });
  

