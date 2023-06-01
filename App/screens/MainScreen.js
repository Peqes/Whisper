import React,  {  useEffect, useState } from 'react';
import {Button, Dimensions, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { VictoryPie } from 'victory-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child} from 'firebase/database';
import colors from '../config/colors';

import { revenueData } from '../allData/revenue';
import {BottomPanel} from '../BottomPanel';
import { NavigationContainer, useNavigation, useRoute} from '@react-navigation/native';


export default function MainScreen() {
    const crntUser = auth.currentUser;
    const route = useRoute();
    const navigation = useNavigation();
    const [isExpenses, SetIsExpenses] = useState(true);
    const [transactionExpList, SetTransactionExpList] = useState([]);
    const [transactionRevList, SetTransactionRevList] = useState([]);
    const [categoryExpList, SetCategoryExpList] = useState([]);
    const [categoryRevList, SetCategoryRevList] = useState([]);
    const [chartExpensesData, SetChartExpensesData] = useState([]);
    const [chartRevenueData, SetChartRevenueData] = useState([]);
    const [isDatePicker, SetDatePicker] = useState(false);
    const [customDateFrom, SetCustomDateFrom] = useState(null);
    const [customDateTo, SetCustomDateTo] = useState(null);
    const [customDatePicked, SetCustomDatePicked] = useState(false);
    const [isDateFrom, SetIsDateFrom] = useState(true);
    const [expAmountList, SetExpAmountList] = useState([]);
    const [expColorList, SetExpColorList] = useState([]);
    const [revAmountList, SetRevAmountList] = useState([]);
    const [revColorList, SetRevColorList] = useState([]);
    const [accountList, SetAccountList] = useState([]);
    const [account, SetAccount] = useState({});


    useEffect(()=>{
        if(route.params?.item){
          SetAccount(route.params?.item);
        } 
        
    },[route.params?.item])
    

    if(Object.keys(accountList).length==0){
    
        const categRef = ref(db, crntUser.uid+'/Accounts/');
          onValue(categRef, (snapshot) => {
            if(snapshot.exists()){
              
              let tempArray = Object.values(snapshot.val());
              SetAccountList(tempArray);
              if(Object.keys(account)){
                SetAccount(tempArray[0]);
              }
            }
          });   
    }

    function getCategoryData(){
        
        const categRef = ref(db, crntUser.uid+'/Categories/');
        onValue(categRef, (snapshot) => {
          if(snapshot.val()){
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
            SetCategoryExpList(tempExpArray);
            SetCategoryRevList(tempRevArray);
          }
        });
    }

    function getTransactionData(){
        const Tref = ref(db, crntUser.uid+'/Transactions/');
        onValue(Tref, (snapshot) => {
          if(snapshot.val()){
          let tempArray = Object.values(snapshot.val());
          let tempExpArray = [];
          let tempRevArray = [];
         
      
          for (let i in tempArray){
             
              if(tempArray[i].accountName == account.name){
                  if(tempArray[i].categoryType == "expenses"){
                     if((!customDateFrom && !customDateTo)
                     || (moment(tempArray[i].date).isSameOrAfter(customDateFrom) && moment(tempArray[i].date).isSameOrBefore(customDateTo))
                     || (moment(tempArray[i].date).isSameOrAfter(customDateFrom) && !customDateTo)
                     || (!customDateFrom && moment(tempArray[i].date).isSameOrBefore(customDateTo))){
                        tempExpArray.push(tempArray[i]);
                    }
                  }
                  else{
                    if((!customDateFrom && !customDateTo)
                    || (moment(tempArray[i].date).isSameOrAfter(customDateFrom) && moment(tempArray[i].date).isSameOrBefore(customDateTo))
                    || (moment(tempArray[i].date).isSameOrAfter(customDateFrom) && !customDateTo)
                    || (!customDateFrom && moment(tempArray[i].date).isSameOrBefore(customDateTo))){
                        tempRevArray.push(tempArray[i]);
                    }
                  }
              }
          }
          
          SetTransactionExpList(tempExpArray);
          SetTransactionRevList(tempRevArray);
        }
        });
    }
    
    useEffect(()=>{   
        if(Object.keys(categoryExpList).length==0 && Object.keys(categoryRevList).length==0){
            getCategoryData();
        }
    },[])
    useEffect(()=>{   
       // if(Object.keys(transactionExpList).length==0 && Object.keys(transactionRevList).length==0){
            getTransactionData();
        
    },[account, customDateFrom, customDateTo])
    
   
    
    useEffect(()=>{
        let tempExpAmountList = [];
        for(let i = 0; i<categoryExpList.length; i++){

            let categoryName = categoryExpList[i].name;
            let amountSum = 0;
            for(let j = 0; j <transactionExpList.length; j++){
                
                if(transactionExpList[j].categoryName == categoryName){
                    amountSum += parseInt(transactionExpList[j].amount);//amount of all Transactions from that Category
                }        
            }
            tempExpAmountList.push(amountSum);
        }
        SetExpAmountList(tempExpAmountList);

    },[transactionExpList])

    useEffect(()=>{
        let tempRevAmountList = [];
        let tempRevColorList = [];

        for(let i in categoryRevList){

            tempRevColorList.push(categoryRevList[i].color);

            let categoryName = categoryRevList[i].name;
            let amountSum = 0;
            for(let i in transactionRevList){
                
                if(transactionRevList[i].categoryName == categoryName){
                    amountSum += parseInt(transactionRevList[i].amount);//amount of all Transactions from that Category
                    
                }        
            }
            tempRevAmountList.push(amountSum);
        }
        SetRevAmountList(tempRevAmountList);
        SetRevColorList(tempRevColorList);

    },[transactionRevList])

    function GenerateDataForChart(isExp){ // type = expenses/revenue
        
        const tempArray = isExp ? categoryExpList : categoryRevList;
        const tempAmountArray = isExp ? expAmountList : revAmountList;
        const tempAmountArrayNumbers = tempAmountArray.map(Number);
        const amountSum = tempAmountArrayNumbers.reduce((a, b) => a + b, 0);
  
        let chartDataTemp = tempArray.map((item,i) =>{
            
            let num = (tempAmountArrayNumbers[i]*100/amountSum).toFixed(1);
           
            const row = {};
            row["x"] = item.name;
            row.y = parseInt(tempAmountArray[i]);
            row.label = num.toString()+"%";
            return row;
        
        })
        let filteredData = chartDataTemp.filter(item => item.y != 0);
        let chartColors = [];
        filteredData.forEach(element => {
            let filteredObject = tempArray.find(item => item.name == element.x);
            chartColors.push(filteredObject.color);
        })
        return {filteredData, chartColors}
   
    }

    useEffect(()=>{
        let expChartData = GenerateDataForChart(true);
        SetChartExpensesData(expChartData.filteredData);
        SetExpColorList(expChartData.chartColors);

    },[expAmountList])

    useEffect(()=>{
        let revChartData = GenerateDataForChart(false);
        SetChartRevenueData(revChartData.filteredData);
        SetRevColorList(revChartData.chartColors);

    },[revAmountList])




    const ListItem = ({item}) =>(
        <View style = {[styles.listItem,{backgroundColor:item.categoryColor}]}>
            <View style={[styles.listItemIcon,{backgroundColor:item.categoryColor}]}>
              <Image style={{width:40,height:40}} source={item.categoryIcon}/>
            </View>
            <Text style={[styles.itemText,styles.listItemDescription]}>{item.description}</Text>
            <View style={styles.listItemAmountContainer}>
                <Text style={[styles.itemText,{fontWeight:'bold'}]}>{item.amount} PLN</Text>
            </View> 
        </View>
    );

    const renderItem = ({item}) => {        
        return (
            <ListItem
                item={item}
            />
        );
    }

    const showDatePicker = () =>{
        SetDatePicker(true);
    };
    function hideDatePicker(){
        SetDatePicker(false);   
    };
    const confirmDate = (date) => {
        hideDatePicker();
        //let mil = date.getTime();
        var ldate = date.getDate();
        var month = date.getMonth() + 1;
        if(month<10){month = '0'+month}
        var year = date.getFullYear();
        
        var customDate = ldate + '-' + month + '-' + year;
       
        isDateFrom ? SetCustomDateFrom(customDate) : SetCustomDateTo(customDate);
        SetCustomDatePicked(true);
        SetIsDateFrom(!isDateFrom);
       
    };
   

    return (
     <SafeAreaView style={styles.wrapper}>
        <View style = {styles.topPanel}>
            <Pressable style={styles.topPanelSwitcher} onPress={()=>SetIsExpenses(!isExpenses)}>
                <Text style={[styles.topPanelAccountText,{fontSize:15}]}>{isExpenses ? 'WYDATKI':'PRZYCHODY'}</Text>
            </Pressable>
            <View style={styles.topPanelAccount}>
                <Text style={[styles.topPanelAccountText,{fontSize:12}]}>{account.name}</Text>
                <Text style={[styles.topPanelAccountText,{fontSize:24}]}>{account.balance} PLN</Text>
            </View>
            <TouchableOpacity style={styles.topPanelCalendar} delayLongPress={1000} onLongPress={()=>{SetCustomDateFrom(null); SetCustomDateTo(null);}} onPress={showDatePicker}>
                {customDatePicked ?
                <>
                    <Text style={{color:colors.whitetext}}>{customDateFrom ? customDateFrom : 'min'}</Text>
                    <Image style={{width:25,height:25}} source={require('../assets/icons/Icon_Callendar.png')}></Image>
                    <Text style={{color:colors.whitetext}}>{customDateTo ? customDateTo : 'max'}</Text>
                </>
                :
                <Image style={{width:50,height:50}} source={require('../assets/icons/Icon_Callendar.png')}></Image>
                }
               
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePicker}
                mode="date"
                onConfirm={confirmDate}
                onCancel={hideDatePicker}
            />
        </View>
        <View style={styles.content}>
            <View style={styles.pieChartContainer}>
                <VictoryPie
                    data={isExpenses ? chartExpensesData:chartRevenueData}
                    height={Dimensions.get('window').width * 0.8}
                    radius={({ datum }) => 50 + datum.y*20}
                    colorScale={isExpenses ? expColorList:revColorList}
                    labelRadius={({ innerRadius }) => innerRadius + 80 }
                    innerRadius={50}
                    style={{labels: { fill:colors.black, fontSize: 18, fontWeight: "bold", opacity:0.9 }}}
                    
                />
            </View>
            <FlatList
                style={styles.recordList}
                data={isExpenses ? transactionExpList : transactionRevList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData = {account}
                
            />
        </View>
        <BottomPanel/>    
     </SafeAreaView> 
    );
}



const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        backgroundColor: colors.lightblue,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight:0
    },
    //TOP PANEL
    topPanel:{
        flex:1,
        flexDirection:'row',
    },
    topPanelSwitcher:{
        flex:1,
        color:colors.whitetext,
        backgroundColor:colors.navyblue,
        justifyContent:'center',
        alignItems:'center'
    },
    topPanelAccount:{
        flex:2,
        flexDirection:'column',
        backgroundColor:colors.navyblue,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'white',
        borderLeftWidth:1,
        borderRightWidth:1
        
       
    },
    topPanelAccountText:{
        color:colors.whitetext,
        textAlign:'center',

    },
    topPanelCalendar:{
        flex:1,
        backgroundColor:colors.navyblue,
        justifyContent:'center',
        alignItems:'center'
    },
    //CONTENT
    content:{
        flex:9,
        backgroundColor:colors.lightblue,
        alignItems:'center'
    },
    pieChartContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',
        overflow:'hidden'
        
    },
    PieChart:{
      
    },
    recordList:{
        flex:1,
        width:'95%',
        backgroundColor:colors.white,
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 5,
        
      
    },
    listItem:{
        flexDirection:'row',
        paddingVertical:10,
        paddingHorizontal:10,
        marginTop:7,
        marginBottom:5,
        flex:1,
        borderRadius:15,
        marginHorizontal:10,
        alignItems:'center',
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 3,
        
    },
    listItemIcon:{
        width:'16%',
        borderRadius:15,
        alignItems:'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 4},
        shadowRadius:50,
        elevation:4

    },
    itemText:{
        fontSize:20,
        //width:'40%',
        color:'white',
        textShadowColor:'black',
        textShadowOffset:{width: 0, height: 0},
        textShadowRadius:4
            
    },
    listItemDescription:{
        width:'46%', 
        fontWeight:'bold', 
        paddingLeft: 10
    },
    listItemAmountContainer:{
        width:'38%', 
        flexDirection:'row', 
        justifyContent:'flex-end', 
        alignItems:'center'
    },
})

