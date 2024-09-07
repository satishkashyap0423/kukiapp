import * as Font from "expo-font";
 
export default useFonts = async () =>
  await Font.loadAsync({
    Abel: require('../../../assets/fonts/Abel-Regular.ttf'),
  });