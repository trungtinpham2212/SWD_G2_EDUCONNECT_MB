import MainLayout from '@/layouts/MainLayout';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import { SIZES } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { parentService, Student } from '@/api';
import { useAuth } from '@/features/auth/context/AuthContext';
import SplashScreen from '@/features/splash/SplashScreen'; 
import { useSplashDelay } from '@/features/splash/hooks/useSplashDelay';
// import DateRangeSelector from '@/features/report/parent/components/DateRangeSelector';


const reports = [
    {
        id: 1,
        content: 'Em học tập tích cực và chăm chỉ, cần tiến bộ thêm nữa.',
        time: '2024-12-01 08:30:00',
    },
    {
        id: 2,
        content: 'Em học tập tích cực và chăm chỉ, cần tiến bộ thêm nữa.',
        time: '2024-12-01 08:30:00',
    },
];

const ParentReportScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    const [students, setStudents] = useState<Student[]>([]);
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null); 

    const { authState } = useAuth();
    const parentId = authState.user?.userId;

  

    useEffect(() => {
        const fetchStudents = async () => {
            if (!parentId) return;
            try {
                const data = await parentService.getStudentsByParentId(parentId);
                setStudents(data);
                if (data.length > 0) {
                    const firstStudent = data[0];
                    const classId = Number(firstStudent.classid);
                    setSelectedClassId(classId);
                    setSelectedName(data[0].name);

                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }finally{ 
            }
        };

        fetchStudents();
    }, [parentId]);

    const handleStudentChange = async (studentId: number) => {

        const selectedStudent = students.find(s => Number(s.studentid) === studentId);
        if (selectedStudent) {
            setSelectedClassId(selectedStudent.classid);
            setSelectedName(selectedStudent.name);
            // await fetchScheduleForClass(selectedStudent.classid, selectedDate.format('YYYY-MM-DD'));
        }
    };

    const firstRun = useSplashDelay(3000);   

    if (firstRun) {
        return <SplashScreen loading={true} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
           
            <View style={styles.mainContent}>
                {/* <DateRangeSelector /> */}

                {/* Dropdown chọn học sinh */}
                <View style={styles.dropdownRow}>
                    <Picker
                        selectedValue={selectedName}
                        onValueChange={(value) => handleStudentChange(Number(value))}

                    >
                        {students.map((student) => (
                            <Picker.Item key={student.studentid} label={student.name} value={student.studentid} />
                        ))}
                    </Picker>
                </View>

                {/* Danh sách báo cáo */}
                <FlatList
                    data={reports}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Content:</Text>
                            <Text>{item.content}</Text>
                            <Text style={styles.cardLabel}>Time:</Text>
                            <Text>{item.time}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
export default ParentReportScreen;

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
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cardLabel: {
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 2,
    },
});