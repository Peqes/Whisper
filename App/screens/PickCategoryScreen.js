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
  const isExpenses = route.params.isExpenses;
  const screen = route.params.screen;
  const [pickedCategory, PickCategory] = useState({});
  const [categoryExpList, SetCategoryExpList] = useState([]);
  const [categoryRevList, SetCategoryRevList] = useState([]);

  useEffect(()=>{

    if(Object.keys(categoryExpList).length==0 && Object.keys(categoryRevList).length==0){
      const categRef = ref(db, crntUser.uid+'/Categories/');
      onValue(categRef, (snapshot) => {
        
        let tempArray = Object.values(snapshot.val());
        let tempExpArray = [];
        let tempRevArray = [];
       
        for (let i in tempArray){
          if(tempArray[i].categoryType == "expenses"){
            
            tempExpArray.push(tempArray[i]);
          }
          else{
            tempRevArray.push(tempArray[i]);
          }
        }
        SetCategoryExpList(tempExpArray);
        SetCategoryRevList(tempRevArray);
      });
    }
    },[])



  
  useEffect(()=>{
    if(Object.keys(pickedCategory).length>0){
   
    navigation.navigate({
      name:screen == "create" ? "AddTransactionsScreen":"EditTransactionsScreen",
      params:{category:pickedCategory},
      merge:true
    });
  }
  },[pickedCategory])

  const ListItem = ({item}) =>{
    return(
    <TouchableOpacity style = {[styles.listItem,{backgroundColor:item.color}]} 
      onPress={()=>PickCategory(item)}>
      <View style={styles.listItemIcon}>
        <Image style={{width:40,height:40}} source={item.icon}/>
      </View>
      <View style ={styles.listItemName}>
          <Text style={styles.listItemText}>{item.name}</Text>
      </View>
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
        <Text style={{fontSize:32, color:colors.whitetext}}> WYBIERZ KATEGORIĘ</Text>
      </View>
      
      <View style={styles.content}>
        <FlatList
          style={styles.categoryList}
          data={isExpenses ? categoryExpList : categoryRevList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
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
    paddingVertical:10,
    paddingLeft:10,
    marginTop:10,
    flex:1,
    borderRadius:5,
    marginHorizontal:5,
    
    alignItems:'center'
  },
  listItemIcon:{
    width:50,
  },
  listItemName:{
    width:'60%',
  },
  listItemText:{
    fontSize:20,
    color:colors.whitetext,
    fontWeight:'bold'
  },
  listItemPressable:{
    flex:1,
    borderLeftWidth:2,
    borderLeftColor:"white",
    justifyContent:'center',
    alignItems:'center'
    
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