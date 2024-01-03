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

interface Room {
    rom_id: number;
    rom_name: string;
    rom_capacity: string;
    rom_description: string;
    rom_picture: string;
    rom_identifier: string;
    rom_passwordCrypted: string;
    rom_wifi: string;
  }
  

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
  

  const RoomsScreen = () => {
    const [userToken, setUserToken] = useState<string>('');
  
    const carregarDadosUsuario = async () => {
      try {
        const token = await storage.load({ key: 'token' });
        setUserToken(token);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };
  
    useEffect(() => {
      carregarDadosUsuario();
    }, []);
  
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [data, setData] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
  
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
    const handleCardPress = (item: Room) => {
      setSelectedRoom(item);
      setModalVisible(true);
    };
  
    const handleCloseModal = () => {
      setModalVisible(false);
      setSelectedRoom(null);
    };
  
    const openLink = (unique: string) => {
      let url = 'https://wetalkit.com.br/suporte/room/' + unique;
      Linking.openURL(url);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await storage.load({ key: 'token' });
  
          const response = await fetch('http://localhost:3000/rooms/my-company', {
            headers: {
              'Authorization': `${token}`
            },
          });
  
          if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
          }
  
          const result: Room[] = await response.json();
          setData(result);
        } catch (error: any) {
          console.error('Error fetching data:', error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const getCardStyle = (pressed: boolean) => ({
      backgroundColor: pressed ? 'lightgray' : cardBackgroundColor,
    });
  
    const cardBackgroundColor = colorScheme === 'dark' ? '#1C1C1C' : '#fff';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const { width: windowWidth } = useWindowDimensions();
  
  
    return (
      <>
        <ScrollView>
          {loading && <Text>Loading...</Text>}
          {!loading &&
            data.map((item) => (
              <Pressable
                key={item.rom_id}
                onPress={() => handleCardPress(item)}
              >
                {({ pressed }) => (
                  <View style={[styles.card, getCardStyle(pressed)]}>
                    <Image style={styles.banner} source={{ uri: item.rom_picture }} />
                    <Text style={[styles.title, { color: textColor }]}>{item.rom_name}</Text>
                  </View>
                )}
              </Pressable>
            ))}
        </ScrollView>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Image style={styles.banner} source={{ uri: selectedRoom?.rom_picture }} />
                <Text style={styles.modalTitle}>{selectedRoom?.rom_name} </Text>
  
                <View style={styles.htmlContainer}>
  
                  <Html
                    source={{
                      html: selectedRoom?.rom_description ? selectedRoom?.rom_description : 'Unset'
                    }}
                    contentWidth={windowWidth}
  
                  />
                </View>
                <Text style={styles.modalText}>Wifi: {selectedRoom?.rom_wifi} </Text>
                <Text style={styles.modalText}>Capacidade: {selectedRoom?.rom_capacity} pessoas </Text>
  
                <Pressable style={styles.linkButton} onPress={() => openLink(selectedRoom?.rom_identifier ? selectedRoom?.rom_identifier : 'undefined' + '?ctpw=' + selectedRoom?.rom_passwordCrypted)}>
                  <Text style={styles.closeButtonText}>Abrir na Web</Text>
                </Pressable>
                <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                  <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
    );
  };
  

export default RoomsScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '100%',
      height: '95%',
      position: 'absolute',
      top: '5%',
      borderRadius: 20,
      backgroundColor: '#fff',
    },
    htmlContainer: {
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'left',
      margin: 10,
    },
 
    modalText: {
      fontSize: 14,
      textAlign: 'center',
      margin: 10,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
    },
  
    linkButton: {
      width: '90%',
      margin: '5%',
      height: 50,
      borderRadius: 25,
      backgroundColor: '#4169E1',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    card: {
      margin: 10,
      paddingBottom: 20,
      borderRadius: 20,
      elevation: 2,
    },
    banner: {
      width: '100%',
      height: 200,
      borderRadius: 20,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: '#e7ebeb',
      marginBottom: 20,
    },
    title: {
      margin: 10,
      fontSize: 14,
      fontWeight: 'bold',
    },
   
   
  
 
 
  });
  

