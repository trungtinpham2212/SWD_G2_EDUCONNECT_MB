import { COLORS, SIZES } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback } from "react-native";
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.mainContent}>
                    {/* <Text style={styles.infoLabel}>Lớp</Text> */}
                    <View style={[styles.infoValueContainer,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, },
                    ]}>
                        <Text style={[styles.infoValue, { color: theme.colors.onSurface, },]} >
                            Class: 10A1
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.outline,
                                    color: theme.colors.onSurface,
                                },
                            ]}
                            placeholder="Search by name..."
                            placeholderTextColor={theme.colors.onSurfaceVariant} // Tách ra khỏi style
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.listCard}>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} style={styles.cardImage} />
                                <View>
                                    <Text style={[styles.cardName, { color: theme.colors.primary }]}>Tabatha McDuffy</Text>
                                    <Text style={[styles.cardSubject, { color: theme.colors.onBackground }]}>19/06/2004</Text>
                                </View>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardContentItem}>
                                    <Text style={[styles.cardContentItemTextLeft, { color: theme.colors.onSurface }]}>Phone:</Text>
                                    <Text style={[styles.cardContentItemTextRight, { color: theme.colors.onBackground }]}>01234567890</Text>
                                </View>
                                <View style={styles.cardContentItem}>
                                    <Text style={[styles.cardContentItemTextLeft, { color: theme.colors.onSurface }]}>Parent Name:</Text>
                                    <Text style={[styles.cardContentItemTextRight, { color: theme.colors.onBackground }]}
                                      numberOfLines={1}   ellipsizeMode="tail"
                                    >Nock sssjj adsbfhasdbjsdjkfasdjk sdahfhasdhds</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
        marginBottom: 10
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    cardName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.MAIN_APP_COLOR
    },
    cardSubject: {
        fontSize: 16,
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
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
        width: 'auto'
    },
    cardContentItemTextRight: {
        fontSize: 16,
        color: '#666', 
        width: '60%'
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
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 10,
        marginBottom: 12,
    },
});

export default ClassStudentScreen;