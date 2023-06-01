import React,  { useState, useEffect } from 'react';
import {Button, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable,  Dimensions, Alert } from 'react-native';
import { db, auth, storage } from '../../firebase';
import {ref, onValue, set, push, child, remove} from 'firebase/database';

import colors from '../config/colors';
import { BottomPanel } from '../BottomPanel';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

export default function ShowReceiptScreen() {
    
  const navigation = useNavigation();
  const route = useRoute();
  const receipt = route.params.item;
  

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.topPanel}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate("ReceiptsScreen")}>
            <Text style={{fontSize:24, textAlign:'center', color:colors.whitetext}}>Wróć</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Image
          source={{ uri: receipt.uri }}
          style={styles.image}
        />   
      </View>
      
      <BottomPanel/>
    </SafeAreaView>
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
    backgroundColor:colors.navyblue,
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth:2,
    borderBottomColor:colors.violet,
    position:'relative'
  },
  backButton:{
    padding:10,
    width:'50%',
    borderColor:colors.white,
    borderWidth:2,
    borderRadius:15,
    backgroundColor:colors.violet
  },
  AddAccountButton:{
    margin:'auto',
    position:'absolute',
    right:'5%',
  },
  headerText:{
    fontSize:42, 
    color:colors.whitetext,
    textShadowColor:'black',
    textShadowOffset:{width: 0, height: 0},
    textShadowRadius:4
    
  },
  content:{
    flex:8,
    backgroundColor:colors.white,
    alignItems:'center'
  },
  receiptList:{
    flexDirection:'row',
    padding:20,
    flex:1,
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  listItem:{
    backgroundColor:colors.navyblue,
    width:Dimensions.get("window").width * 0.43,
    height:Dimensions.get("window").width * 0.4,
    padding:15,
    borderRadius:10,
    marginTop:10,
    borderWidth:2,
    borderColor:colors.violet,
    position:'relative',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4},
    shadowRadius:50,
    elevation:8,
  },
  listItemDesc:{
    color:colors.whitetext,
    fontSize:16,
    textAlign:'center',
    fontWeight:'500'
  },
  image:{
    flex:1,
    height:null,
    width:'80%',
    resizeMode:"contain",
  },
  trash:{
    position:'absolute',
    bottom:1,
    right:1
  }
});