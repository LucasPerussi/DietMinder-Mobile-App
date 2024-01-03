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

import BlogScreen  from './logado/BlogScreen';
import  ProfileScreen  from './logado/ProfileScreen';
import  RoomsScreen  from './logado/RoomsScreen';
import  TicketsScreen  from './logado/TicketsScreen';



function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


type LogadoTabsParamList = {
  Home: { route: any };
  Profile: undefined;
  Peso: undefined;
  Salas: undefined;
  Chamados: undefined;
};

const Tab = createBottomTabNavigator<LogadoTabsParamList>();

const LogadoTabs = ({ result }: any) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Peso"
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

export default LogadoTabs;

const styles = StyleSheet.create({});
