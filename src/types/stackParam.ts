import { NativeStackScreenProps } from "@react-navigation/native-stack"


export type RootStack = {
  Login: undefined,
  Sign: undefined,
  Logado: undefined
}

export type LoginStack = NativeStackScreenProps<RootStack, "Login">
export type SignStack = NativeStackScreenProps<RootStack, "Sign">
export type Logado = NativeStackScreenProps<RootStack, "Logado">