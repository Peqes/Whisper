import React,  { useEffect, useState } from 'react';
import {Button, Dimensions, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child, remove, update} from 'firebase/database';
import firebase from "firebase/compat/app";
import { jsonToCSV, readRemoteFile } from 'react-native-csv';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from "expo-intent-launcher";
import colors from '../config/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import {expensesData} from '../allData/expenses';
import {revenueData} from '../allData/revenue';
import { BottomPanel } from '../BottomPanel';


export default function TransactionsScreen(props) {
    const navigation = useNavigation();
    const crntUser = auth.currentUser;
    const [isExpenses, SetIsExpenses] = useState(true);
    const [transactionExpList, SetTransactionExpList] = useState([]);
    const [transactionRevList, SetTransactionRevList] = useState([]);
  


    useEffect(()=>{
        if(Object.keys(transactionExpList).length==0 && Object.keys(transactionRevList).length==0){
          const Tref = ref(db, crntUser.uid+'/Transactions/');
          onValue(Tref, (snapshot) => {
            if(snapshot.val()){
            let tempArray = Object.values(snapshot.val());
            let tempExpArray = [];
            let tempRevArray = [];
           
        
            for (let i in tempArray){
              if(tempArray[i].categoryType == "expenses"){
                
                tempExpArray.unshift(tempArray[i]);
              }
              else{
                tempRevArray.unshift(tempArray[i]);
              }
            }
            SetTransactionExpList(tempExpArray);
            SetTransactionRevList(tempRevArray);
          }
          });
        }
    },[])

    const confirmDeletePopup = (transaction) => {
      return Alert.alert(
        "",
        "Czy na pewno chcesz usunąć transakcję ?",
        [
          {
            text:"USUŃ",
            onPress: () => {DeleteTransaction(transaction)}
          },
          {
            text:"COFNIJ"
          }
        ]);
    };

    function DeleteTransaction(transaction){
      if(transaction.id){
        remove(ref(db,crntUser.uid+'/Transactions/'+transaction.id))
        .then(() =>{
          alert('Transakcja usunięta pomyślnie');
        }).catch((error)=>{
          alert(error);
        });
      }
      else{
        alert('Nie znaleziono transakcji')
      }
      UpdateAccountBalance(transaction);
    }

    function UpdateAccountBalance(transaction){
      let balance = null;
      if(transaction.accountName!=""){
        const categRef = ref(db, crntUser.uid+'/Accounts/'+transaction.accountName+'/balance');
        onValue(categRef, (snapshot) => {
          if(snapshot.exists()){
            balance = snapshot.val();
          }
        });   
        if(balance){
          let newBalance = isExpenses ? parseFloat(balance) + parseFloat(transaction.amount) : balance - transaction.amount;
        
          update(ref(db,crntUser.uid+'/Accounts/'+transaction.accountName), {
            balance:parseInt(newBalance)
          }).catch((error)=>{
            alert(error);
          });
        }
      }
      else{
        alert('Nie znaleziono konta dla tej transakcji')
      }
    } 

    function GetReceipt(receiptid){
        const recRef = ref(db, crntUser.uid+'/Receipts/');
          onValue(recRef, (snapshot) => {
            if(snapshot.exists()){
              let tempArray = Object.values(snapshot.val());
              var item = {}; //receipt
              for (let i in tempArray){
                if(tempArray[i].id == receiptid){                
                  var item = tempArray[i];
                }
              }
              if(item){
                navigation.navigate("ShowReceiptScreen", {item});
              }
              else{
                Alert.alert("Transakcja nie posiada paragonu")
              }
            }
          });   
      }

      const confirmCsvPopup = (item) => {
        return Alert.alert(
          "Czy chcesz wygenerować plik CSV ?",
          "Zostanie wygenerowany plik zawierający wszystkie transakcje",
          [
            
            {
              text:"COFNIJ"
            },
            {
              text:"Exportuj",
              onPress: () => {ExportToCSV("export")}
            },
            {
              text:"Udostępnij",
              onPress: () => {ExportToCSV("share")}
            }
            
           
          ]);
      };
    
    async function ExportToCSV(task){
      const transactionList = transactionExpList.concat(transactionRevList);
      const transactionArray = [];
      var item = transactionExpList[0];
     
      transactionList.forEach(item =>{
        let transaction = {
          "Data":item.date,
          "Typ":item.categoryType == "expenses" ? "wydatek":"przychód",
          "Konto":item.accountName,
          "Kategoria":item.categoryName,
          "Opis":item.description,
          "Kwota":item.amount
        }
        transactionArray.push(transaction);
      });
      console.log(transactionArray);
      const jsonTransactions = JSON.stringify(transactionArray);
      
      const csv = jsonToCSV(jsonTransactions);

      const directoryUri = FileSystem.documentDirectory;
      const fileUri = directoryUri + `whisper_transakcje.csv`;
      console.log(csv);

      try {
        if(task == "export"){
    
        const album = FileSystem.documentDirectory + "whisper_csv/";
        const folder = await FileSystem.getInfoAsync(album);
        if (!folder.exists) {
          await FileSystem.makeDirectoryAsync(album);
        }
        await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 })
        const ans = await FileSystem.getInfoAsync(fileUri);

        FileSystem.getContentUriAsync(ans.uri).then((cUri) => {
          //Open save image options
          IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: cUri,
            flags: 1,
          });
        });
        }
        else{
          const res = await Sharing.shareAsync(fileUri);
        }
        
        
       
      } catch (error) {
        console.log(error);
      }
      
    } 
  
  
    const ListItem = ({item}) =>{
      const [clicked, SetClicked] = useState(false);
      
      return(
        <TouchableOpacity onPress={()=>SetClicked(!clicked)}style = {[styles.listItem,{backgroundColor:item.categoryColor}]}>
          {clicked ? null :
          <View style={styles.listItemAccountName}>
            <Text style={{color:colors.whitetext}}>{item.accountName}</Text>
          </View>
          }
          <TouchableOpacity style={[styles.listItemIcon,{backgroundColor:item.categoryColor}]} onPress={() => clicked ? GetReceipt(item.receiptid) : null}>
              <Image style={{width:40,height:40}} source={clicked ? require('../assets/icons/Icon_Receipt_White.png') : item.categoryIcon}/>
          </TouchableOpacity>
          <View style ={styles.listItemName}>
              <Text style={styles.listItemText}>{clicked ? item.amount + ' PLN' : item.description}</Text>
          </View>
          {clicked ?
          <>
          <TouchableOpacity style={styles.listItemPressable} onPress={()=>navigation.navigate("EditTransactionsScreen",{item})}>
            <Image style={{width:40,height:40}} source={require('../assets/icons/Icon_Edit.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style ={styles.listItemPressable} onPress={()=>confirmDeletePopup(item)}>
              <Image style={{width:40,height:40}} source={require('../assets/icons/Icon_Delete.png')}/>
          </TouchableOpacity>
          </>
          :
           <Text style={styles.listItemDate}>{item.date}</Text>}
          
        </TouchableOpacity>
      )
    };
  
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
            <TouchableOpacity style={styles.iconCsvContainer} onPress={()=>confirmCsvPopup()}>
              <Image style={styles.iconReceipt} source={require('../assets/icons/Icon_Csv.png')}></Image>
            </TouchableOpacity>
            <Text style={styles.headerText}>TRANSAKCJE</Text>
            <TouchableOpacity style={styles.iconReceiptContainer} onPress={()=>navigation.navigate("ReceiptsScreen")}>
              <Image style={styles.iconReceipt} source={require('../assets/icons/Icon_Receipt_White.png')}></Image>
            </TouchableOpacity>
            <View style={styles.transactionsNav}>
                <Pressable style={[isExpenses ? styles.navClickedElement:styles.navElement,{marginRight:'1%',borderTopRightRadius:10}]} onPress={()=>{ SetIsExpenses(true);}}><Text style={isExpenses ? styles.navClickedElementText:styles.navElementText}>WYDATKI</Text></Pressable>
                <Pressable style={[isExpenses ? styles.navElement:styles.navClickedElement,{borderTopLeftRadius:10}]} onPress={()=>{ SetIsExpenses(false);}} ><Text style={isExpenses ? styles.navElementText:styles.navClickedElementText}>PRZYCHODY</Text></Pressable>
            </View>
            </View>
            
            <View style={styles.content}>
            <FlatList
                style={styles.transactionList}
                data={isExpenses ? transactionExpList : transactionRevList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                
            />
            </View>
            
            <BottomPanel/>
        </SafeAreaView>
    );
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
        paddingTop:10,
        position:'relative'
      },
      headerText:{
        fontSize:42, 
        color:colors.whitetext,
        textShadowColor:'black',
        textShadowOffset:{width: 0, height: 0},
        textShadowRadius:4
      },
      iconCsvContainer:{
        position:'absolute',
        left:5,
        top:15
      },
      iconReceiptContainer:{
        position:'absolute',
        right:5,
        top:15
      },
      iconReceipt:{
        width:50,
        height:50,
      },
      transactionsNav:{
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
        fontSize:28
      },
      navClickedElementText:{
        color:colors.violet,
        fontSize:28
      },
    
      content:{
        flex:8,
        backgroundColor:colors.white,
        
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
      }
});
