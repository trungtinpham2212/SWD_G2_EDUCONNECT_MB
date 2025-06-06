import { StyleSheet } from "react-native";

export const FONTS = {
  OPENSANS_REGULAR: 'OpenSans-Regular',
  OPENSANS_BOLD: 'OpenSans-Italic', 
};

export const globalStyles = StyleSheet.create({
    appFont : {
        fontFamily : FONTS.OPENSANS_REGULAR
    }
})