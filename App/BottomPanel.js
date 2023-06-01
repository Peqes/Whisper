import React,  {  useEffect, useState } from 'react';
import { StyleSheet, Text, View,Dimensions, Image, Alert, TouchableOpacity } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import colors from './config/colors';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native';

export const BottomPanel = () => {
    // dodać, że nie pomylić z react-native-dom useNavigation.
    const navigation = useNavigation();
    const [showAdd, SetShowAdd] = useState(false);
    return(
        <View style={PStyles.wrapper}>
            {showAdd ? (
            <View style={PStyles.AddButtonsContainer}>
                <TouchableOpacity style={PStyles.AddIconContainer} onPress={()=>navigation.navigate("AddTransactionsScreen")}>
                    <Image style={PStyles.AddIcon} source={require('./assets/icons/Icon_Hand.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={PStyles.AddIconContainer} onPress={()=>navigation.navigate("TakePictureScreen")}>
                    <Image style={PStyles.AddIcon} source={require('./assets/icons/Icon_Camera.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={PStyles.AddIconContainer} onPress={()=>navigation.navigate("LoadImageScreen")}>
                    <Image style={PStyles.AddIcon} source={require('./assets/icons/Icon_Receipt_Purple.png')}></Image>
                </TouchableOpacity>            
            </View>) : null}
            <TouchableOpacity style={[PStyles.element,{borderLeftWidth:0}]} onPress={()=>navigation.navigate("CategoriesScreen")} >
                <Image style={PStyles.icon} source={require('./assets/icons/Icon_Categories.png')}></Image>
            </TouchableOpacity>    
            <TouchableOpacity style={PStyles.element} onPress={()=>navigation.navigate("AccountsScreen")}>
                <Image style={PStyles.icon} source={require('./assets/icons/Icon_Accounts.png')}></Image>
            </TouchableOpacity>  
            <View style={[PStyles.element,PStyles.midElement]}>
                <TouchableOpacity style={PStyles.midElementCircle} onPress={()=>SetShowAdd(!showAdd)}>
                    <Image style={PStyles.midIcon} source={require('./assets/icons/Icon_AddButton.png')}></Image>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={PStyles.element} onPress={()=>navigation.navigate("MainScreen")}>
                <Image style={PStyles.icon} source={require('./assets/icons/Icon_MainChart.png')} ></Image>
            </TouchableOpacity>  
            <TouchableOpacity style={[PStyles.element,{borderRightWidth:0}]} onPress={()=>navigation.navigate("TransactionsScreen")}>
                <Image style={PStyles.icon} source={require('./assets/icons/Icon_Transactions.png')}></Image>  
            </TouchableOpacity>  
        </View>
    );

};

const PStyles = StyleSheet.create({
    wrapper:{
       
        flex:0.8,
        backgroundColor:'white',
        flexDirection:'row',
        borderWidth:2,
        borderColor:colors.violet,
        position:'relative',
        elevation:2
       
    },
    AddButtonsContainer:{
        position:'absolute',
        top:-100,
        left:(Dimensions.get('window').width / 2) - ((Dimensions.get('window').width / 5.5) * 3 / 2),//Panel podzielony jest na 5.5 części flex
        width:(Dimensions.get('window').width / 5.5) * 3,
        height:100,
        backgroundColor:colors.white,
        elevation:3,
        borderWidth:2,
        borderColor:colors.violet,
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        flexDirection:'row',
        justifyContent:'space-around',
        paddingTop:10
        

    },
    AddIcon:{
        width:50,
        height:50,
        
    },
    element:{
        flex:1,
        backgroundColor:colors.white,
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        borderTopWidth:1,
        borderLeftWidth:1,
        borderRightWidth:1,
        borderColor:colors.violet,
    
    },
    midElement:{
        flex:1.5,
        backgroundColor:colors.white

    },
    midElementCircle:{
        alignItems:'center',
        justifyContent:'center',
        width:Math.round(Dimensions.get('window').width *0.2),
        height:Math.round(Dimensions.get('window').width *0.2),
        borderRadius:100,
        backgroundColor:colors.white,
        transform:[{translateY:-20}],
        borderWidth:3,
        borderColor:colors.violet,

       
    },
    midIcon:{
        overflow:"hidden",
        width:"80%",
        height:"80%"
    },
    icon:{
        width:'50%',
        height:'50%'
    }
});