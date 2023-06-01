import React,  { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable, Alert, TextInput, Dimensions, ScrollView } from 'react-native';
import { db, auth} from '../../firebase';
import {ref, onValue, set, push, child, remove, update} from 'firebase/database';

import colors from '../config/colors';
import {iconList} from '../allData/iconList';

import { BottomPanel } from '../BottomPanel';
import { useNavigation } from '@react-navigation/native';

export default function CategoriesScreen() {
  const crntUser = auth.currentUser;
  const navigation = useNavigation();
  const [isExpenses, SetIsExpenses] = useState(true);
  const [categoryExpList, SetCategoryExpList] = useState([]);
  const [categoryRevList, SetCategoryRevList] = useState([]);
  const [editItem, SetEditItem] = useState(null);
  const [name, SetName] = useState('');

  useEffect(()=>{

    if(Object.keys(categoryExpList).length==0 && Object.keys(categoryRevList).length==0){
      GetCategories();
    }
    },[])

    function GetCategories(){
      const categRef = ref(db, crntUser.uid+'/Categories/');
      onValue(categRef, (snapshot) => {
        if(snapshot.exists()){
          let tempArray = Object.values(snapshot.val());
          let tempExpArray = [];
          let tempRevArray = [];
          for (let i in tempArray){
            if(tempArray[i].categoryType == "expenses"){
              
              tempExpArray.push(tempArray[i]);
            }
            else{
              tempRevArray.push(tempArray[i]);// NIE ZAŁADOWUJĄ SIĘ OD RAZU, DOPIERO PO REFRESHU, DO NAPRAWY
            }
          }
          if(tempExpArray.length==0){
            AddDefaultCategoryToDB(true);
            GetCategories();
          }
          if(tempRevArray.length==0){
            AddDefaultCategoryToDB(false);
            GetCategories();
          }
          
          SetCategoryExpList(tempExpArray);
          SetCategoryRevList(tempRevArray);
        }
        else{
          AddDefaultCategoryToDB(true);
          AddDefaultCategoryToDB(false);
          GetCategories();
        }
      });
    }
    function AddDefaultCategoryToDB(expenses){

      let newKey = expenses ? "Ogólne wydatki": "Ogólne przychody"
      set(ref(db,crntUser.uid+'/Categories/'+newKey), {
        name:newKey ,
        icon:require('../assets/icons/Icon_Dollar.png'),
        color:'grey',
        categoryType: expenses ? 'expenses' : 'revenue'
      }).catch((error)=>{
        alert(error);
      });
    }

    const confirmDeletePopup = (category) => {
      return Alert.alert(
        "Czy chcesz usunąć kategorię ?",
        "Wszystkie transakcje zostaną przeniesione do kategorii ogólnej",
        [
          {
            text:"USUŃ",
            onPress: () => {DeleteCategory(category)}
          },
          {
            text:"COFNIJ"
          }
        ]);
    };

    function DeleteCategory(category){
      if(category){
        remove(ref(db,crntUser.uid+'/Categories/'+category.name))
        .then(() =>{
          alert('Kategoria usunięta pomyślnie');
        }).catch((error)=>{
          alert(error);
        });

        UpdateTransactionsOfCategory(category);
      }
      else{
        alert('Nie znaleziono kategorii')
      }
    }

    function UpdateTransactionsOfCategory(category){
      if(category){
        let newCategoryName = "";
        if(category.categoryType == "revenue"){
          newCategoryName = "Ogólne przychody"
        }
        else if(category.categoryType == "expenses"){
          newCategoryName = "Ogólne wydatki";
        }
        const Tref = ref(db, crntUser.uid+'/Transactions/');
        onValue(Tref, (snapshot) => {
          if(snapshot.val()){
          let tempArray = Object.values(snapshot.val());
          tempArray.forEach(transaction => {
            if(transaction.categoryName == category.name){
              update(ref(db,crntUser.uid+'/Transactions/'+transaction.id),{
                categoryName : newCategoryName,
                categoryIcon : require('../assets/icons/Icon_Dollar.png'),
                categoryColor : 'grey'
                
              }).catch((error)=>{alert(error);});
            }
          })
        }
        });
      }
    }

  const NamePopup = ({item}) =>{

    return(
      <View style={styles.namePopup}>
        <Text style={styles.namePopupText}>Wprowadź nową nazwę</Text>
        <TextInput 
          style={styles.namePopupInput}
          onChangeText={SetName}
          value={name} >
        </TextInput>
      </View>
    )
  }
  function EditItemName(){
    if(!editInProgress){
  
    }
  }

  const ListItem = ({item}) =>{
      let isLocked = false;
      if(item.name == "Ogólne przychody" || item.name == "Ogólne wydatki"){
        isLocked = true;
      }
      return(
      <View style = {[styles.listItem,{backgroundColor:item.color}]}>
        
        <View style={[styles.listItemIcon,{backgroundColor:item.color}]}>
          <Image style={{width:40,height:40}} source={item.icon}/>
        </View>
        
        <View style ={styles.listItemName}>
         <Text style={styles.listItemText}>{item.name}</Text>
        </View>
        {isLocked ? null :
        <>
        <TouchableOpacity style={styles.listItemPressable} onPress={()=>navigation.navigate("EditCategoriesScreen",{item})}>
          <Image style={{width:40,height:40}} source={require('../assets/icons/Icon_Edit.png')}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItemPressable} onPress={()=>confirmDeletePopup(item)}>
          <Image style={{width:40,height:40}} source={require('../assets/icons/Icon_Delete.png')}/>
        </TouchableOpacity>
        </>}
      </View>
      );
    
  };

  const renderItem = ({item}) => {        
    return (
        <ListItem
            item={item}
        />
    );
  }


/*Opisać dlaczego musiał zostać zastosowany dispaly none dla popupu a nie ternary operator */
  return (
    <View style={styles.wrapper}>
     
      <View style={styles.topPanel}>
        <Text style={styles.headerText}>KATEGORIE</Text>
        <TouchableOpacity style={styles.AddCategoriesButton} onPress={()=>navigation.navigate("AddCategoriesScreen")}>
          <Image style={{width:55, height:55}} source={require('../assets/icons/Icon_AddButtonSquare.png')} ></Image>
        </TouchableOpacity>
        <View style={styles.categoriesNav}>
          <Pressable style={[isExpenses ? styles.navClickedElement:styles.navElement,{marginRight:'1%',borderTopRightRadius:10}]} onPress={()=>{ SetIsExpenses(true);}}><Text style={isExpenses ? styles.navClickedElementText:styles.navElementText}>WYDATKI</Text></Pressable>
          <Pressable style={[isExpenses ? styles.navElement:styles.navClickedElement,{borderTopLeftRadius:10}]} onPress={()=>{ SetIsExpenses(false);}} ><Text style={isExpenses ? styles.navElementText:styles.navClickedElementText}>PRZYCHODY</Text></Pressable>
        </View>
      </View>
      
      
      <View style={styles.content}>
        <FlatList
          style={styles.categoryList}
          //data={categoryList}
          data={isExpenses ? categoryExpList:categoryRevList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
        />
      </View>
      
      <BottomPanel/>
     
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
    flex:2,
    backgroundColor:colors.navyblue,
    justifyContent:'center',
    alignItems:'center',
    paddingTop:10
  },
  headerText:{
    fontSize:42, 
    color:colors.whitetext,
    textShadowColor:'black',
    textShadowOffset:{width: 0, height: 0},
    textShadowRadius:4
  },
  AddCategoriesButton:{
    position:'absolute',
    top:'10%',
    right:'5%',
    alignSelf:'center',
  },
  categoriesNav:{
    flex:1,
    flexDirection:'row',
    marginTop:10
  },
  navElement:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:colors.violet
  },
  navClickedElement:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:colors.white
  },
  navElementText:{
    color:colors.whitetext,
    fontSize:28,
  },
  navClickedElementText:{
    color:colors.violet,
    fontSize:28
  },

  content:{
    flex:8,
    backgroundColor:colors.white,
    position:'relative'
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
  namePopupInput:{
    backgroundColor:colors.white,
    height:'100%',
    width:'100%'
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


});