
import {StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,  TouchableOpacity } from 'react-native';
import React from 'react'

import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

export default function WelcomeScreen() {

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style = {styles.headerContainer}>
        <Text style = {styles.headerText}>WHISPER</Text>
      </View>
      <View style = {styles.imageContainer}>
        <Image style = {styles.image}  source={require('../assets/images/welcome.png')}></Image>
      </View>
      <Text style={styles.literal}>ZADBAJ O SWOJE FINANSE</Text>
      <View style = {styles.buttonContainer}>
        <TouchableOpacity style= {styles.button}><Text style = {styles.buttonText} onPress={()=>navigation.navigate("LoginScreen")}>Logowanie | Rejestracja</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.infoButton} onPress={()=>navigation.navigate("InfoScreen")}>
          <Image style={{width:45, height:45}} source={require('../assets/icons/Icon_Info.png')} ></Image>
        </TouchableOpacity>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.lightblue,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    },
    infoButton:{
      position:'absolute',
      top:35,
      left:10,
      padding:10
    },
    headerContainer:{
      alignItems:'center',
      maxHeight:'10%',
    },
    headerText:{
      color:colors.violet,
      fontSize:50,
  
    },
    imageContainer:{
      flex:4,
      alignItems:'center'
    },
    literal:{
      flex:0.5,
      textAlign:'center',
      fontSize:24,
      fontWeight:'bold',
      color:colors.black
        
    },
    buttonContainer:{
      
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-around',
      paddingHorizontal:10,
      minHeight:200
     
    },
    button:{
      padding:10,
      
      width:'90%',
      backgroundColor:colors.violet,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:5,
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      
    },
    buttonText:{
      fontSize:28,
      color:'white'
    }
  
  });
  