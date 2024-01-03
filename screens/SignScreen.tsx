import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React from 'react'
import { SignStack } from '../src/types/stackParam'
import { widthToDP as wp, heightToDP as hp } from "react-native-responsive-screens"

const SignScreen = ({navigation}: SignStack) => {
  return (
    <View className="bg-white flex-1">
      {/* background image */}
      <View className="absolute w-full">
        <Image source={require("../assets/image/background.png")} className="w-full" style={{height: hp(100)}}/>
      </View>
      {/* light image */}
      <View className="flex-row justify-around">
        <Image source={require("../assets/image/light.png")} style={{ height: hp(30), width: wp(25) }} />
        <Image source={require("../assets/image/light.png")} style={{ height: hp(20), width: wp(17) }} />
      </View>
      {/* title */}
      <View className="flex items-center pt-8">
        <Text className="text-white font-bold text-4xl tracking-wider">Sign Up</Text>
      </View>
      {/* form */}
      <ScrollView showsVerticalScrollIndicator={false} className='space-y-5 mx-3 mt-24'>
        {/* login input */}
        <View className='bg-black/5 rounded-xl p-4'>
          <TextInput placeholder='email' placeholderTextColor={"gray"} />
        </View>
        {/* password input */}
        <View className='bg-black/5 rounded-xl p-4'>
          <TextInput placeholder='password' placeholderTextColor={"gray"} secureTextEntry />
        </View>
        {/* sign Up button */}
        <TouchableOpacity className='bg-sky-400 p-4 rounded-xl' activeOpacity={0.6}>
          <Text className='text-center font-bold tracking-wide text-white'>Sign Up</Text>
        </TouchableOpacity>
        {/* account */}
        <View className='flex-row space-x-2 items-center justify-center'>
          <Text>Have an account?</Text>
          <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
            <Text className='text-sky-400'>Login In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default SignScreen

const styles = StyleSheet.create({})