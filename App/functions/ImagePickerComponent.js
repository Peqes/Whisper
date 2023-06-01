import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import colors from '../config/colors';
import { db, auth, storage } from '../../firebase';
import {ref, onValue, set, push, child, update} from 'firebase/database';

function ImagePickerComponent({ onSubmit }) {
  const navigation = useNavigation();
  const route = useRoute();
  const crntUser = auth.currentUser;
  const [image, SetImage] = useState(null);
  const [description, SetDescription] = useState("");
  const [date, SetDate] = useState("");
  const [transactionDesc, SetTransactionDesc] = useState("Przypisz transakcję");
  const [transaction, SetTransaction] = useState({});
  const [transactionColor, SetTransactionColor] = useState(colors.violet);
  
  useEffect(()=>{
    if(route.params?.transaction){
      SetTransaction(route.params?.transaction);
    } 
   
  },[route.params?.transaction])
  useEffect(()=>{
    if(route.params?.photoUri){
      SetImage(route.params?.photoUri);
    } 
   
  },[route.params?.photoUri])

  useEffect(()=>{
    if(Object.keys(transaction).length>0){
        SetTransactionDesc(transaction.description)
        SetTransactionColor(transaction.categoryColor)
    }

  },[transaction])

  useEffect(()=>{
    var date = moment().format('DD-MM-YYYY')
    SetDate(date);
  },[])
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.cancelled) {
      SetImage(result.uri);
      console.log(result.uri);
    }
  };

  function AddReceiptToDB(){
    console.log(image)
    if(image!=null){
      const receiptKey = push(child(ref(db), crntUser.uid+'/Receipts')).key;
      set(ref(db,crntUser.uid+'/Receipts/'+receiptKey), {
        id:receiptKey,
        uri:image,
        description:description,
        date:date,
        transactionid:Object.keys(transaction).length>0 ? transaction.id : ""
      }).then(() =>{
        alert('Paragon dodany');
        navigation.navigate("ReceiptsScreen");
      }).catch((error)=>{
        alert(error);
      });
      if(Object.keys(transaction).length>0){
        update(ref(db,crntUser.uid+'/Transactions/'+transaction.id), {
          receiptid:receiptKey
        }).catch((error)=>{
          alert(error);
        });
      }
    }
  }

  function ClearTransaction(){
    SetTransaction({});
    SetTransactionDesc("Przypisz transakcję");
    SetTransactionColor(colors.violet);
  }

  return (
    <View style={styles.pickerWrapper}>
      <TouchableOpacity style={[styles.pickPressable,{backgroundColor:transactionColor}]} 
      delayLongPress={1000} onLongPress={()=>{ClearTransaction();}} 
      onPress={()=>navigation.navigate("PickTransactionScreen")}>
            <Text style={styles.checkboxText}>{transactionDesc}</Text>
      </TouchableOpacity>
      <TextInput 
        style={styles.descInput}
        onChangeText={SetDescription}
        value={description} 
        placeholder={"Dodaj opis"}
        maxLength={10}>
      </TextInput>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={{fontSize:18,color:colors.whitetext, textAlign:'center'}}>Wybierz zdjęcie</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        )}
      </View>
      <TouchableOpacity style={styles.bottomButton} onPress={()=>AddReceiptToDB()}>
            <Text style={styles.buttonText}>Dalej</Text>
        </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  pickerWrapper:{
    position:'relative',
    flex:1,
    alignSelf:'stretch',
    alignItems:'center'
  },
  button:{
    width:'70%',
    marginTop:30,
    padding:10,
    borderRadius:15,
    backgroundColor:colors.violet,
    borderWidth:2,
    borderColor:colors.white
  },
  imageContainer:{
    paddingTop:10,
    flex:1,
    alignItems:'center',
  },
  image:{
    flex:1,
    height:null,
    width:250,
    resizeMode:"contain",
  },
  bottomButton:{
    position:'absolute',
    bottom:50,
    right:20,
    backgroundColor:colors.violet,
    paddingVertical:10,
    paddingHorizontal:30,
    borderRadius:15,
    borderWidth:1,
    borderColor:colors.white
},  
buttonText:{
    fontSize:24,
    color:colors.whitetext
},
descInput:{
  borderWidth:2,
  borderColor:colors.navyblue,
  margin:10,
  padding:10,
  fontSize:18,
  borderRadius:15,
  backgroundColor:colors.white,
  width:'70%',
  textAlign:'center'
},
pickPressable:{
  padding:10,
  marginTop:15,
  backgroundColor:colors.violet,
  borderWidth:1,
  borderColor:colors.white,
  borderRadius:15,
  alignItems:'center',
  justifyContent:'center',
  width:'70%'
},
checkboxText:{
  width:'70%',
  fontSize:16,
  textAlign:'center',
  color:colors.white,
  marginLeft:10
},  
});
export default ImagePickerComponent;