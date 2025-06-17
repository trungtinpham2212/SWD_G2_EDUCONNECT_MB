import { SIZES } from "@/constants";
import MainLayout from "@/layouts/MainLayout";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

const ChildTeachersScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [selectedStudent, setSelectedStudent] = useState('Hoang DB');



    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Teacher Information</Text>

                </View>
                <View style={styles.mainContent}>
                <View style={styles.dropdownRow}>
                    <Picker
                        selectedValue={selectedStudent}
                        onValueChange={(itemValue) => setSelectedStudent(itemValue)}

                    >
                        <Picker.Item label="Hoang DB" value="Hoang DB" />
                        <Picker.Item label="Nguyen Van A" value="Nguyen Van A" /> 
                    </Picker>
                </View>
            </View>
            </View>
             
        </MainLayout>
    )
}

export default ChildTeachersScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    headerButton: {
        padding: 8,
        minWidth: 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
        marginTop: 20,
    },
    dropdownRow: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 8,
        backgroundColor: '#f9f9f9',
        minWidth: 120,
    },
});