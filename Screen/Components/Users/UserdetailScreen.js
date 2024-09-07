// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
// Import React and Component
import React, {useState,Component} from 'react';
import {Picker} from '@react-native-picker/picker';
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
KeyboardAvoidingView,
Modal
} from 'react-native';
import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker from "react-native-country-codes-picker";
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import Loader from '../Loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Api from '../../Constants/Api.js';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import ProgressBar from '../Common/ProgressBar';

import axios from 'axios';
class UserdetailScreen extends Component {
constructor(props) {
super(props);
this.state = {
	Ethnicity: '',
	FirstName: '',
	selectedGenderValue:'',
	selectedAgeValue:'',
	selectedReligionValue:'',
	selectedStateValue:'',
	selectedCityValue:'',
	selectedItems: [],
	GselectedItems: [],
	AselectedItems: [],
	RselectedItems: [],
	SselectedItems: [],
	CselectedItems: [],
	userSignupDataObj:{},
	CountryitemsData: [],
	StateitemsData: [],
	CityitemsData: [],
	loading:false,
	isShowReligion:false,
	modalVisible:false,
	
	setLocation:null,
      errMsg:'Error',
      ishowMOdal:false
};



this.state.genderoptions = [
{ value: 'chocolate', label: 'Chocolate' },
{ value: 'strawberry', label: 'Strawberry' },
{ value: 'vanilla', label: 'Vanilla' }
]
}
async getLocations(){
	let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      console.log(status);
      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      this.setState({'setLocation':location});

}
createAlert = (FirstName) =>
Alert.alert(
"Required",
FirstName,
[
{ text: "OK", onPress: () => console.log("OK Pressed") }
]
);
setSelectedValue(itmVal,type){
	if(type == 'FirstName'){
		this.setState({FirstName: itmVal });
	}else if(type == 'LastName'){
		this.setState({LastName: itmVal });
	}else  if(type == 'gender'){
		this.setState({selectedGenderValue: itmVal });
	}if(type == 'age'){
		this.setState({selectedAgeValue: itmVal });
	}else if(type == 'religion'){
		this.setState({selectedReligionValue: itmVal });
	}else if(type == 'State'){
		this.setState({selectedStateValue: itmVal });
	}else if(type == 'city'){
		this.setState({selectedCityValue: itmVal });
	}
}
handleInput(value, key) {
// /^(?:[A-Za-z]+|\d+)$/.test(this.state.myValue);
this.setState({[key]: value.replace(/[^A-Za-z]/g, '')});
}

onSelectedItemsChange = (selectedItems) => {
	 
 

this.setState({ selectedItems });
this.getStateList(selectedItems);
};
onGSelectedItemsChange = (selectedItems) => {
this.setState({ GselectedItems:selectedItems });
};
onASelectedItemsChange = (selectedItems) => {
this.setState({ AselectedItems:selectedItems });
};
onRSelectedItemsChange = (selectedItems,val) => {
this.setState({ RselectedItems:selectedItems });
};
onSSelectedItemsChange = (selectedItems,val) => {
this.setState({ SselectedItems:selectedItems });
this.setState({ CselectedItems:"" });
this.getCityList(selectedItems);
};
onCSelectedItemsChange = (selectedItems,val) => {
this.setState({ CselectedItems:selectedItems });
};

 openStatusModal() { 
    
    if (!this.state.FirstName) {
    this.setState({errMsg:AlertMessages.firstNameErr});
  	this.setState({ishowMOdal:true});
    return;
  }else if(!this.state.LastName){
    this.setState({errMsg:AlertMessages.lastNameErr});
  	this.setState({ishowMOdal:true});
    return;
  }else if(this.state.GselectedItems == ''){
  	this.setState({errMsg:AlertMessages.genderErr});
  	this.setState({ishowMOdal:true});
    return;
  }else if(this.state.AselectedItems == ''){
  	this.setState({errMsg:AlertMessages.ageErr});
  	this.setState({ishowMOdal:true});
    return;
  }else if(this.state.RselectedItems == ''){
    this.setState({errMsg:AlertMessages.religoinErr});
  	this.setState({ishowMOdal:true});
    return;
  }else if(this.state.selectedItems == ''){
    this.setState({errMsg:AlertMessages.countryErr});
  	this.setState({ishowMOdal:true});
    return;
  }else if(this.state.SselectedItems == ''){
    this.setState({errMsg:AlertMessages.stateErr});
  	this.setState({ishowMOdal:true});
    return;
  }else if(this.state.CselectedItems == ''){
    this.setState({errMsg:AlertMessages.cityErr});
  	this.setState({ishowMOdal:true});
    return;
  }
  this.setState({modalVisible:true});
  }

  closeBlockModal(){
  
  	this.setState({ modalVisible:false}); 	
  }

getCountryList = async () => {
	this.state.loading = true;
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
    axios.post(Api.apiUrl+'/get-countries', data, headers)
    .then(res => {
    	this.state.loading = false;
    // console.log(res.data);
    this.setState({CountryitemsData:res.data.data}); 
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

  backScreen(){
    this.props.navigation.navigate('LoginScreen');
  }

  getStateList = async (country_id) => {

  	this.state.loading = true;
    let data = JSON.stringify({
    country_id: country_id
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
    axios.post(Api.apiUrl+'/get-states', data, headers)
    .then(res => {
    this.state.loading = false;
    this.setState({StateitemsData:res.data.data}); 
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

  getCityList = async (state_id) => {
  	this.state.loading = true;
    let data = JSON.stringify({
    state_id: state_id
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
    axios.post(Api.apiUrl+'/get-cities', data, headers)
    .then(res => {
    this.state.loading = false;
    this.setState({CityitemsData:res.data.data}); 
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
  	let userSignupData = await AsyncStorage.getItem('userSignupData');
  	let uParseData = JSON.parse(userSignupData);
  	//alert(uParseData.country_code.replace('+', ' '));
    this.getStateList(uParseData.country_code.replace('+', ''));
    this.getLocations();

    this.setState({ 'selectedItems':uParseData.country_code.replace('+', '') });

    if(uParseData.country_code.replace('+', '') == '91'){
	 	this.setState({'isShowReligion':true});

	 }else{
	 	this.setState({'isShowReligion':false});
	 	let rgVal = ['Other Religion'];
	 	this.setState({RselectedItems:rgVal})
	 	
	 }
    
    this.setState({userSignupDataObj:JSON.parse(userSignupData)});
  }

  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData})
  }

render (){
const { CountryitemsData,StateitemsData,CityitemsData,FirstName,LastName,selectedValue,GselectedItems,AselectedItems,RselectedItems,SselectedItems,CselectedItems,loading,Ethnicity,setLocation,isShowReligion,errMsg,ishowMOdal,modalVisible } = this.state;

// Item array for the dropdown
const items = [
      {
        name: 'Banking and Financial Advisors',
        id: 10,
      },
      {
        name: 'Online Sellersand Marketers',
        id: 11,
      },
      {
        name: 'Movers and Packers',
        id: 12,
      },
      {
        name: 'Real Estate Consultants',
        id: 13,
      },
      {
        name: 'Architects and Builders',
        id: 14,
      },
      {
        name: 'Legal and Accounting Advisors',
        id: 15,
      }
    ];
	const Genderitems = [
				{
					name: 'Male',
					id: 'Male'
				},
				{
					name: 'Female',
					id: 'Female'
				},
				{
					name: 'Other',
					id: 'Other'
				}
				];   
	const Religionitems = [
				{
					name: 'Buddhism',
					id: 'Buddhism'
				},
				{
					name: 'Christianity',
					id: 'Christianity'
				},
				{
					name: 'Hinduism',
					id: 'Hinduism'
				},
				{
					name: 'Islam',
					id: 'Islam'
				},
				{
					name: 'Jainism',
					id: 'Jainism'
				},
				{
					name: 'Sikhism',
					id: 'Sikhism'
				},
				{
					name: 'Other Religion',
					id: 'Other Religion'
				}
			];
	const Agegroupitems = [
				{
					name: '18-25',
					id: '18-25'
				},
				{
          name: '25-30',
          id: '25-30'
        },
        {
          name: '30-35',
          id: '30-35'
        },
				{
					name: '35-40',
					id: '35-40'
				},
				{
					name: '40-45',
					id: '40-45'
				},
				{
					name: '45-50',
					id: '45-50'
				},
				{
					name: '50-55',
					id: '50-55'
				},
				{
					name: '55-60',
					id: '55-60'
				},
				{
					name: '60 & above',
					id: '60 & above'
				}
				];  


	
	/*if(this.state.selectedItems != '91'){
		
	*/
		Religionitems.push({
					name: 'Not Religious',
					id: 'Not Religious'
				});
	/*}	*/	
	const EthnicityView = [];
	
	if(this.state.selectedItems != '91' && this.state.selectedItems != ''){
    console.log(this.state.selectedItems)
		EthnicityView.push(<View kye={this.state.selectedItems} style={styles.inputboxContainer}>
            <TextInput
               style={styles.inputStyle}
               onChangeText={(Ethnicity) =>
            this.handleInput(Ethnicity,'Ethnicity')
            }
            value={this.state.Ethnicity}
            placeholder="" 
            placeholderTextColor="#000"
            autoCapitalize="none"
            />
            <Text style={styles.SectionEntiLabel}>Ethnicity</Text>
         </View>)
	}				 
		 

const handleSubmitPress = () => {



  
	let preVvalue = this.state.userSignupDataObj;
	let EthnicityVal = this.state.Ethnicity;
	if(Ethnicity == ''){
		EthnicityVal = 'Indian';
	}

	//alert(EthnicityVal);

	preVvalue.FirstName = this.state.FirstName,
	preVvalue.LastName = this.state.LastName,
	preVvalue.selectedGenderValue = this.state.GselectedItems,
	preVvalue.selectedAgeValue = this.state.AselectedItems,
	preVvalue.selectedCountryValue = this.state.selectedItems,
	preVvalue.selectedStateValue = this.state.SselectedItems,
	preVvalue.selectedCityValue = this.state.CselectedItems,
	preVvalue.selectedReligionValue = this.state.RselectedItems
	preVvalue.EthnicityVal = EthnicityVal;
	preVvalue.userLocation = this.state.setLocation;
	//console.log(preVvalue);
	//return false;

	AsyncStorage.setItem('userSignupData',JSON.stringify(preVvalue));
	this.setState({modalVisible:false});
	this.props.navigation.navigate('CommunitiesScreen');
};

return <View style={styles.mainBody}><SafeAreaView><ScrollView showsVerticalScrollIndicator={false}keyboardShouldPersistTaps = 'always'>
{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }
	<Loader loading={loading} />
   	<ProgressBar step='2' />
      <View style={styles.SectionHeadStyle}>
         <Text style={styles.SectionHedText}>User Personal Details</Text>
      </View>
      <View style={styles.mainStection}>
       
         <View style={styles.inputboxContainer}>
            <TextInput
               style={styles.inputStyle}
               onChangeText={(LastName) =>
            this.handleInput(LastName,'FirstName')
            }
            value={this.state.FirstName}
            placeholder="" 
            placeholderTextColor={AppStyle.fontColor}
            autoCapitalize="none"
            />
            <Text style={[styles.SectionLabel,{width:93}]}>First Name</Text>
         </View>
         <View style={styles.inputboxContainer}>
            <TextInput
               style={styles.inputStyle}
               onChangeText={(LastName) =>
            this.handleInput(LastName,'LastName')
            }
            value={this.state.LastName}
            placeholder="" 
            placeholderTextColor={AppStyle.fontColor}
            autoCapitalize="none"
            returnKeyType="next"
            />
            <Text style={[styles.SectionLabel,{width:91}]}>Last Name</Text>
         </View>
         <View style={styles.selectboxContainer}>
          

            <SectionedMultiSelect
	          items={Genderitems}
	          IconRenderer={Icon}
	          uniqueKey="id"
	          subKey="children"
	          selectText=""
	          showDropDowns={true}
	          single={true}
	          onSelectedItemsChange={this.onGSelectedItemsChange}
	          selectedItems={this.state.GselectedItems}
	          subItemFontFamily={{fontFamily:'Abel'}}
	          itemFontFamily={{fontFamily:'Abel'}}
	          selectTextFontFamily={{fontFamily:'Abel'}}
	          searchTextFontFamily={{fontFamily:'Abel'}}
	          text={AppStyle.fontColor}
	          confirmFontFamily={{fontFamily:'Abel'}}
	          showCancelButton={true}
	          
	          colors={{primary:'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)'}}
	           hideConfirm={true}
	           modalAnimationType={'fade'}
	           hideSearch={true}
	            styles={{
		            
		            selectToggleText: {
		             fontFamily:'Abel',
		             fontSize:15,
		             color:AppStyle.fontColor,

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
		            cancelButton:{
		            	backgroundColor:'rgba(253, 139, 48, 0.69)',
		            	width:'100%',
		            	minWidth:'100%',
		            	marginTop:-35
		            },
		            container:{
		            	flex:0,
		            	top:'20%',
		            	width:'auto',
		            	height:200,
		            	paddingTop:10,
		            }    
		          }}
	          
	        />
            <Text style={[styles.SectionLabel,{width:66}]}>Gender</Text>
         </View>
         <View style={styles.selectboxContainer}>
            <SectionedMultiSelect
	          items={Agegroupitems}
	          IconRenderer={Icon}
	          uniqueKey="id"
	          subKey="children"
	          selectText=""
	          showDropDowns={true}
	          single={true}
	          onSelectedItemsChange={this.onASelectedItemsChange}
	          selectedItems={this.state.AselectedItems}
	          subItemFontFamily={{fontFamily:'Abel'}}
	          itemFontFamily={{fontFamily:'Abel'}}
	          selectTextFontFamily={{fontFamily:'Abel'}}
	          searchTextFontFamily={{fontFamily:'Abel'}}
	          confirmFontFamily={{fontFamily:'Abel'}}
	          colors={{primary:'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)'}}
	           hideConfirm={true}
	           modalAnimationType={'fade'}
	           showCancelButton={true}
	           hideSearch={true}
	            styles={{
		            
		            cancelButton:{
                  backgroundColor:'rgba(253, 139, 48, 0.69)',
                  width:'100%',
                  minWidth:'100%'

                } ,
                selectToggleText: {
                 fontFamily:'Abel',
                 fontSize:15,
                 color:AppStyle.fontColor
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
		            	height:415,
		            	paddingTop:10,
		            	overflow:'scroll',
		            }   
		          }}
	        />
            <Text style={[styles.SectionLabel,{width:85}]}>Age Group</Text>
         </View>
          
         {isShowReligion && <View style={styles.selectboxContainer}>
            <SectionedMultiSelect
	          items={Religionitems}
	          IconRenderer={Icon}
	          uniqueKey="id"
	          subKey="children"
	          selectText=""
	          showDropDowns={true}
	          single={true}
	          onSelectedItemsChange={this.onRSelectedItemsChange}
	          selectedItems={this.state.RselectedItems}
	          subItemFontFamily={{fontFamily:'Abel'}}
	          itemFontFamily={{fontFamily:'Abel'}}
	          selectTextFontFamily={{fontFamily:'Abel'}}
	          searchTextFontFamily={{fontFamily:'Abel'}}
	          confirmFontFamily={{fontFamily:'Abel'}}
	          colors={{primary:'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)'}}
	           hideConfirm={true}
	           modalAnimationType={'fade'}
	          showCancelButton={true}
	           hideSearch={true}
	            styles={{
		            
		            cancelButton:{
                  backgroundColor:'rgba(253, 139, 48, 0.69)',
                  width:'100%',
                  minWidth:'100%'

                } ,
                selectToggleText: {
                 fontFamily:'Abel',
                 fontSize:15,
                 color:AppStyle.fontColor
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
            <Text style={[styles.SectionLabel,{width:72}]}>Religion</Text>
         </View> }
         
         <View style={styles.selectboxNwContainer}>
             <SectionedMultiSelect
	          items={StateitemsData}
	          IconRenderer={Icon}
	          uniqueKey="id"
	          subKey="children"
	          selectText=""
	          showDropDowns={true}
	          single={true}
	          onSelectedItemsChange={this.onSSelectedItemsChange}
	          selectedItems={this.state.SselectedItems}
	          subItemFontFamily={{fontFamily:'Abel'}}
	          itemFontFamily={{fontFamily:'Abel'}}
	          searchTextFontFamily={{fontFamily:'Abel'}}
	          confirmFontFamily={{fontFamily:'Abel'}}
	          searchPlaceholderText='Search State'
	          colors={{primary:'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)'}}
	          showCancelButton={true}
	          hideConfirm={true}
	          styles={{
		            
		            cancelButton:{
                  backgroundColor:'rgba(253, 139, 48, 0.69)',
                  width:'100%',
                  minWidth:'100%'

                } ,
                selectToggleText: {
                 fontFamily:'Abel',
                 fontSize:15,
                 color:AppStyle.fontColor
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
            <Text style={[styles.SectionLabel,{width:57}]}>State</Text>
         </View>
         <View style={styles.selectboxNwContainer}>
             <SectionedMultiSelect
	          items={CityitemsData}
	          IconRenderer={Icon}
	          uniqueKey="id"
	          subKey="children"
	          selectText=""
	          showDropDowns={true}
	          single={true}
	          onSelectedItemsChange={this.onCSelectedItemsChange}
	          selectedItems={this.state.CselectedItems}
	          subItemFontFamily={{fontFamily:'Abel'}}
	          itemFontFamily={{fontFamily:'Abel'}}
	          searchTextFontFamily={{fontFamily:'Abel'}}
	          confirmFontFamily={{fontFamily:'Abel'}}
	          searchPlaceholderText='Search City'
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
                 fontFamily:'Abel',
                 fontSize:15,
                 color:AppStyle.fontColor
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
            <Text style={[styles.SectionLabel,{width:47}]}>City</Text>


         </View>
         {EthnicityView}
      </View>
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
      <View style = {styles.Mdcontainer}>  
        <Modal            
          animationType = {"fade"}  
          transparent = {true}  
          visible = {modalVisible}  
          onRequestClose = {() =>{ } }>  
          {/*All views of Modal*/}  
              <View style = {styles.modal}> 
              <Text style = {styles.modalTitle}>{AlertMessages.filedUaserdeMsg}</Text> 
              <Text style = {styles.modalTitle}>{this.state.RselectedItems}</Text> 
              
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
</ScrollView></SafeAreaView></View>
}
};
export default UserdetailScreen;
const styles = StyleSheet.create({
mainBody: {
flex: 1,
justifyContent: 'center',
backgroundColor: AppStyle.appColor,
alignContent: 'center',
paddingLeft: AppStyle.appLeftPadding,
paddingRight: AppStyle.appRightPadding,
paddingBottom: AppStyle.appBottomPadding,
paddingTop: 35,
},
SectionHeadStyle: {
flexDirection: 'row',
paddingBottom: 25,
},
inputboxContainer:{
color: AppStyle.inputBlackcolorText,
paddingLeft: 20,
borderColor:'#E8E6EA',
borderWidth:1,
borderRadius:16,
height:55,
marginBottom:22,
},
selectboxNwContainer:{
color: AppStyle.inputBlackcolorText,
paddingLeft: 20,
fontFamily: 'Abel',
borderWidth:1,
borderColor:'#E8E6EA',
borderRadius:16,
height:55,
marginBottom:22
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
height:25,
fontFamily: 'Abel',
color:'rgba(0, 0, 0, 0.4)',
fontSize:17
},
SectionEntiLabel:{
position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
backgroundColor:'#fff',
paddingLeft:10,
paddingRight:10,
width:95,
height:25,

fontFamily: 'Abel',
color:'rgba(0, 0, 0, 0.4)',
fontSize:17
},
SectionSmallLabel:{
position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
backgroundColor:'#fff',
alignSelf: 'flex-start',
paddingLeft:10,
paddingRight:10,
width:85,
height:25,

color:'rgba(0, 0, 0, 0.4)',
fontFamily: 'Abel',
fontSize:17
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
  paddingTop:15,
  paddingBottom:15,
  paddingLeft:20,
  paddingRight:20
  },
SectionVSmallLabel:{
position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
backgroundColor:'#fff',
alignSelf: 'flex-start',
paddingLeft:10,
paddingRight:10,
width:65,
height:25,

fontFamily: 'Abel',
color:'rgba(0, 0, 0, 0.4)',
fontSize:17
},
SectionCitySmallLabel:{
position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
backgroundColor:'#fff',
alignSelf: 'flex-start',
paddingLeft:10,
paddingRight:10,
width:52,
height:25,

fontFamily: 'Abel',
color:'rgba(0, 0, 0, 0.4)',
fontSize:17
},
SectionHedText:{
fontSize:AppStyle.aapPageHeadingSize,
fontFamily: 'GlorySemiBold',
textTransform:'capitalize',
color: AppStyle.fontColor,
marginTop:10
},
buttonStyle: AppStyle.AppbuttonStyle,
buttonTextStyle: {
color: AppStyle.fontButtonColor,
fontFamily: 'GlorySemiBold',
    fontSize: AppStyle.buttonFontsize,
    textTransform:'capitalize'
},
inputStyle: {
height:58,
color: AppStyle.fontColor,
fontSize: 16,
position:'relative',
zIndex: 1, // works on io,
fontFamily: 'Abel',
textTransform:'capitalize'
},
selectStyle: {
height:58,
width:158,
color: AppStyle.fontColor,
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
