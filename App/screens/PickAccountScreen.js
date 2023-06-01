import React,  { useState, useEffect } from 'react';
import {Button, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable,  Dimensions } from 'react-native';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child} from 'firebase/database';

import colors from '../config/colors';
import { BottomPanel } from '../BottomPanel';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';


export default function AccountsScreen() {

  const crntUser = auth.currentUser;
  const navigation = useNavigation();
  const route = useRoute();
  const screen = route.params.screen;
  const [accountList, SetAccountList] = useState([]);
  const [accountObjList, SetAccountObjList] = useState({});
  const [pickedAccount, PickAccount] = useState({});
  

  useEffect(()=>{

    if(Object.keys(accountList).length==0){
       
      const categRef = ref(db, crntUser.uid+'/Accounts/');
      onValue(categRef, (snapshot) => {

        let tempArray = snapshot.val();
        SetAccountList(Object.values(tempArray));
      });
       
    }
  },[])

  useEffect(()=>{
   
    if(Object.values(pickedAccount).length>0){
    
    navigation.navigate({
      name:screen == "create" ? "AddTransactionsScreen":"EditTransactionsScreen",
      params:{account:pickedAccount},
      merge:true
    });
  }
  },[pickedAccount])


  const ListItem = ({item}) =>(
    <TouchableOpacity style = {[styles.listItem]} onPress={()=>PickAccount(item)}>
      <View style ={styles.listItemNameContainer}>
          <Text style={styles.listItemName}>{item.name}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.listItemAmount,{paddingTop:5}]}>{item.balance}</Text>
      <Text style={styles.listItemAmount}>PLN</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.topPanel}>
        <Text style={styles.title}>WYBIERZ KONTO</Text>
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
  title:{
    fontSize:32, 
    color:colors.whitetext,
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
    borderColor:colors.violet
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
    overflow:'hidden'
  },
 
});