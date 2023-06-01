import React,  {  useEffect, useState} from 'react';
import {Button, Dimensions, StyleSheet, Text, View, Image, Platform, StatusBar, FlatList, Pressable, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import colors from '../config/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomPanel } from '../BottomPanel';
import { db, auth } from '../../firebase';
import { ref, set, push, child, onValue, update } from "firebase/database";

export default function EditTransacionsScreen() {
    const navigation = useNavigation();
    const crntUser = auth.currentUser;
    const route = useRoute();
    const transaction = route.params.item;
    const isExpenses = transaction.categoryType;
    const [description, SetDescription] = useState(transaction.description);
    const [amount, SetAmount] = useState(transaction.amount);
    const [category, SetCategory] = useState({});
    const [categoryName, SetCategoryName] = useState(transaction.categoryName);
    const [categoryColor, SetCategoryColor] = useState(transaction.categoryColor);
    const [categoryIcon, SetCategoryIcon] = useState(transaction.categoryIcon);
    const [account, SetAccount] = useState({});
    const [accountName, SetAccountName] = useState(transaction.accountName);
    const oldAccountName = transaction.accountName;
    const [accountBalance, SetAccountBalance] = useState(0);
    const screen = "update";

    useEffect(()=>{
      if(route.params?.category){
        SetCategory(route.params?.category);
      } 
     
    },[route.params?.category])

    useEffect(()=>{ 
      if(Object.values(category).length>0){
        SetCategoryName(category.name);
        SetCategoryColor(category.color);
        SetCategoryIcon(category.icon);
      }
    },[category])
    

   useEffect(()=>{
      if(route.params?.account){
        //SetAccountID(Object.keys(route.params?.account))
        SetAccount(route.params?.account);
      }
    },[route.params?.account])

    useEffect(()=>{ 
      if(Object.keys(account).length>0){
        SetAccountName(account.name)
        SetAccountBalance(account.balance)
      }
    },[account])
    
    


    function AddTransactionToDB(){

      update(ref(db,crntUser.uid+'/Transactions/'+transaction.id), {
        description: description,
        amount: amount,
        categoryName: categoryName,
        categoryType: isExpenses ? 'expenses' : 'revenue',
        categoryColor: categoryColor,
        categoryIcon: categoryIcon,
        accountName: accountName
      }).then(() =>{
        alert('Transakcja zaktualizowana pomyślnie');
      }).catch((error)=>{
        alert(error);
      });

      UpdateAccountBalance();

    }
    function UpdateAccountBalance(){
      
      let newBalance = isExpenses ? accountBalance - amount: parseFloat(accountBalance) + parseFloat(amount);
      if(accountName!=""){
        update(ref(db,crntUser.uid+'/Accounts/'+accountName), {
          balance:parseInt(newBalance)
        }).catch((error)=>{
          alert(error);
        });
      }
      else{
        alert('Konto nie zostało wybrane prawidłowo')
      }
      SetAccountBalance(newBalance);

      if(accountName!=oldAccountName){
        let oldAccountBalance = 0;
        const Accref = ref(db, crntUser.uid+'/Accounts/'+oldAccountName+'/balance');
        onValue(Accref, (snapshot) => {
          if(snapshot.val()){
            oldAccountBalance = snapshot.val();
          }
        })
        let newBalance = isExpenses ? parseFloat(oldAccountBalance) + parseFloat(amount):accountBalance - amount;
        if(accountName!=""){
          update(ref(db,crntUser.uid+'/Accounts/'+oldAccountName), {
            balance:parseInt(newBalance)
          }).catch((error)=>{
            alert(error);
          });
        }
        else{
          alert('Konto nie zostało wybrane prawidłowo')
        }
        
      }
    }
     
  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={{
        height:Dimensions.get('window').height
      }}>
        <View style={styles.topPanel}>
            <Text style={{fontSize:32, color:colors.whitetext}}>EDYTUJ TRANSAKCJĘ</Text>
        </View>
        <View style={styles.content}>
            <View style={styles.inputsWrapper}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Opis</Text>
                    <TextInput 
                        style={styles.nameInput}
                        onChangeText={SetDescription}
                        value={description} >
                    </TextInput>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Kwota (PLN)</Text>
                    <TextInput 
                        keyboardType='numeric'
                        style={styles.nameInput}
                        onChangeText={SetAmount}
                        value={amount} >
                    </TextInput>
                </View>
            </View>
            <View style={styles.pickContainer}>
              <Pressable style={[styles.pickPressable,{backgroundColor:categoryColor}]} onPress={()=>navigation.navigate("PickCategoryScreen",{isExpenses, screen})}>
                <Text style={styles.checkboxText}>{categoryName}</Text>
              </Pressable>  
              <Pressable style={[styles.pickPressable,{flexDirection:'row'}]} onPress={()=>navigation.navigate("PickAccountScreen", {screen})}>
                <Text style={styles.checkboxText}>{accountName}</Text>
              </Pressable>
            </View>
            <View style={styles.submitContainer}>            
              <TouchableOpacity style={styles.buttonSubmit} onPress={()=>AddTransactionToDB()} >
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
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4},
    shadowRadius:50,
    elevation:6,
  },
  content:{
    flex:8,
    backgroundColor:colors.white,
  },
  inputsWrapper:{
    flex:1,
    padding:10,
    flexDirection:'row',

  },
  inputContainer:{
    width:'50%'
  },
  label:{
    fontSize:18,
    color:colors.violet,
    fontWeight:'bold'
  },
  nameInput:{
    borderWidth:2,
    borderColor:colors.navyblue,
    margin:10,
    padding:10,
    fontSize:18,
    borderRadius:5
  },
  
  pickContainer:{
    flex:2,
    marginTop:20,
    marginHorizontal:10,
    alignItems:'center',

  },
  pickPressable:{
    padding:10,
    marginTop:15,
    backgroundColor:colors.navyblue,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
    width:'90%'
  },
  checkboxText:{
    width:'70%',
    fontSize:22,
    textAlign:'center',
    color:colors.white,
    fontWeight:'bold',
    marginLeft:10
  },  
  submitContainer:{
    
    marginTop:10
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