import {StyleSheet, View,Modal,Text,Button,TouchableOpacity} from 'react-native';
import React, {useState,Component} from 'react';
import AppStyle from '../../Constants/AppStyle.js';
import { LinearGradient } from 'expo-linear-gradient';

class UseAlertModal extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      modalVisible:true
    };
  }

  onTrigger = () => {
    
      this.props.parentCallback(false);
    };
  
  render (){
   const {modalVisible} = this.state;


    
   return <View style = {styles.container}>  
        <Modal            
          animationType = {"fade"}  
          transparent = {true}  
          visible = {modalVisible}  
          onRequestClose = {() =>{ console.log("Modal has been closed."); } }>  
          {/*All views of Modal*/}  
              <View style = {styles.modal}>  
              <Text style = {styles.buttonTextStyle}>{this.props.message}</Text> 
               <TouchableOpacity
              
              activeOpacity={0.9}
              onPress= {() => {  
                  this.setState({ modalVisible:false}); this.onTrigger();}} style={styles.buttonOuter}>
               <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Close</Text>
              </LinearGradient>
            </TouchableOpacity> 
              
          </View>  
        </Modal>  
        {/*Button will change state to true and view will re-render*/}  
        
      </View>
  }
}
export default UseAlertModal;

const styles = StyleSheet.create({
   container: {  
   
  },  
  modal: { 
  marginLeft:'10%',
  marginRight:'10%',  
  backgroundColor : AppStyle.btnbackgroundColor,   
  
  width: '80%',  
  borderRadius:15,  
  borderWidth: 1,  
  borderColor: '#fff',
  position:'absolute',
    top:'45%',
    paddingTop:25,
    paddingBottom:25,
    paddingLeft:20,
    paddingRight:20,
    alignItems:'center'
   
   },  
   buttonTextStyle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 14,
    textTransform:'capitalize'  
   },
   buttonOuter:{
   flexDirection:'row',
   marginTop:20
   },
   buttonStyle:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    borderRadius:15,
     width:'40%',
   } 
});
