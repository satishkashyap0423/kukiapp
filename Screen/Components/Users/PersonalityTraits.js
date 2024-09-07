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
FlatList,
SafeAreaView,
Image,
Keyboard,
TouchableOpacity,
Alert,
TouchableHighlight,
KeyboardAvoidingView,
Modal
} from 'react-native';
import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import Api from '../../Constants/Api.js';
import Loader from '../../Components/Loader';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import ProgressBar from '../Common/ProgressBar';


class PersonalityTraits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCommValue:'Business and Entrepreneurship',
      selectedItems : [],
      selectedLetterText:[],
      selectedLetter:[],
      userSignupDataObj:{},
      loading:false,
      errMsg:'Error',
      ishowMOdal:false,
      modalVisible:false
    };
  }

  closeBlockModal(){
  
    this.setState({ modalVisible:false});   
  }

   openStatusModal() { 
    
    if(this.state.selectedLetter.length < 5){
      this.setState({errMsg:AlertMessages.traitsErr});
      this.setState({ishowMOdal:true});
      return;
    }
    this.setState({modalVisible:true});
  }


  getPrfessionalList = async () => {
    this.state.loading = true;
    let data = JSON.stringify({
    category_id: 1,
      itemsData: {}
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
    axios.get(Api.apiUrl+'/get-personality-trait', data, headers)
    .then(res => {
      this.state.loading = false;
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
  createAlert = (FirstName) =>
  Alert.alert(
    "Required",
    FirstName,
    [
    { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
  
  getListViewItem = (item) => {  
    /*Alert.alert(item.key);*/
    item.isSelect = !item.isSelect;
    item.selectedClass = item.isSelect?
    styles.selecttedFlatitem: styles.flatMainsection;
    this.setState({
    itemsData: this.state.itemsData
    });
    this.state.selectedLetter = [];
    this.state.selectedLetterText = [];
    for (var i = 0; i < this.state.itemsData.length; i++) {
      if(this.state.itemsData[i]['isSelect'] == true ){
       this.state.selectedLetter.push(this.state.itemsData[i]['id']); 
       this.state.selectedLetterText.push(this.state.itemsData[i]['name']); 
      }
    }
    console.log(this.state.selectedLetter);
    if(this.state.selectedLetter.length > 5){
      this.setState({errMsg:AlertMessages.traitsErr});
      this.setState({ishowMOdal:true});
      item.selectedClass = styles.flatMainsection;
      this.setState({
        itemsData: this.state.itemsData
      });
      item.isSelect = false;
      this.removePeople(item.id);
    }
    console.log('hello');
    console.log(this.state.selectedLetter);
    //console.log(this.state.selectedLetter.length); 
  }
  removePeople(e) {
    var array = this.state.selectedLetter; // make a separate copy of the array
    var index = array.indexOf(e);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({selectedLetter: array});
    }
  }  
  checkIndexIsEven (n) {
    return n % 2 == 0;
  }
  backScreen(){
    this.props.navigation.navigate('LanguagesScreen');
  }
  nextScreen(){
    this.props.navigation.navigate('UserstatusScreen');
  }
  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }
  render (){
  const { selectedItems,selectedLetter,itemsData,loading,errMsg,ishowMOdal,modalVisible} = this.state;
  const handleSubmitPress = () => {
 
  let preVvalue = this.state.userSignupDataObj;
  console.log(this.state.selectedLetter.toString());
  //return;
  preVvalue.traits_ids = this.state.selectedLetter.toString();
  AsyncStorage.setItem('userSignupData',JSON.stringify(preVvalue));
  this.setState({modalVisible:false});
  this.props.navigation.navigate('UserstatusScreen');
  };
return <View style={{flex:1,height:'100%',backgroundColor:'#fff'}}>
  <Loader loading={loading} />
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
      <ProgressBar step='5' />
      <View style={styles.SectionHeadStyle}>
         <Text style={styles.SectionHedText}>Personality Traits</Text>
      </View>
      <View style={styles.ContentHeadStyle}>
         <Text style={styles.SectionContText}>Select your 5 personality traits</Text>
      </View>
      <View style={styles.mainStection}>
         <FlatList  
         data={itemsData}
         numColumns={2}
         style={styles.flatlistStection}
         showsVerticalScrollIndicator={false}
         renderItem={({item, index, separators }) =>  
         <TouchableOpacity
         style={[item.selectedClass == 'flatMainsection' ? styles.flatMainsection : item.selectedClass,styles.flatMainsection,{marginBottom:10,marginRight:this.checkIndexIsEven(index) ? 10 : 5}]}
         onPress={() => this.getListViewItem(item)}
         >
         <Image
         source={item.icon}
         style={{
         resizeMode: 'contain',
         height:16,
         }}
         />
         <Text style={styles.flatItems}  
            >{item.name}</Text>
         </TouchableOpacity>}  
         ItemSeparatorComponent={this.renderSeparator}  
         />
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
              <Text style = {styles.modalTitle}>{AlertMessages.filedTraitsMsg}</Text> 
              <Text style = {styles.modalTitle}>{this.state.selectedLetterText.join(', ')}</Text> 
              
             <Text style = {styles.modalTitle}>Click <Text style = {styles.modalCTitle}>Cancel</Text> to change.</Text> 

             <Text style = {styles.modalTitle}>Click on <Text style = {styles.modalCTitle}>Ok</Text> to continue.</Text> 
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
export default PersonalityTraits;
const styles = StyleSheet.create({
  mainBody: {
  flex:1,
  backgroundColor: AppStyle.appColor,
  paddingLeft: AppStyle.appLeftPadding,
  paddingRight: AppStyle.appRightPadding,
  paddingBottom: 25,
  paddingTop: 30,
  },
  flatlistStection:{
  height: '100%',
  paddingBottom:50,
  paddingTop:5,
  flexGrow: 0
  },
  ContentHeadStyle:{
  marginBottom:10
  },
  skipSection:{
  color:'rgba(253, 139, 48, 0.69)',
  fontSize:16
  },
  topheadSection:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  flexDirection:'row',
  marginBottom:15,
   marginTop:15
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
  SectionHeadStyle: {
  flexDirection: 'row',
  paddingBottom:15,
  paddingTop: 15,
  },
  mainStection:{
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
    flex: 1,
  },
  flatMainsection:{
  width:'48%',
  flexDirection:'row',
  paddingLeft:10,
  paddingRight:10,
  height:60,
  borderWidth:1,
  borderColor:'#E8E6EA',
  borderRadius:15,
  alignItems:'center',
  display:'flex',
  justifyContent:'center',
  },
  selecttedFlatitem:{
  backgroundColor:'#F3F3F3',
  width:'48%',
  flexDirection:'row',
  paddingLeft:10,
  paddingRight:10,
  height:45,
  borderRadius:15,
  alignItems:'center',
  display:'flex'
  },
  flatItems:{
  paddingLeft:10,
  fontFamily:'Abel',
  fontSize:16,
  color: AppStyle.fontColor,
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
  width:'100%',
  paddingLeft: AppStyle.appLeftPadding,
  paddingRight: AppStyle.appRightPadding,
  backgroundColor:'#fff',
  paddingTop:10,
  paddingTop:18,
  },
  buttonStyle: {
  borderWidth: 0,
  color: '#FFFFFF',
  borderColor: '#dadae8',
  alignItems: 'center',
  borderRadius: 15,
  paddingTop:AppStyle.buttonTBPadding,
  paddingBottom:AppStyle.buttonTBPadding,
  marginBottom: 10,
  width:'100%',
  marginBottom:20
  },
  buttonTextStyle: {
  color: AppStyle.fontButtonColor,
  fontSize:16,
  fontSize: AppStyle.buttonFontsize,
  fontFamily: 'GlorySemiBold',
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
