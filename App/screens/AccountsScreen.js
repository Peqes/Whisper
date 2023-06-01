import React,  { useState, useEffect } from 'react';
import {Button, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable,  Dimensions, Alert } from 'react-native';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child, remove} from 'firebase/database';

import colors from '../config/colors';
import { BottomPanel } from '../BottomPanel';
import { useNavigation } from '@react-navigation/native';


export default function AccountsScreen() {

  const crntUser = auth.currentUser;
  const navigation = useNavigation();
  const [accountList, SetAccountList] = useState([]);

  useEffect(()=>{

    if(Object.keys(accountList).length==0){
       
      const categRef = ref(db, crntUser.uid+'/Accounts/');
        onValue(categRef, (snapshot) => {
          if(snapshot.exists()){
            
            let tempArray = Object.values(snapshot.val());
            SetAccountList(tempArray);
          }
        });   
    }
  },[])

  function DeleteAccount(account){
    if(account){
      remove(ref(db,crntUser.uid+'/Accounts/'+account.name))
      .then(() =>{
        alert('Konto usunięte pomyślnie');
      }).catch((error)=>{
        alert(error);
      });

      DeleteAccountTransactions(account);
    }
    else{
      alert('Nie znaleziono konta')
    }
  }
  function DeleteAccountTransactions(account){
    
    const Tref = ref(db, crntUser.uid+'/Transactions/');
        onValue(Tref, (snapshot) => {
          if(snapshot.val()){
          let tempArray = Object.values(snapshot.val());
          tempArray.forEach(transaction => {
            if(transaction.accountName == account.name){
              remove(ref(db,crntUser.uid+'/Transactions/'+transaction.id))
              .catch((error)=>{
                alert(error);
              });
            }
          })
        }
        });
  }

  const confirmDeletePopup = (account) => {
    return Alert.alert(
      `Czy chcesz usunąć konto "${account.name}" ?`,
      "Wszystkie transakcje zostaną trwale usunięte",
      [
        {
          text:"USUŃ",
          onPress: () => {confirmDeletePopup2(account)}
        },
        {
          text:"COFNIJ"
        }
      ]);
  };
  const confirmDeletePopup2 = (account) => {
    return Alert.alert(
      `Czy chcesz usunąć konto "${account.name}" ?`,
      "Tej operacji nie można cofnąć",
      [
        {
          text:"USUŃ",
          onPress: () => {DeleteAccount(account)}
        },
        {
          text:"COFNIJ"
        }
      ]);
  };


  const ListItem = ({item}) =>(
    <TouchableOpacity style={styles.listItem} onPress={()=>navigation.navigate("MainScreen",{item})}>
      <View style={styles.listItemNameContainer}>
          <Text style={styles.listItemName}>{item.name}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.listItemAmount,{paddingTop:5}]}>{item.balance}</Text>
      <Text style={styles.listItemAmount}>PLN</Text>
      <TouchableOpacity style={styles.trash} onPress={()=>confirmDeletePopup(item)}>
          <Image style={{width:35,height:35}} source={require('../assets/icons/Icon_Delete.png')}/>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.topPanel}>
        <Text style={styles.headerText}>KONTA</Text>
        <TouchableOpacity style={styles.AddAccountButton} onPress={()=>navigation.navigate("AddAccountsScreen")}>
          <Image style={{width:55, height:55}} source={require('../assets/icons/Icon_AddButtonSquare.png')} ></Image>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.accountList}>
          {accountList.map((item)=>{
            return(
              <ListItem item={item} key={item.name}/>
            );
          })}
        </View>
        
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
    paddingTop:10,
    borderBottomWidth:2,
    borderBottomColor:colors.violet,
    position:'relative'
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
  },
  
  accountList:{
    flexDirection:'row',
    padding:20,
    flex:1,
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  listItem:{
    backgroundColor:colors.navyblue,
    width:Dimensions.get("window").width * 0.43,
    height:Dimensions.get("window").width * 0.3,
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
  listItemNameContainer:{
    width:'100%',
    height:'40%',
    backgroundColor:colors.white,
    justifyContent:'center',
    borderRadius:10,
    borderWidth:2,
    borderColor:colors.violet
  },
  listItemName:{
    fontSize:20,
    color:colors.violet,
    fontWeight:'bold',
    textAlign:'center',
    
  },
  listItemAmount:{
    color:colors.whitetext,
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    overflow:'hidden',
    textShadowColor:'black',
        textShadowOffset:{width: 0, height: 0},
        textShadowRadius:4
  },
  trash:{
    position:'absolute',
    bottom:1,
    right:1
  }

});