import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SIZES } from '@/constants';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Period, Student, parentService,StudentFilterRequest, StudentQueryParam, PeriodQueryparam } from '@/api';

const { width } = Dimensions.get('window');

const ParentScheduleScreen: FC = () => {
    const theme = useTheme();
    // const [currentDate] = useState(moment());
    const [selectedDate, setSelectedDate] = useState(moment());
    const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));

    const [students, setStudents] = useState<Student[]>([]);
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [schedule, setSchedule] = useState<Period[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [initialScheduleLoading, setInitialScheduleLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { authState } = useAuth();
    const parentId = authState.user?.userId;


    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = moment(currentWeek).add(i, 'days');
            return {
                day: date.format('ddd'),
                date: date.format('DD'),
                fullDate: date,
                isToday: date.isSame(moment(), 'day'),
                isSelected: date.isSame(selectedDate, 'day'),
            };
        });
    }, [currentWeek, selectedDate]);

    const goToPreviousWeek = () => {
        const newWeek = moment(currentWeek).subtract(1, 'week');
        setCurrentWeek(newWeek);
        // Reset selected date to first day of new week
        setSelectedDate(newWeek);
    };

    const goToNextWeek = () => {
        const newWeek = moment(currentWeek).add(1, 'week');
        setCurrentWeek(newWeek);
        // Reset selected date to first day of new week
        setSelectedDate(newWeek);
    }; 

    const renderDayItem = ({ item, index }: { item: any, index: number }) => (
        <TouchableOpacity
            style={[
                styles.dayContainer,
                item.isToday && styles.todayContainer,
                item.isSelected && !item.isToday && styles.selectedContainer
            ]}
            onPress={() => setSelectedDate(item.fullDate)}
        >
            <Text style={[
                styles.dayText,
                (item.isToday || item.isSelected) && styles.todayText
            ]}>{item.day}</Text>
            <Text style={styles.dayText}>{item.date}</Text>
        </TouchableOpacity>
    );

    const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(false);

        if (event.type === 'set' && date) {
            const selectedMoment = moment(date);
            setSelectedDate(selectedMoment);
            setCurrentWeek(selectedMoment.clone().startOf('isoWeek'));
        }
    };

    const fetchScheduleForClass = async (classId: number, date: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const payload: PeriodQueryparam = {
                date,
                classId: classId,
                page: 1,
                pageSize:30,
            }; 
            const schedule = await parentService.getStudentSchedule(payload);
            if(schedule){
                setSchedule(schedule.items);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setError('Failed to fetch schedule');
            setSchedule([]);
        } finally {
            setLoading(false);
            setInitialScheduleLoading(false);
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            if (!parentId) return;
            try {
                setLoadingStudents(true);
                const payload: StudentQueryParam={
                    parentId,
                    page:1,
                    pageSize: 30
                }
                const data = await parentService.getStudentsByParentId(payload);
                setStudents(data);
                if (data.length > 0) {
                    const firstStudent = data[0];
                    const classId = Number(firstStudent.classid);
                    setSelectedClassId(classId);
                    setSelectedName(data[0].name);

                    await fetchScheduleForClass(classId, selectedDate.format('YYYY-MM-DD'));
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchStudents();
    }, [parentId]);

    const handleStudentChange = async (studentId: number) => {
        
        const selectedStudent = students.find(s => Number(s.studentid) === studentId);
        if(selectedStudent){
            setSelectedClassId(selectedStudent.classid);
            setSelectedName(selectedStudent.name);
            await fetchScheduleForClass(selectedStudent.classid, selectedDate.format('YYYY-MM-DD'));
        }  
    };

    useEffect(() => {
        if (selectedClassId && selectedDate) {
            fetchScheduleForClass(selectedClassId, selectedDate.format('YYYY-MM-DD'));
        }
    }, [selectedDate]);

    const styles = useMemo(() => StyleSheet.create({
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
            borderBottomColor: theme.colors.outline || '#E8E8E8',
        },
        welcomeText: {
            fontSize: 22,
            fontWeight: '500',
        },
        mainContent: {
            flex: 1,
            marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
            marginTop: 20,
        },
        infoContainer: {
            marginBottom: 15,
            display: 'none'
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
        },
        infoItem: {
            flex: 1,
        },
        infoLabel: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8,
            color: theme.colors.onSurface || '#333',
        },
        infoValueContainer: {
            backgroundColor: theme.colors.background || '#FFFFFF',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.outline || '#E8E8E8',
            padding: 12,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        infoValue: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.onSurface || '#2C3E50',
        },
        pickerContainer: {
            marginBottom: 20,
        },
        pickerLabel: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8,
            color: theme.colors.onSurface || '#333',
        },
        pickerWrapper: {
            backgroundColor: theme.colors.background || '#FFFFFF',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.outline || '#E8E8E8',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        picker: {
            height: 'auto',
            width: '100%',
            color: theme.colors.onSurface || '#2C3E50',
        },
        pickerLoadingContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
        },
        weekContainer: {
            paddingVertical: 0,
        },
        dayContainer: {
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingVertical: 5,
            borderRadius: 8,
            width: width * 0.25,
            backgroundColor: theme.colors.background || '#FFFFFF',
            borderWidth: 1,
            borderColor: theme.colors.outline || '#E8E8E8',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        todayContainer: {
            backgroundColor: theme.colors.primary || '#3498DB',
            borderColor: theme.colors.primary || '#3498DB',
        },
        selectedContainer: {
            backgroundColor: theme.colors.secondary || '#2ECC71',
            borderColor: theme.colors.secondary || '#2ECC71',
        },
        dayText: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.onSurface || '#2C3E50',
        },
        todayText: {
            color: theme.colors.onPrimary || '#FFFFFF',
        },
        scheduleContainer: {
            flex: 1,
            backgroundColor: theme.colors.background || '#FFFFFF',
            borderRadius: 12,
            padding: 15,
            marginTop: 20,
            borderWidth: 1,
            borderColor: theme.colors.outline || '#E8E8E8',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        scheduleFlatList: {
            flex: 1,
        },
        scheduleList: {
            paddingBottom: 10,
        },
        scheduleItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outline || '#E8E8E8',
        },
        timeText: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant || '#7F8C8D',
        },
        subjectText: {
            fontSize: 17,
            fontWeight: '500',
            color: theme.colors.onSurface || '#2C3E50',
        },
        subjectTextSecondary: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant || '#7F8C8D',
        },
        scheduleTitle: {
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 15,
            color: theme.colors.onSurface || '#2C3E50',
        },
        weekNavigationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10, 
        },
        navButton: {
            height: 50,
            borderRadius: 20,
            backgroundColor: theme.colors.primary || '#3498DB',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            paddingHorizontal:20,
        },
        navButtonText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.onPrimary || '#FFFFFF',
        },
        containBtnChangeDate: {
            flexDirection: 'row',
            marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
            justifyContent: 'space-between'
        },
        periodText: {
            fontSize: 20,
            fontWeight: '700',
        },
        errorText: {
            fontSize: 16,
            textAlign: 'center',
            marginTop: 20,
        },
        noDataText: {
            fontSize: 16,
            textAlign: 'center',
            marginTop: 20,
        },
        imgNodata: {
            width: '100%',
            height: 300
        },
    }), [theme]);

    const RenderScheduleItem = memo(({ item }: { item: Period }) => {
        const formatTime = (periodDate: string) => {
            if (!periodDate) return 'N/A';
            const startTime = moment(periodDate).format('HH:mm');
            const endTime = moment(periodDate).add(45, 'minutes').format('HH:mm');
            return `${startTime} - ${endTime}`;
        };
        return (
            <TouchableOpacity>
                <View style={styles.scheduleItem}>
                    <View style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.periodText, { color: theme.colors.onSurface }]}>
                            {item.periodno}
                        </Text>
                        <Text style={[styles.timeText, { color: theme.colors.primary }]}>
                            {formatTime(item.perioddate)}
                        </Text>
                    </View>
                    <View style={{ width: '60%' }}>
                        <Text style={styles.subjectText}>{item.subjectName}</Text>
                        <Text style={styles.subjectTextSecondary}>{item.teacherName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            {/* <View style={styles.header}>
                    <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
                        Time Table
                    </Text>
                </View> */}
            <View style={styles.mainContent}>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            {/* <Text style={styles.infoLabel}>Lớp</Text> */}
                            <View style={styles.infoValueContainer}>
                                <Text style={styles.infoValue}>Class: 10A1</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.pickerContainer}>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedName}
                            onValueChange={(value) => handleStudentChange(Number(value))}
                            style={styles.picker}
                            dropdownIconColor="#666"
                            enabled={!loadingStudents}
                        >
                            {loadingStudents ? (
                                <Picker.Item label="Loading students..." value="" />
                            ) : students.length === 0 ? (
                                <Picker.Item label="No students available" value="" />
                            ) : (
                                students.map((student) => (
                                    <Picker.Item key={student.studentid} label={student.name} value={student.studentid} />
                                ))
                            )}
                        </Picker>
                        {loadingStudents && (
                            <View style={styles.pickerLoadingContainer}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        )}
                    </View>
                </View>

                <View style={{ marginHorizontal: SIZES.DISTANCE_MAIN_NEGATIVE }}>
                    <View>
                        {showDatePicker && (
                            <DateTimePicker
                                mode="date"
                                value={selectedDate.toDate()}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onDateChange}
                            />
                        )}
                    </View>
                    <View style={styles.containBtnChangeDate}>
                        <TouchableOpacity
                            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
                            onPress={goToPreviousWeek}
                        >
                            <MaterialIcons name="keyboard-arrow-left" size={24} color="#fff" style={{ paddingHorizontal: 4 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}  >
                            <View style={[styles.infoValueContainer]}>
                                <Text style={[styles.infoValue, { textAlign: 'center' }]}>
                                    {selectedDate.format('YYYY-MM-DD')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
                            onPress={goToNextWeek}
                        >
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="#fff" style={{ paddingHorizontal: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.weekNavigationContainer}>

                        <FlatList
                            data={weekDates}
                            renderItem={renderDayItem}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.weekContainer}
                            snapToInterval={width * 0.25}
                            ItemSeparatorComponent={() => <TouchableOpacity style={{ width: 10 }} />}
                            ListHeaderComponent={<View style={{ width: SIZES.DISTANCE_MAIN_POSITIVE}} />}
                            ListFooterComponent={<View style={{ width: SIZES.DISTANCE_MAIN_POSITIVE }} />} 
                        />


                    </View>
                </View>

                {/* Today's Schedule */}
                <View style={styles.scheduleContainer}>
                    <Text style={[styles.scheduleTitle, { color: theme.colors.onSurface }]}>
                        Schedule for {selectedDate.format('dddd, MMMM D')}
                    </Text>
                    {initialScheduleLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                    ) : loading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                    ) : error ? (
                        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
                    ) : schedule.length === 0 ? (
                        <View>
                            <Image style={styles.imgNodata} source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/woman-with-no-appointment-illustration-download-in-svg-png-gif-file-formats--waiting-issue-empty-state-pack-people-illustrations-10922122.png' }} />
                            <Text style={[styles.noDataText, { color: theme.colors.onSurface }]}>
                                No schedule available
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={schedule}
                            renderItem={({ item }) => <RenderScheduleItem item={item} />}
                            keyExtractor={(item) => item.periodid?.toString() || Math.random().toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scheduleList}
                            style={styles.scheduleFlatList}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

export default ParentScheduleScreen;