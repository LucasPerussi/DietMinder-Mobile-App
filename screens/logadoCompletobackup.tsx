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


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

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


interface Ticket {
  tkt_id: number;
  tkt_author: number;
  tkt_email: string;
  tkt_title: string;
  tkt_description: string;
  tkt_identifier: string;
  tkt_number: string;
  tkt_company: number;
  tkt_status: number;
  tkt_urgency: number;
  tkt_type: number;
  tkt_room: number;
  tkt_response_limit: Date;
  tkt_recovery_limit: Date;
  tkt_due_date: Date;
  tkt_created_at: Date;
}




interface Content {
  cnt_id: number;
  cnt_banner: string;
  cnt_title: string;
  cnt_description: string;
  cnt_textPreview: string;
  cnt_contentLink: string;
  cnt_unique: string;
}

interface User {
  name: string;
  email: string;
  picture: string;
  company: {
    com_name: string;
    com_picture: string;
  };
}

interface RouteParams {
  user: User;
}

type RootStackParamList = {
  LogadoTabs: undefined;
};

type LogadoTabsParamList = {
  Home: { route: any };
  Profile: undefined;
  Blog: undefined;
  Salas: undefined;
  Chamados: undefined;
};

const apagarDadosUsuario = async (navigation: any) => {
  try {
    await storage.remove({ key: 'user' });
    await storage.remove({ key: 'token' });
    navigation.navigate('Login');
  } catch (error) {
    console.error('Erro ao apagar dados do usuário:', error);
  }
};

const Tab = createBottomTabNavigator<LogadoTabsParamList>();
const HomeStack = createStackNavigator<LogadoTabsParamList>();

const HomeScreenComponent = ({ route }: { route: any }) => {
  const { user }: RouteParams = route.params || {};

  return (
    <View style={styles.container}>
      <Text>Logado</Text>
      <Text>Nome do usuário: {user.name}</Text>
      <Text>Email do usuário: {user.email}</Text>

      {user.picture && <Image source={{ uri: user.picture }} style={{ width: 200, height: 200 }} />}
      <Text>Nome da empresa: {user.company?.com_name || 'Empresa Desconhecida'}</Text>
      {user.company?.com_picture && <Image source={{ uri: user.company.com_picture }} style={{ width: 300, height: 200 }} />}
    </View>
  );
};

const LogadoTabs = ({ result }: any) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Blog"
        component={BlogScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Salas"
        component={RoomsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="building" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chamados"
        component={TicketsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comments" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
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


// **************   ROOMS **********************

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

        const response = await fetch('http://192.168.15.6:3000/rooms/my-company', {
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



// ************** CHAMADOS **************************
const TicketsScreen = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleCardPress = (item: Ticket) => {
    setSelectedTicket(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  const openLink = (unique: string) => {
    let url = 'https://wetalkit.com.br/suporte/request/' + unique;
    Linking.openURL(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await storage.load({ key: 'token' });
        const response = await fetch('http://192.168.15.6:3000/tickets/my-tickets-open', {
          headers: {
            'Authorization': `${token}`
          },
        });        

        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
  
        const text = await response.text();
  
        // Verificar se o texto não está vazio antes de fazer o parse JSON
        if (text.trim() === '') {
          throw new Error('Empty response');
        }
  
        const result: Ticket[] = JSON.parse(text);
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
              key={item.tkt_identifier}
              onPress={() => handleCardPress(item)}
            >
              {({ pressed }) => (
                <View style={[styles.cardTickets, getCardStyle(pressed)]}>
                  <Text style={[styles.title, { color: textColor }]}>{item.tkt_title}</Text>
                  <Text style={[styles.title, { color: textColor }]}>Nr. {item.tkt_number} </Text>
                  <View style={styles.badges}>
                      <Text style={styles.titleBadge}>{item.tkt_status == 1  ? 'EM ABERTO' : ' FECHADO'} </Text>

                  </View>
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
          <View style={styles.modalTickets}>
            <ScrollView>
              <Text style={styles.modalTitleTicket}>{selectedTicket?.tkt_title} </Text>
              <View style={styles.htmlContainer}>

                <Html
                  source={{
                    html: selectedTicket?.tkt_description ? selectedTicket?.tkt_description : 'Unset'
                  }}
                  contentWidth={windowWidth}

                />
              </View>


              <Pressable style={styles.linkButton} onPress={() => openLink(selectedTicket?.tkt_identifier ? selectedTicket?.tkt_identifier : 'undefined')}>
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

// ************ BLOG *******************
const BlogScreen = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const handleCardPress = (item: Content) => {
    setSelectedContent(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedContent(null);
  };

  const openLink = (unique: string) => {
    let url = 'https://wetalkit.com.br/suporte/content/' + unique;
    Linking.openURL(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.15.6:3000/contents/all-public');
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const result: Content[] = await response.json();
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
              key={item.cnt_id}
              onPress={() => handleCardPress(item)}
            >
              {({ pressed }) => (
                <View style={[styles.card, getCardStyle(pressed)]}>
                  <Image style={styles.banner} source={{ uri: item.cnt_banner }} />
                  <Text style={[styles.title, { color: textColor }]}>{item.cnt_title}</Text>
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
              <Image style={styles.banner} source={{ uri: selectedContent?.cnt_banner }} />
              <Text style={styles.modalTitle}>{selectedContent?.cnt_title} </Text>
              <View style={styles.htmlContainer}>

                <Html
                  source={{
                    html: selectedContent?.cnt_description ? selectedContent?.cnt_description : 'Unset'
                  }}
                  contentWidth={windowWidth}

                />
              </View>


              <Pressable style={styles.linkButton} onPress={() => openLink(selectedContent?.cnt_unique ? selectedContent?.cnt_unique : 'undefined')}>
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

export default LogadoTabs;

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
  modalTickets: {
    padding: 10,
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
  modalTitleTicket: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
    marginRight:30,
    marginTop: 30,
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
  containerProfile: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  cardTickets: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    elevation: 2,
  },
  badges: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#1E90FF',
    color: '#fff',
    marginTop: 20,
    width: '30%',
    textAlign: 'center',
    justifyContent: 'center'
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
  titleBadge: {
    margin: 5,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
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
