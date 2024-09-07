import React, {useState,Component} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Button,
  KeyboardAvoidingView
} from 'react-native';

import Slider from 'react-native-slider';
const SeekBar = ({
   positionMillis,
  durationMillis,
  sliderValue
  }) => {
sliderValue = positionMillis/durationMillis;
    return (
      <View >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <Text style={[{ width: 60 }]}>
            {positionMillis + ' / ' + durationMillis}
          </Text>
        </View>
        <View style={styles.container}>
        <Slider
          minimumValue={0}
          maximumValue={100}
          value={10}
          style={styles.slcontainer}
          minimumTrackTintColor='#fff'
          maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
          />
        </View>
        
      </View>
    );
  };
  var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  slcontainer:{
    width: 200, height: 40,
    backgroundColor:'red'
  }
});

  export default SeekBar;