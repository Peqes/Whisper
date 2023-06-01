import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar, SafeAreaView, KeyboardAvoidingView, TextInput, Pressable, TouchableOpacity} from 'react-native';
import ImagePickerComponent from "../functions/ImagePickerComponent";
import colors from '../config/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../firebase';

export default function LoadImageScreen(){
    
    const navigation = useNavigation();
    const crntUser = auth.currentUser;

    return (
    <View style={styles.wrapper}>
        <Text style={styles.headerText}>Dodaj zdjęcie paragonu</Text>
        <ImagePickerComponent/>
    </View>
    );
    
}
const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        backgroundColor: colors.lightblue,
        paddingTop: StatusBar.currentHeight + 20,
        alignItems:'center',
        position:'relative',
      
    },
    headerText:{
        fontSize:24,
        color:colors.whitetext,
        padding:10,
        textAlign:'center',
        backgroundColor:colors.navyblue,
        alignSelf:'stretch',
        opacity:0.8,
        borderTopWidth:2,
        borderBottomWidth:2,
        borderColor:colors.white
    },
    
   
});