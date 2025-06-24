import { COLORS, SIZES } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TextInput } from "react-native";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const ClassStudentScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [selectedStudent, setSelectedStudent] = useState('Hoang DB');
    const [name, setName] = useState('');
    const [debouncedName, setDebouncedName] = useState(name);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedName(name);
      }, 500); // 500ms debounce
 
      return () => {
        clearTimeout(handler);
      };
    }, [name]);
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.mainContent}>
                {/* <Text style={styles.infoLabel}>Lớp</Text> */}
                <View style={styles.infoValueContainer}>
                    <Text style={styles.infoValue}>Class: 10A1</Text>
                </View>
                <View>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            marginBottom: 12,
                            // height: 40,
                            backgroundColor: "#fff"
                        }}
                        placeholder="Search by name..."
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.listCard}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} style={styles.cardImage} />
                            <View>
                                <Text style={styles.cardName}>Tabatha McDuffy</Text>
                                <Text style={styles.cardSubject}>19/06/2004</Text>
                            </View>
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.cardContentItem}>
                                <Text style={styles.cardContentItemTextLeft}>Phone:</Text>
                                <Text style={styles.cardContentItemTextRight}>01234567890</Text>
                            </View>
                            <View style={styles.cardContentItem}>
                                <Text style={styles.cardContentItemTextLeft}>Parent Name:</Text>
                                <Text style={styles.cardContentItemTextRight}>Nock</Text>
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
                                <Text style={styles.cardContentItemTextLeft}>Parent Name:</Text>
                                <Text style={styles.cardContentItemTextRight}>tabatha@gmail.com sdafasd sdfasd</Text>
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
                                <Text style={styles.cardContentItemTextLeft}>Parent Name:</Text>
                                <Text style={styles.cardContentItemTextRight}>tabatha@gmail.com sdafasd sdfasd</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
};


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
        // overflow: 'hidden',
    },
    cardContentItemTextLeft: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
        width: 'auto'
    },
    cardContentItemTextRight: {
        fontSize: 14,
        color: '#666',
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    infoValueContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 10,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2C3E50',
    },
});

export default ClassStudentScreen;