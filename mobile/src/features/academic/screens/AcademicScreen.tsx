import React, { FC, ReactNode } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MainLayout from '@/layouts/MainLayout';
import { SIZES } from '@/constants';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth - screenWidth * 9 / 100;

type ItemMainNavigation = {
    id: number;
    title: string;
    icon: ReactNode;
};

const AcademicScreen: FC = () => {
    const theme = useTheme();
    
    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.header}>
                    <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
                        Academic
                    </Text>
                </View>
                {/* Main Content */}
                <View style={styles.mainContent}>
                    <View style={styles.row}>
                        <View style={styles.containBtnNavigation}> 
                            <Pressable
                                onPress={() => alert("Timetable")}
                                style={({ pressed }) => [
                                    styles.button,
                                    {
                                        backgroundColor: pressed ? theme.colors.secondary : theme.colors.primary,
                                    },
                                ]}
                            >
                                <MaterialCommunityIcons name="timetable" size={40} color={theme.colors.background} />
                                <Text style={[styles.text, { color: theme.colors.onPrimary }]}>Timetable</Text>
                            </Pressable>
                        </View>
                        <View style={styles.containBtnNavigation}>
                            <Pressable
                                onPress={() => alert("Exam Schedule")}
                                style={({ pressed }) => [
                                    styles.button,
                                    {
                                        backgroundColor: pressed ? theme.colors.secondary : theme.colors.primary,
                                    },
                                ]}
                            >
                                <Entypo name="text-document" size={40} color={theme.colors.background} />
                                <Text style={[styles.text, { color: theme.colors.onPrimary }]}>Exam Schedule</Text>
                            </Pressable>
                        </View>
                        <View style={styles.containBtnNavigation}>
                            <Pressable
                                onPress={() => alert("Report")}
                                style={({ pressed }) => [
                                    styles.button,
                                    {
                                        backgroundColor: pressed ? theme.colors.secondary : theme.colors.primary,
                                    },
                                ]}
                            >
                                <Octicons name="repo" size={40} color={theme.colors.background} />
                                <Text style={[styles.text, { color: theme.colors.onPrimary }]}>Report</Text>

                            </Pressable>
                        </View>

                        <View style={styles.containBtnNavigation}>
                            <Pressable
                                onPress={() => alert("Teacher Information")}
                                style={({ pressed }) => [
                                    styles.button,
                                    {
                                        backgroundColor: pressed ? theme.colors.secondary : theme.colors.primary,
                                    },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name="folder-information-outline"
                                    size={40}
                                    color={theme.colors.background}
                                />
                                <Text style={[styles.text, { color: theme.colors.onPrimary }]}>Teacher Information</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#a1a1a1',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '500',
    },
    mainContent: {
        marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
    },
    row: {
        marginTop: 8,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    containBtnNavigation: {
        padding: 4,
        width: (screenWidth - 30) / 2,
    },
    button: {
        height: itemWidth - 15,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

export default AcademicScreen;