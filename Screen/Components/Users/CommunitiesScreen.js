// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
// Import React and Component
import React, {useState,Component,useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
StyleSheet,
TextInput,
View,
Text,
ScrollView,
Image,
Keyboard,
TouchableOpacity,
Alert,
SafeAreaView,
KeyboardAvoidingView,
Modal
} from 'react-native';
import AppStyle from '../../Constants/AppStyle.js';
import Api from '../../Constants/Api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Loader from '../../Components/Loader';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import ProgressBar from '../Common/ProgressBar';

class CommunitiesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsData: [],
      selectedItems: [],
      selectedProfestionValue: [],
      selectedProfestionText: '',
      userSignupDataObj:{},
      errMsg:'Error',
      ishowMOdal:false,
      modalVisible:false
    };
  }
  createAlert = (FirstName) =>
  Alert.alert(
    "Required",
    FirstName,
    [
    { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
  getPrfessionalList = async () => {
    let data = JSON.stringify({
    category_id: 1
    });
    const token = await AsyncStorage.getItem('fcmtoken');
    // console.log(token);
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl+'/get-community', data, headers)
    .then(res => {
    // console.log(res.data);
    this.setState({itemsData:res.data.data}); 
    })
    .catch(error => {
      if(error.toJSON().message === 'Network Error'){
        this.setState({errMsg:AlertMessages.noInternetErr});
        this.setState({ishowMOdal:true});
        this.setState({loading:false}); 
      }else{
        this.setState({errMsg:error.toJSON().message});
        this.setState({ishowMOdal:true}); 
        this.setState({loading:false});
      }
    });
  }
  async componentDidMount(){
    this.getPrfessionalList();
    let userSignupData = await AsyncStorage.getItem('userSignupData');
    this.setState({userSignupDataObj:JSON.parse(userSignupData)});
   
  }
  closeBlockModal(){
  
    this.setState({ modalVisible:false});   
  }
  
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedProfestionValue:selectedItems });
    let allpGrup = this.state.itemsData;
    for (var i = 0; i < allpGrup.length; i++) {
      if(allpGrup[i]['id'] == selectedItems){
        this.setState({ selectedProfestionText:allpGrup[i]['name'] });
      }
    }
  };
  backScreen(){
    this.props.navigation.navigate('UserdetailScreen');
  }

  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }

  openStatusModal() { 
    
   if(this.state.selectedProfestionValue.length == 0){
      this.setState({errMsg:AlertMessages.professionalErr});
      this.setState({ishowMOdal:true});
      return;
    }
  this.setState({modalVisible:true});
  }

render (){
  const { selectedProfestionValue,itemsData,errMsg,ishowMOdal,modalVisible} = this.state;
  const { selectedItems} = this.state;
  const handleSubmitPress = () => {
    
    let preVvalue = this.state.userSignupDataObj;
    preVvalue.community_id = this.state.selectedProfestionValue;
    AsyncStorage.setItem('userSignupData',JSON.stringify(preVvalue));
    this.setState({ modalVisible:false}); 
    this.props.navigation.navigate('LanguagesScreen');
  };
return <View style={{flex:1,height:'100%'}}>
{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }

   <View style={styles.mainBody}>
    
    <View style={styles.topheadSection}>
         <TouchableOpacity onPress={() =>
            this.backScreen()} activeOpacity={0.7}>
            
            <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.backIconsCont}>

                <FontAwesome 
                  name={'angle-left'}
                  size={24} 
                  color={AppStyle.fontColor}
                  
                   
                />
               </LinearGradient>
            
         </TouchableOpacity>
         
      </View>
      <ProgressBar step='3' />
      <View style={styles.mainInnerBody}>
         <View style={styles.SectionHeadStyle}>
            <Text style={styles.SectionHedText}>User Profession</Text>
         </View>
         <View style={styles.ContentHeadStyle}>
            <Text style={styles.SectionContText}>Select a professional group you belong to</Text>
           
         </View>
         <View style={styles.mainStection}>
            <View style={styles.selectboxContainer}>
               <SectionedMultiSelect
            items={itemsData}
            IconRenderer={Icon}
            uniqueKey="id"
            subKey="children"
            selectText="Select a professional group"
            showDropDowns={true}
            single={true}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={this.state.selectedProfestionValue}
            subItemFontFamily={{fontFamily:'Abel'}}
            itemFontFamily={{fontFamily:'Abel'}}
            searchTextFontFamily={{fontFamily:'Abel'}}
            confirmFontFamily={{fontFamily:'Abel'}}
            searchPlaceholderText='Select your profession'
            colors={{primary:'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)'}}
            hideConfirm={true}
            showCancelButton={true}
             styles={{
                
                cancelButton:{
                  backgroundColor:'rgba(253, 139, 48, 0.69)',
                  width:'100%',
                  minWidth:'100%'

                } ,
                selectToggleText: {
                 fontFamily:'Abel'
                 },
                 itemText: {
                 fontSize:16,
                 marginLeft:15
                 },
                item: {
                 marginTop:10,
                 textAlign:'center',
                 marginBottom:10,
                },
                selectToggle:{
                  marginTop:15
                },
                container:{
                  flex:0,
                  top:'10%',
                  width:'auto',
                  height:450,
                  paddingTop:10,
                  overflow:'scroll',                   
                  paddingBottom:0,                   
                }
              }}
            
          />
            </View>
         </View>
      </View>
   </View>
   <View style={styles.btnCont}>
      <TouchableOpacity
         activeOpacity={0.9}
         onPress={this.openStatusModal.bind(this)}>
         <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonStyle}>
         <Text style={styles.buttonTextStyle}>Next</Text>
         </LinearGradient>
      </TouchableOpacity>
   </View>

   <View style = {styles.Mdcontainer}>  
        <Modal            
          animationType = {"fade"}  
          transparent = {true}  
          visible = {modalVisible}  
          onRequestClose = {() =>{ } }>  
          {/*All views of Modal*/}  
              <View style = {styles.modal}> 
              <Text style = {styles.modalTitle}>{AlertMessages.filedProfessMsg}</Text> 
              <Text style = {styles.modalTitle}>{this.state.selectedProfestionText}</Text> 
              
             <Text style = {styles.modalTitle}>Click <Text style = {styles.modalCTitle}>Cancel</Text> to change.</Text> 

             <Text style = {styles.modalTitle}>Click <Text style = {styles.modalCTitle}>Ok</Text> to continue.</Text> 
              <View style = {styles.Btnmodal}>
               <TouchableOpacity
              
              activeOpacity={0.9}
              onPress= {() => {  
                this.closeBlockModal();
                  }} style={styles.buttonOuter}>
               <View
        style={styles.buttonCStyle}>
              <Text style={styles.buttonTextMStyle}>Cancel</Text>
              </View>
            </TouchableOpacity> 

             <TouchableOpacity
              
              activeOpacity={0.9}
               onPress={handleSubmitPress}
               style={styles.buttonOuter}>
               <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonMStyle}>
              <Text style={styles.buttonTextMStyle}>Ok</Text>
              </LinearGradient>
            </TouchableOpacity> 


            </View>
 
              
          </View>  
        </Modal>  
        {/*Button will change state to true and view will re-render*/}  
        
      </View>

</View>
}
};
export default CommunitiesScreen;
const styles = StyleSheet.create({
  mainBody: {
  flex:1,
  justifyContent: 'center',
  backgroundColor: AppStyle.appColor,
  paddingLeft: AppStyle.appLeftPadding,
  paddingRight: AppStyle.appRightPadding,
  paddingBottom: 35,
  paddingTop: 35,
  },
  topheadSection:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  flexDirection:'row',
  marginBottom:15,
  },
  backIconsCont:{
  borderWidth:1,
  borderColor:'#E8E6EA',
  borderRadius:15,
  paddingTop:12,
  paddingBottom:12,
  paddingLeft:20,
  paddingRight:20
  },
  mainInnerBody:{
  flex:1,
  alignContent:'space-between',
  },
  SectionHeadStyle: {
  flexDirection: 'row',
  paddingBottom:15,
  paddingTop: 15,
  },
  mainStection:{
  paddingTop: 25,
  },
  selectboxOuterStyle:{
  borderWidth:0,
  width:'100%',
  borderStyle: "solid",
  backgroundColor:'#fff'
  },
  selectboxContainer:{
  color: AppStyle.inputBlackcolorText,
  paddingLeft: 15,
  fontFamily: 'Abel',
  borderWidth:1,
  borderColor:'#E8E6EA',
  borderRadius:16,
  height:55,
  marginBottom:22
  },
  SectionLabel:{
  position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
  backgroundColor:'#fff',
  paddingLeft:10,
  paddingRight:10,
  width:120,
  height:25,
  textAlign:'center',
  fontFamily: 'Abel'
  },
  SectionContText:{
  fontSize:16,
  fontFamily: 'Abel',
  lineHeight:24,
  color: AppStyle.fontColor,
  },
  SectionHedText:{
  fontSize:AppStyle.aapPageHeadingSize,
  fontFamily: 'GlorySemiBold',
  lineHeight:30,
  color: AppStyle.fontColor,
  },
  btnCont:{
  position:'absolute',
  bottom:0,
  width:'100%',
  paddingLeft: AppStyle.appLeftPadding,
  paddingRight: AppStyle.appRightPadding,
  marginBottom:25
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
  color: AppStyle.fontButtonColor,
  fontSize: AppStyle.buttonFontsize,
  fontFamily: 'GlorySemiBold',
  textTransform:'capitalize'
  },
  selectStyle: {
  height:58,
  width:158,
  color: AppStyle.inputBlackcolorText,
  fontWeight: 'bold',
  fontSize: 14,
  width:'100%',
  fontFamily: 'Abel'
  },
  errorTextStyle: {
  color: 'red',
  textAlign: 'center',
  fontSize: 14,
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
    top:'35%',
    paddingTop:30,
    paddingBottom:30,
    paddingLeft:25,
    paddingRight:25
   },  
   buttonTextMStyle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 15,
    textTransform:'capitalize'  
   },  
   modalTitle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 16,
   
    marginBottom:10 
   },  
   modalCTitle: {  
    color: 'rgba(253, 139, 48,0.8)',
    fontFamily: 'GlorySemiBold',
    fontSize: 18,
    textAlign:'left',
    marginBottom:10 
   },
   Btnmodal:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
   buttonOuter:{
   
   marginTop:20
   },
   buttonMStyle:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    borderRadius:15,
     width:110,
     marginLeft:10
   } ,
   buttonCStyle:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    borderRadius:15,
     width:110,
     borderWidth:1,
     borderColor:AppStyle.appIconColor
   } 
});
