import { COLORS, SIZES } from "@/constants";
import MainLayout from "@/layouts/MainLayout";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "react-native-paper";

const ChildTeachersScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [selectedStudent, setSelectedStudent] = useState('Hoang DB');



    return ( 
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                {/* <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Teacher Information</Text>

                </View> */}
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
                    <View style={styles.listCard}>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} style={styles.cardImage} />
                                <View>
                                    <Text style={styles.cardName}>Tabatha McDuffy</Text>
                                    <Text style={styles.cardSubject}>Math</Text>
                                </View>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardContentItem}>
                                    <Text style={styles.cardContentItemTextLeft}>Phone:</Text>
                                    <Text style={styles.cardContentItemTextRight}>01234567890</Text>
                                </View>
                                <View style={styles.cardContentItem}>
                                    <Text style={styles.cardContentItemTextLeft}>Email:</Text>
                                    <Text style={styles.cardContentItemTextRight}>tabatha@gmail.com</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} style={styles.cardImage} />
                                <View>
                                    <Text style={styles.cardName}>Tabatha McDuffy</Text>
                                    <Text style={styles.cardSubject}>Math</Text>
                                </View>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardContentItem}>
                                    <Text style={styles.cardContentItemTextLeft}>Phone:</Text>
                                    <Text style={styles.cardContentItemTextRight}>01234567890</Text>
                                </View>
                                <View style={styles.cardContentItem}>
                                    <Text style={styles.cardContentItemTextLeft}>Email:</Text>
                                    <Text style={styles.cardContentItemTextRight}>tabatha@gmail.com</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} style={styles.cardImage} />
                                <View>
                                    <Text style={styles.cardName}>Tabatha McDuffy</Text>
                                    <Text style={styles.cardSubject}>Math</Text>
                                </View>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardContentItem}>
                                    <Text style={styles.cardContentItemTextLeft}>Phone:</Text>
                                    <Text style={styles.cardContentItemTextRight}>01234567890</Text>
                                </View>
                                <View style={styles.cardContentItem}>
                                    <Text style={styles.cardContentItemTextLeft}>Email:</Text>
                                    <Text style={styles.cardContentItemTextRight}>tabatha@gmail.com</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View> 
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
    listCard: {

    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardImage: {
        width: 60,
        height: 60,
    },
    cardName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.MAIN_APP_COLOR
    },
    cardSubject: {
        fontSize: 14,
        color: '#666',
    },
    cardContent: {

    },
    cardContentItem: {
        flexDirection: 'row', 
        alignItems: 'center',
        gap: 10,
        paddingVertical: 2,
    },
    cardContentItemTextLeft: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
        width: '20%'
    },
    cardContentItemTextRight: {
        fontSize: 14,
        color: '#666',
    },
});