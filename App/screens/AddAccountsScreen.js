import React,  { useState } from 'react';
import {Button, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable,  Dimensions, TextInput, ScrollView } from 'react-native';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child} from 'firebase/database';

import colors from '../config/colors';
import { BottomPanel } from '../BottomPanel';


export default function AddAccountsScreen() {
  
  console.disableYellowBox = true; 
  const crntUser = auth.currentUser;
  const [name, SetName] = useState("");
  const [balance, SetBalance] = useState(0);

  function AddAccountToDB(){
    if(name!="" && balance!=0){
      const newAccountKey = name;
      
      
    }
    else{
      alert('Uzupełnij pola Nazwa oraz Saldo')
    }
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={{
        height:Dimensions.get('window').height
      }}>
        <View style={styles.topPanel}>
            <Text style={{fontSize:42, color:colors.whitetext}}>KONTA</Text>
        </View>
      
        <View style={styles.content}>
            <View style={styles.nameContainer}>
                <Text style={styles.label}>Nazwa</Text>
                <TextInput 
                    style={styles.nameInput}
                    onChangeText={SetName}
                    value={name} 
                    maxLength={10}/>
            </View>
            <View style={styles.balanceContainer}>
                <Text style={styles.label}>Saldo</Text>
                <TextInput 
                    keyboardType='numeric'
                    input
                    style={styles.nameInput}
                    onChangeText={SetBalance}
                    value={balance}
                    maxLength={10}/>
                
            </View>
            <View style={styles.submitContainer}>            
                <TouchableOpacity style={styles.buttonSubmit} onPress={()=>AddAccountToDB()}>
                    <Text style={{fontSize:24, color:colors.whitetext}}>DODAJ</Text>
                </TouchableOpacity>
            </View>
        </View>
      
      <BottomPanel/>
      </ScrollView>
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
    backgroundColor:colors.navyblue,
    justifyContent:'center',
    alignItems:'center',
    paddingTop:10,
    borderBottomWidth:2,
    borderBottomColor:colors.violet
  },
  content:{
    paddingTop:15,
    flex:8,
    backgroundColor:colors.white,
  },
  nameContainer:{
    
    padding:10
  },
  label:{
    fontSize:18,
    color:colors.violet,
    fontWeight:'bold',
    width:'100%'
  },
  nameInput:{
    borderWidth:2,
    borderColor:colors.navyblue,
    margin:10,
    padding:10,
    fontSize:18,
    borderRadius:5
  },
  balanceContainer:{
    
    padding:10
  },

  submitContainer:{
    margin:10,
    alignSelf:'flex-end'
  },
  buttonSubmit:{
    backgroundColor:colors.violet,
    borderRadius:5,
    padding:10,
    alignSelf:'flex-end',
    marginRight:10,
    marginBottom:15,
  }

});