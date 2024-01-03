import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react';
import {widthToDP as wp, heightToDP as hp} from "react-native-responsive-screens"
import { LoginStack } from '../src/types/stackParam'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import Storage from 'react-native-storage';

import Animated, {FadeInUp, FadeOut} from "react-native-reanimated"
type User = {
  name: string;
  email: string;
  picture: string;
  company: {
    com_name: string;
    com_picture: string;
  };
};

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const LoginScreen = ({navigation}: LoginStack) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User>()

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.user) {

        await storage.remove({ key: 'user' });
        await storage.remove({ key: 'token' });
        await storage.clearMapForKey('user');
        await storage.clearMapForKey('token');

        console.log(result.token)

        storage.save({
          key: 'user',
          data: result.user,
        });

        storage.save({
          key: 'token',
          data: result.token,
        });

        console.log('ta caindo na rota')

        navigation.navigate('Logado', result.user);
      } else {
        Alert.alert('Error', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <View className="bg-white flex-1">
      {/* background image */}
      <View className='absolute w-full'>
        <Image className='w-full -z-50' style={{ height: hp(100) }} source={require("../assets/image/background.png")} />
      </View>
      {/* light image */}
      <View className='flex-row justify-around '>
        <Animated.Image 
        entering={FadeInUp.delay(200).duration(1000).springify()}
         source={require("../assets/image/light.png")} style={{ height: hp(30), width: wp(25) }} 
         />
        <Animated.Image
        entering={FadeInUp.delay(400).duration(1000).springify()}
        source={require("../assets/image/light.png")} style={{ height: hp(20), width: wp(17) }} 
        />
      </View>
      {/* title */}
      <View className='flex items-center pt-10'>
        <Text className='text-4xl font-bold tracking-wider text-white'>Login</Text>
      </View>
      {/* forms */}
      <ScrollView showsVerticalScrollIndicator={false} className='space-y-5 mx-3 mt-24'>
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 16, marginBottom: 10 }}>
          <TextInput
            placeholder="email"
            placeholderTextColor="gray"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 16, marginBottom: 10 }}>
          <TextInput
            placeholder="password"
            placeholderTextColor="gray"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: '#00BFFF', padding: 16, borderRadius: 10, marginTop: 10 }}
          activeOpacity={0.6}
          onPress={handleLogin}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Login</Text>
        </TouchableOpacity>

        {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Sign')}>
            <Text style={{ color: '#00BFFF' }}>SignUp</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})