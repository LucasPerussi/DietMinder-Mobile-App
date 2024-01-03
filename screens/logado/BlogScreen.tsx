import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const apiUrl = 'http://137.184.236.110:3000/';

const WeightForm = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, setError } = useForm();
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const authToken = await AsyncStorage.getItem('token');
        if (user && authToken) {
          console.log(user)
          const userData = JSON.parse(user);
          setUserId(userData.rawData.id);
          setToken(authToken);
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        navigation.navigate('Login');
      }
    };

    loadUserInfo();
  }, [navigation]);

  const onSubmit = async (data: { weight: number }) => {
    const parsedTokenData = JSON.parse(token);
    const tokenJWT = parsedTokenData.rawData;
    console.log(tokenJWT)
    console.log(userId)
    console.log(data.weight)
    console.log('Body:', {
      type: 1,
      value: parseFloat(data.weight),
      user: userId,
    });
    console.log('Headers:', {
      Authorization: `${tokenJWT}`,
    });
    try {
      const response = await axios.post(
        `${apiUrl}fitTools/register/new`,
        {
          type: 1,
          value: parseFloat(data.weight), 
          user: userId,
        },
        {
          headers: {
            'Authorization': `${tokenJWT}`,
            'Content-Type': 'application/json',
          },
          
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Weight registered successfully');
      } else {
        setError('weight', {
          type: 'manual',
          message: 'Failed to register weight',
        });
      }
    } catch (error) {
      console.error('Error submitting weight:', error);
      setError('weight', {
        type: 'manual',
        message: 'Failed to register weight',
      });
    }
  };

  return (
    <View>
      <Text>Enter your weight:</Text>
      <Controller
        control={control}
        render={({ field, fieldState }) => (
          <>
            <TextInput
              keyboardType="numeric"
              placeholder="Weight in kilograms"
              onChangeText={(text) => field.onChange(text)}
              value={field.value}
            />
            {fieldState?.error && (
              <Text style={{ color: 'red' }}>{fieldState.error.message}</Text>
            )}
          </>
        )}
        name="weight"
        rules={{ required: 'Weight is required' }}
        defaultValue=""
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WeightForm;
