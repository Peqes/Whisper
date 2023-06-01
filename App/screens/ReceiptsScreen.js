import React,  { useState, useEffect } from 'react';
import {Button, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable,  Dimensions, Alert } from 'react-native';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child, remove} from 'firebase/database';

import colors from '../config/colors';
import { BottomPanel } from '../BottomPanel';
import { useNavigation } from '@react-navigation/native';


export default function ReceiptsScreen() {

  const crntUser = auth.currentUser;
  const navigation = useNavigation();
  const [receiptList, SetReceiptList] = useState([]);

  useEffect(()=>{
    GetReceiptList();
  },[receiptList])

  function GetReceiptList(){
    if(Object.keys(receiptList).length==0){
       
      const recRef = ref(db, crntUser.uid+'/Receipts/');
        onValue(recRef, (snapshot) => {
          if(snapshot.exists()){
            
            let tempArray = Object.values(snapshot.val());
            SetReceiptList(tempArray);
          }
        });   
    }
  }

  function DeleteReceipt(receipt){
    if(receipt){
      remove(ref(db,crntUser.uid+'/Receipts/'+receipt.id))
      .then(() =>{
        alert('Paragon usunięty pomyślnie');
      }).catch((error)=>{
        alert(error);
      });
      

      remove(ref(db,crntUser.uid+'/Transactions/'+receipt.transactionid+'/receiptid'))
      .catch((error)=>{
        alert(error);
      });
      SetReceiptList([]);
    }
    else{
      alert('Nie znaleziono konta')
    }
  }

  const confirmDeletePopup = (receipt) => {
    return Alert.alert(
      `Czy chcesz usunąć paragon z aplikacji ?`,
      "Tego procesu nie można odwrócić",
      [
        {
          text:"USUŃ",
          onPress: () => {DeleteReceipt(receipt)}
        },
        {
          text:"COFNIJ"
        }
      ]);
  };


  const ListItem = ({item}) =>(
    <TouchableOpacity style={styles.listItem} onPress={()=>navigation.navigate("ShowReceiptScreen", {item})}>
      <Text style={styles.listItemDesc}>{item.description}</Text>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
        />
      <Text style={styles.listItemDesc}>{item.date}</Text>
      <TouchableOpacity style={styles.trash} onPress={()=>confirmDeletePopup(item)}>
          <Image style={{width:35,height:35}} source={require('../assets/icons/Icon_Delete.png')}/>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.topPanel}>
        <Text style={styles.headerText}>PARAGONY</Text>
        <TouchableOpacity style={styles.AddAccountButton} onPress={()=>navigation.navigate("LoadImageScreen")}>
          <Image style={{width:55, height:55}} source={require('../assets/icons/Icon_AddButtonSquare.png')} ></Image>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.receiptList}>
          {receiptList.map((item)=>{
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
    width:'100%',
    height:'70%',
    borderRadius:15
  },
  trash:{
    position:'absolute',
    bottom:1,
    right:1
  }
});