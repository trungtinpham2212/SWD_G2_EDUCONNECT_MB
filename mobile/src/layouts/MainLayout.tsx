import { ReactNode, useCallback } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackBase, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';  

type MainLayoutProps = {
    children: React.ReactNode;
    // loading?: boolean;
    // backgroundColor?: string;
    // isLight?: boolean;
};

const MainLayout = ({ children}: MainLayoutProps) => {
    // useFocusEffect(
    //     useCallback(() => {
    //         StatusBar.setBarStyle(isLight ? 'light-content' : 'dark-content');
    //         StatusBar.setBackgroundColor(backgroundColor || '#000');
    //     }, [isLight, backgroundColor])
    // );

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={[styles.safeArea, { flex: 1 }]}>
                    <View>
                        {/* content */}
                        {children} 

                        {/* {loading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#ffc500" />
                            </View>
                        )} */}
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </>
    )
}
export default MainLayout;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1 
    },
    container: {
        flex: 1,
        // position: 'relative', 
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)', // mờ nền khi loading
        justifyContent: 'center',
        alignItems: 'center',
    },
});