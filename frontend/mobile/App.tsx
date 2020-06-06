import React from 'react';
import { AppLoading } from 'expo'
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
//import Home from './src/pages/Home';
//import { useFonts } from '@use-expo/font';
import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';

import Routes from './src/routes'

import { StatusBar } from 'react-native'

export default function App() {

  // aula 04 32:00
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });


  if (!fontsLoaded) {
    return <AppLoading />
  }


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
