import React,  {  useEffect, useState } from 'react';
import {Button, Dimensions, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar,TouchableHighlight, TouchableOpacity, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ColorPicker from 'react-native-wheel-color-picker';

import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { db, auth } from '../../firebase';
import {ref, onValue, set, push, child, update} from 'firebase/database';
import colors from '../config/colors';
import {iconList} from '../allData/iconList';
import { BottomPanel } from '../BottomPanel';

export default function EditCategoriesScreen() {
    const crntUser = auth.currentUser;
    const navigation = useNavigation();
    const route = useRoute();
    const category = route.params.item;
    const [icon, SetIcon] = useState(category.icon);
    const [color, SetColor] = useState(category.color);
   
    
    function UpdateCategoryDB(){

      update(ref(db,crntUser.uid+'/Categories/'+category.name), {
        icon:icon,
        color:color
      }).then(() =>{
        alert('Kategoria zaktualizowana pomyślnie');
      }).catch((error)=>{
        alert(error);
      });
    }
 
    const IconListItem = ({item}) =>{
         
          return(
            <TouchableOpacity style={styles.iconListItem} onPress={()=>{SetIcon(item.link);}}>
                <Image style={{width:40,height:40}} source={item.link}></Image>
            </TouchableOpacity>
          );
        };
    const renderItem = ({item}) => {        
      return (
          <IconListItem
              item={item}
          />
      );
    }
    const PickColor = color => {
      SetColor(color);
    }

   

  return (
    
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={{
        height:Dimensions.get('window').height
      }}>
        <View style={styles.topPanel}>
            <Text style={{fontSize:32, color:colors.whitetext}}>EDYCJA KATEGORII</Text>
      
        </View>
     
        <View style={styles.content}>
            <View style={styles.pickIconContainer}>
                <Text style={styles.label}>Wybierz ikonę</Text>
                <View style={styles.iconListContainer}>
                  <FlatList
                    style={styles.iconList}
                    data={iconList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                  />
                </View>
            </View>
            <View style={styles.pickColorContainer}>
              <Text style={styles.label}>Wybierz kolor</Text>
              <View style={styles.colorList}>
              <ColorPicker
                color={color}
                onColorChangeComplete={(color) => PickColor(color)}
                thumbSize={30}
                sliderSize={30}
                row={true}
                swatches={false}
                gapSize={0}
                shadeWheelThumb={false}
                />
                </View>
            </View>           
            <View style={styles.submitContainer}> 
              <View style={[styles.iconListItem, styles.IconTestItem,{backgroundColor:color}]}>
                  <Image style={{width:40,height:40}} source={icon}></Image>
              </View>           
              <Pressable style={styles.buttonSubmit} onPress={UpdateCategoryDB}>
                <Text style={{fontSize:24, color:colors.whitetext}}>ZAPISZ</Text>
              </Pressable>
            </View>       
        </View>
       
        <BottomPanel/>
        </ScrollView>
      </View>
      
      
  )
}


const styles = StyleSheet.create({
  wrapper: {
    flex:1,
    backgroundColor: colors.lightblue,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
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
    paddingVertical:10
  },
  navClickedElementText:{
    color:colors.violet,
    fontSize:28
  },

  content:{
    flex:8,
    backgroundColor:colors.white,
  },
  nameContainer:{
    flex:1,
    padding:10
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
  pickIconContainer:{
    flex:1,
    padding:10

  },
  iconListContainer:{
    flexDirection:'row',
    paddingVertival:20,
    flexWrap:'wrap',
    justifyContent:'center',
  },
  iconList:{
    paddingVertical:10
  },
  iconListItem:{
    padding:15,
    borderRadius:30,
    marginLeft:5,
    marginRight:5,
    marginTop:10,
    borderWidth:2,
    borderColor:colors.violet,
    backgroundColor:colors.navyblue

  },
  IconTestItem:{
    position:'absolute',
    left:15,
    bottom:15
  },
  pickColorContainer:{
    flex:2,
    padding:10,
    marginTop:10

  },
  colorList:{
    flexDirection:'row',
    paddingHorizontal:10,
  },
  colorListItem:{
    backgroundColor:colors.navyblue,
    width:50,
    height:50,
    borderRadius:20,
    borderWidth:2,
    borderColor:colors.violet,
    marginLeft:5,
    marginRight:5,
  },
  submitContainer:{
    flex:1,
    marginTop:20,
    justifyContent:'center',
    alignItems:'center'
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