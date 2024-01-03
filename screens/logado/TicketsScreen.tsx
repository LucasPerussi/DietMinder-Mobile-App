import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Linking,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Storage from 'react-native-storage';
import { Link, Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Html from 'react-native-render-html';

interface Comments {
  cmt_id: number;
  cmt_user: number;
  cmt_txt: string;
  cmt_ticketIdentifier: string;
  cmt_authorPicture: string;
  cmt_authorName: string;
  cmt_date: Date;
  cmt_company: number;
  cmt_master: number;
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

const TicketsScreen = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalNewVisible, setModalNewVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comments[]>([]);

  const [newComment, setNewComment] = useState('');

  const handleCardPress = (item: Ticket) => {
    setSelectedTicket(item);
    setModalVisible(true);
    fetchComments(item.tkt_identifier);
  };

  const handleOpenNewTicket = () => {
    setModalNewVisible(true);
  };

  const handleCloseNewTicket = () => {
    setModalNewVisible(false);
  };

  const handleCommentChange = (text: string) => {
    setNewComment(text);
  };

  const handleSendComment = async () => {
    try {
      const token = await storage.load({ key: 'token' });

      if (!selectedTicket?.tkt_identifier) {
        throw new Error('Ticket identifier not available');
      }

      const response = await fetch(
        `http://localhost:3000/tickets/new-comment/${selectedTicket.tkt_identifier}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      // Assuming the API returns the updated comments, update the state
      const result: Comments[] = await response.json();
      setComments(result);

      // Clear the new comment input
      setNewComment('');
    } catch (error: any) {
      console.error('Error sending comment:', error.message);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
    setComments([]);
  };

  const openLink = (unique: string) => {
    let url = 'https://wetalkit.com.br/suporte/request/' + unique;
    Linking.openURL(url);
  };

  const fetchComments = async (ticketIdentifier: string) => {
    try {
      const token = await storage.load({ key: 'token' });

      if (!ticketIdentifier) {
        throw new Error('Ticket identifier not available');
      }

      const response = await fetch(
        `http://localhost:3000/tickets/comments/${ticketIdentifier}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      const result: Comments[] = await response.json();
      setComments(result);
    } catch (error: any) {
      console.error('Error fetching comments:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await storage.load({ key: 'token' });
        const response = await fetch(
          'http://localhost:3000/tickets/my-tickets-open',
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok. Status: ${response.status}`
          );
        }

        const result: Ticket[] = await response.json();
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
        <Pressable onPress={() => handleOpenNewTicket()}>
          {({ pressed }) => (
            <View style={styles.cardNew}>
              <Text style={styles.closeButtonText}>Abrir Novo Chamado</Text>
            </View>
          )}
        </Pressable>

        {loading && <Text>Loading...</Text>}
        {!loading &&
          data.map((item) => (
            <Pressable
              key={item.tkt_identifier}
              onPress={() => handleCardPress(item)}
            >
              {({ pressed }) => (
                <View style={[styles.cardTickets, getCardStyle(pressed)]}>
                  <Text style={[styles.title, { color: textColor }]}>
                    {item.tkt_title}
                  </Text>
                  <Text style={[styles.title, { color: textColor }]}>
                    Nr. {item.tkt_number}{' '}
                  </Text>
                  <View style={styles.badges}>
                    <Text style={styles.titleBadge}>
                      {item.tkt_status == 1 ? 'EM ABERTO' : ' FECHADO'}{' '}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          ))}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalTickets}>
            <ScrollView>
              <Text style={styles.modalTitleTicket}>
                {selectedTicket?.tkt_title}{' '}
              </Text>

              <View style={styles.badgesView}>
                <Text style={styles.titleBadge}>
                  {selectedTicket?.tkt_status == 1 ? 'EM ABERTO' : ' FECHADO'}{' '}
                </Text>
              </View>

              <Text style={styles.descricaoTitle}>Descrição:</Text>
              <View style={styles.htmlContainer}>
                <Html
                  source={{
                    html: selectedTicket?.tkt_description
                      ? selectedTicket?.tkt_description
                      : 'Unset',
                  }}
                  contentWidth={windowWidth}
                />
              </View>

              {comments.length > 0 && (
                <View style={styles.commentsContainer}>
                  <Text style={styles.commentsTitle}>Comentários:</Text>
                  {comments.map((comment, index) => (
                    <View key={index} style={styles.commentContainer}>
                      <View style={styles.commentHeader}>
                        <Image
                          style={styles.avatar}
                          source={{ uri: comment?.cmt_authorPicture }}
                        />

                        <Text style={styles.userName}>
                          {comment.cmt_authorName}
                        </Text>
                      </View>
                      <View>
                        <Html
                          source={{
                            html: comment?.cmt_txt
                              ? comment?.cmt_txt
                              : 'Unset',
                          }}
                          contentWidth={windowWidth}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* New Comment Form */}
              <TextInput
                label="Adicionar comentário"
                value={newComment}
                onChangeText={handleCommentChange}
                multiline
                style={{ margin: 10 }}
              />
              <Button
                mode="contained"
                onPress={handleSendComment}
                style={{ margin: 10 }}
              >
                Enviar Comentário
              </Button>

              <Pressable
                style={styles.linkButton}
                onPress={() =>
                  openLink(selectedTicket?.tkt_identifier || 'undefined')
                }
              >
                <Text style={styles.closeButtonText}>Abrir na Web</Text>
              </Pressable>
              <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalNewVisible}>
        <View style={styles.modal}>
          <View style={styles.modalTickets}>
            <Text style={styles.title}>Disponível em breve! :)</Text>

            <Pressable
              style={styles.closeButton}
              onPress={handleCloseNewTicket}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};


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
  modalTitleTicket: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
    marginRight: 30,
    marginTop: 30,
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
  cardTickets: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    elevation: 2,
  },
  cardNew: {
    margin: 10,
    padding: 20,
    borderRadius: 20,
    elevation: 2,
    backgroundColor: '#1E90FF',
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
  badgesView: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#1E90FF',
    color: '#fff',
    marginTop: 20,
    marginLeft: 10,
    width: '30%',
    textAlign: 'center',
    justifyContent: 'center'
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
  commentsContainer: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descricaoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
    marginTop:20,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentContainer: {
    // Estilos do contêiner de cada comentário
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  userName: {
    fontWeight: 'bold',
  },
});

export default TicketsScreen;
