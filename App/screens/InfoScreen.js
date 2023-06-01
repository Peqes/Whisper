import React,  { useState, useEffect } from 'react';
import {Button, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable,  Dimensions, Alert } from 'react-native';



import colors from '../config/colors';
import { BottomPanel } from '../BottomPanel';
import { useNavigation } from '@react-navigation/native';
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';


export default function AccountsScreen() {
  const navigation = useNavigation();



  return (
    <View style={styles.wrapper}>
        <View style={styles.topPanel}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate("WelcomeScreen")}>
          <Text style={{color:colors.whitetext, fontSize:18}}>Powrót</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>INFORMACJE O APLIKACJI</Text>
       
        </View>
        <View style={styles.content}>
        <Image style={styles.logo} source={require('../assets/images/Logo_ansl.png')}/>
        <Text style={[styles.text,{color:'black'}]}>Aplikacja została wykonana w ramach pracy inżynierskiej na Wydziale Nauk Informatyczno-Technologicznych</Text>
        
        <View style={styles.textContainer}>
            <Text style={styles.textTitle}>Tytuł</Text>
            <Text style={styles.text}>Projekt i realizacja aplikacji mobilnej na platformę Android do zarządzania finansami codziennymi.</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.textTitle}>Autor</Text>
            <Text style={styles.text}>Piotr Górski</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.textTitle}>Obraz na ekranie startowym pochodzi ze strony</Text>
            <Text style={styles.text}>undraw.co</Text>
        </View><View style={styles.textContainer}>
            <Text style={styles.textTitle}>Ikony w aplikacji zostały pobrane ze strony</Text>
            <Text style={styles.text}>icons8.com</Text>
        </View>

      </View>
      
      
    </View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.lightblue, 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topPanel:{
    flex:1,
    flexDirection:'row',
    backgroundColor:colors.navyblue,
    justifyContent:'center',
    alignItems:'center',
    paddingTop:10,
    borderBottomWidth:2,
    borderBottomColor:colors.violet,
    position:'relative'
  },
  backButton:{
    marginRight:20,
  },
  headerText:{
    fontSize:22, 
    color:colors.whitetext,
    textShadowColor:'black',
    textShadowOffset:{width: 0, height: 0},
    textShadowRadius:4
    
  },
  content:{
    flex:8,
    padding:10,
    backgroundColor:colors.white,
  },
  logo:{
    width:'100%',
    height:100,
    resizeMode:'contain'
  },
  textContainer:{
    padding:10,
    backgroundColor:colors.navyblue,
    marginTop:10,
    borderRadius:15
  },
  textTitle:{
    textAlign:'center',
    fontSize:18,
    
    color:colors.whitetext
  },
  text:{
    fontWeight:'bold',
    textAlign:'center',
    fontSize:18,
    marginTop:10,
    color:colors.whitetext
  }

  
});