import React,  { useEffect, useState } from 'react';
import {Button, Dimensions, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar, TouchableOpacity, FlatList, Pressable } from 'react-native';

import colors from '../config/colors';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child} from 'firebase/database';


import { BottomPanel } from '../BottomPanel';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';


export default function PickCategoryScreen() {
  const crntUser = auth.currentUser;
  const navigation = useNavigation();
  const route = useRoute();
  const [pickedTransaction, PickTransaction] = useState({});
  const [categoryExpList, SetCategoryExpList] = useState([]);

  useEffect(()=>{

    if(Object.keys(categoryExpList).length==0){
      const categRef = ref(db, crntUser.uid+'/Transactions/');
      onValue(categRef, (snapshot) => {
        
        let tempArray = Object.values(snapshot.val());
        let tempExpArray = [];
       
       
        for (let i in tempArray){
          if(tempArray[i].categoryType == "expenses" && (tempArray[i].receiptid === undefined || tempArray[i].receiptid == "")){
            tempExpArray.push(tempArray[i]);
          }
        }
        SetCategoryExpList(tempExpArray);
      });
    }
    },[])



  
  useEffect(()=>{
    if(Object.keys(pickedTransaction).length>0){
   
    navigation.navigate({
      name:"LoadImageScreen",
      params:{transaction:pickedTransaction},
      merge:true
    });
  }
  },[pickedTransaction])

  const ListItem = ({item}) =>{
    return(
        <TouchableOpacity onPress={()=>PickTransaction(item)} style = {[styles.listItem,{backgroundColor:item.categoryColor}]}>
            <View style={styles.listItemAccountName}>
                <Text style={{color:colors.whitetext}}>{item.accountName}</Text>
            </View>
            <View style={[styles.listItemIcon,{backgroundColor:item.categoryColor}]}>
                <Image style={{width:40,height:40}} source={item.categoryIcon}/>
            </View>
            <View style ={styles.listItemName}>
                <Text style={styles.listItemText}>{item.description}</Text>
                <Text style={styles.listItemText}>{item.amount + ' PLN'}</Text>
            </View>
            <Text style={styles.listItemDate}>{item.date}</Text>
        </TouchableOpacity>
  )};

 
  const renderItem = ({item}) => {        
    return (
        <ListItem
            item={item}
        />
    );
  }



  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.topPanel}>
        <Text style={{fontSize:32, color:colors.whitetext}}>WYBIERZ TRANSAKCJĘ</Text>
      </View>
      
      <View style={styles.content}>
        <FlatList
          style={styles.categoryList}
          data={categoryExpList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
    paddingTop:10
  },

  content:{
    flex:8,
    backgroundColor:colors.white,
  },
  
  categoryList:{
    flex:1
  },
  listItem:{
    flex:1,
    flexDirection:'row',
    paddingVertical:15,
    paddingLeft:10,
    marginTop:10,
    flex:1,
    borderRadius:5,
    marginHorizontal:5,
    position:'relative',
    alignItems:'center'
  },
  listItemAccountName:{
    position:'absolute',
    top:5,
    right:10,


  },
  listItemIcon:{
    width:50,
    borderRadius:15,
    alignItems:'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4},
    shadowRadius:50,
    elevation:4,
  },
  listItemName:{
    width:'60%',
    paddingLeft:10
  },
  listItemText:{
    fontSize:20,
    color:colors.whitetext,
    fontWeight:'bold',
    textShadowColor:'black',
    textShadowOffset:{width: 0, height: 0},
    textShadowRadius:4
  },
  listItemPressable:{
    flex:1,
    borderLeftWidth:2,
    borderLeftColor:"white",
    justifyContent:'center',
    alignItems:'center'
    
  },
  listItemDate:{
    color:colors.whitetext,
    fontSize:18,
    fontWeight:500,
  },
  AddCategoriesButton:{
    alignSelf:"flex-end",
    marginBottom:20,
    marginRight:20,
    borderWidth:5,
    borderRadius:50,
    borderColor:colors.navyblue
  }


});