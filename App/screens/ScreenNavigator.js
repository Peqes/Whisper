import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';


import WelcomeScreen from "./WelcomeScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import MainScreen from "./MainScreen";
import CategoriesScreen from "./CategoriesScreen";
import AddCategoriesScreen from "./AddCategoriesScreen";
import TransactionsScreen from "./TransactionsScreen";
import AddTransactionsScreen from "./AddTransactionsScreen";
import AccountsScreen from "./AccountsScreen";
import AddAccountsScreen from "./AddAccountsScreen";
import PickCategoryScreen from "./PickCategoryScreen";
import PickAccountScreen from "./PickAccountScreen";
import LoadImageScreen from "./LoadImageScreen";
import EditCategoriesScreen from "./EditCategoriesScreen";
import EditTransactionsScreen from "./EditTransactionsScreen";
import ReceiptsScreen from "./ReceiptsScreen";
import ShowReceiptScreen from "./ShowReceiptScreen";
import PickTransactionScreen from "./PickTransactionScreen";
import TakePictureScreen from "./TakePictureScreen";
import InfoScreen from "./InfoScreen";

const {Navigator, Screen} = createNativeStackNavigator();

const ScreenNavigator = () => {

    return(
    <NavigationContainer>
        <Navigator initialRouteName="WelcomeScreen" screenOptions={{headerShown:false}}>
            <Screen name="WelcomeScreen" component={WelcomeScreen}></Screen>
            <Screen name="LoginScreen" component={LoginScreen}></Screen>
            <Screen name="RegisterScreen" component={RegisterScreen}></Screen>
            <Screen name="MainScreen" component={MainScreen}></Screen>
            <Screen name="CategoriesScreen" component={CategoriesScreen}></Screen>
            <Screen name="AddCategoriesScreen" component={AddCategoriesScreen}></Screen>
            <Screen name="AccountsScreen" component={AccountsScreen}></Screen>
            <Screen name="AddAccountsScreen" component={AddAccountsScreen}></Screen>
            <Screen name="TransactionsScreen" component={TransactionsScreen}></Screen> 
            <Screen name="AddTransactionsScreen" component={AddTransactionsScreen}></Screen> 
            <Screen name="PickCategoryScreen" component={PickCategoryScreen}></Screen> 
            <Screen name="PickAccountScreen" component={PickAccountScreen}></Screen>
            <Screen name="LoadImageScreen" component={LoadImageScreen}></Screen>
            <Screen name="EditCategoriesScreen" component={EditCategoriesScreen}></Screen>
            <Screen name="EditTransactionsScreen" component={EditTransactionsScreen}></Screen>
            <Screen name="ReceiptsScreen" component={ReceiptsScreen}></Screen>
            <Screen name="ShowReceiptScreen" component={ShowReceiptScreen}></Screen>
            <Screen name="PickTransactionScreen" component={PickTransactionScreen}></Screen>
            <Screen name="TakePictureScreen" component={TakePictureScreen}></Screen>
            <Screen name="InfoScreen" component={InfoScreen}></Screen>
        </Navigator>
    </NavigationContainer>
    );
}

export default ScreenNavigator;