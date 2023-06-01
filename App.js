
import React from "react";
import { LogBox } from "react-native";
//import ImagePickerComponent from "./App/functions/ImagePickerComponent";
import { NavigationContainer} from "@react-navigation/native";
import ScreenNavigator from "./App/screens/ScreenNavigator";
import { Button, Image, View, Text } from 'react-native';

export default function App() {
  LogBox.ignoreAllLogs(true);
    return (
      
      <ScreenNavigator/>
  );
}