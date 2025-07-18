import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Checkbox, useTheme, ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import { SIZES } from '@/constants';
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {MainStackParamList} from '@/types/navigation'; 
import { Student, teacherService, Activity,EvaluationStudentRequest, StudentToEvaluation } from '@/api'; 

type EvaluationRouteProp = RouteProp<MainStackParamList, 'Evaluation'>;
const windowHeight = Dimensions.get('window').height;
 
 
const EvaluationScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<EvaluationRouteProp>();
    const {classId, periodNo, nameClass, date, nameSubject} = route.params; 
    const theme = useTheme();
    const [searchText, setSearchText] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [checkedStudents, setCheckedStudents] = useState<{ [key: number]: boolean }>({});
    const [selectAll, setSelectAll] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const styles = createStyles(theme);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [numberOfStudents, setNumberOfStudents] = useState<number>(0);  
    const [evaluationStudent, setEvaluationStudent] = useState<EvaluationStudentRequest>();
    const [evaluationContent, setEvaluationContent] = useState('');
    const [sending, setSending] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const studentsRes = await teacherService.getStudentsByClassId(classId);
                if (studentsRes){
                    setStudents(studentsRes);
                    setNumberOfStudents(studentsRes.length);
                } 
            } catch (err) {}
            try {
                const activitiesRes = await teacherService.getActivities();
                if (activitiesRes) setActivities(activitiesRes);
            } catch (err) {}
            setLoading(false);
        };
        fetchData();
    }, [classId]);

    const handleSelectAll = () => {
        if (selectAll) {
            setCheckedStudents({});
        } else {
            const newCheckedStudents = students.reduce((acc, student) => {
                acc[student.studentid] = true;
                return acc;
            }, {} as { [key: number]: boolean });
            setCheckedStudents(newCheckedStudents);
        }
        setSelectAll(!selectAll);
    };

    const handleSendEvaluation = async () => {
        // Lấy danh sách học sinh được chọn
        const selectedStudentIds = Object.keys(checkedStudents).filter(
            (id) => checkedStudents[Number(id)]
        );
        // Tạo mảng students cho payload
        const studentsPayload = selectedStudentIds.map((id) => ({ studentid: id }));
        // Kiểm tra dữ liệu đầu vào
        if (!selectedActivity || studentsPayload.length === 0 ) {
            alert('Vui lòng chọn hoạt động');
            return;
        }
        let replacEvaluate = "";
        if(!evaluationContent){
            if (!activities) return;
            const activity = activities.find(a => a.activityid === Number(selectedActivity));
            replacEvaluate = activity ? activity.activitytype : "";
        }
        setSending(true);
        // Tạo payload
        const payload = {
            periodid: periodNo,
            content: (evaluationContent || replacEvaluate),
            activityid: Number(selectedActivity),
            students: studentsPayload,
        };
        try {
            const response = await teacherService.evaluationStudent(payload);
            if (response) {
                setSuccessModal(true);
            } else {
                alert('Gửi đánh giá thất bại!');
            }
        } catch (err) {
            alert('Có lỗi xảy ra khi gửi đánh giá!');
        } finally {
            setSending(false);
        }
    };

    const handleCheckboxToggle = (studentid: number) => {
        setCheckedStudents((prev) => ({
            ...prev,
            [studentid]: !prev[studentid],
        }));
    };

    const handleRemoveStudent = (studentid: number) => {
        setStudents((prev) => prev.filter((s) => s.studentid !== studentid));
        setCheckedStudents((prev) => {
            const newChecked = { ...prev };
            delete newChecked[studentid];
            return newChecked;
        });
    };

    function normalize(str: string) {
        return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    }
    const filteredStudents = students.filter((student) => normalize(student.name).includes(normalize(searchText)));

    return (
        <View style={styles.container}>
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Thông tin buổi học</Text>
                    <Text style={styles.modalText}>Tên lớp: {nameClass}</Text>
                    <Text style={styles.modalText}>Tiết: {periodNo}</Text>
                    <Text style={styles.modalText}>Sĩ số: {numberOfStudents}</Text>
                    <Text style={styles.modalText}>Ngày: {date}</Text>
                    <Text style={styles.modalText}>Môn học: {nameSubject}</Text>
                    <Button mode="contained" onPress={() => setModalVisible(false)} style={{marginTop: 16}}>
                        Đóng
                    </Button>
                </Modal>
                <Modal visible={successModal} onDismiss={() => setSuccessModal(false)} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Gửi đánh giá thành công!</Text>
                    <Button mode="contained" onPress={() => setSuccessModal(false)} style={{marginTop: 16}}>
                        Đóng
                    </Button>
                </Modal>
            </Portal>
            {loading ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
                </View>
            ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Button mode="outlined" onPress={() => setModalVisible(true)} style={styles.infoButton}>
                        Thông tin buổi học
                    </Button>
                </View>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name..."
                        placeholderTextColor={theme.colors.onSurface}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                <View style={styles.evaluateContainer}>
                    <Text style={styles.evaluateLabel}>Evaluate</Text>
                    <TextInput
                        style={styles.evaluateArea}
                        placeholder="Enter evaluation..."
                        placeholderTextColor={theme.colors.onSurface}
                        multiline
                        numberOfLines={4}
                        value={evaluationContent}
                        onChangeText={setEvaluationContent}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleSelectAll} style={styles.button} buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary}>
                        Select all
                    </Button>
                    <Button mode="contained" onPress={handleSendEvaluation} style={styles.button} buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary} disabled={sending}>
                        {sending ? <ActivityIndicator animating={true} color={theme.colors.onPrimary} size="small" /> : 'Send Evaluation'}
                    </Button>
                </View> 
                <View style={styles.activityAllContainer}>
                    <Text style={styles.activityAllLabel}>Activity:</Text>
                    <View style={[styles.pickerContainer, { flex: 1 }]}> 
                        <Picker
                            selectedValue={selectedActivity}
                            onValueChange={(value) => setSelectedActivity(value as string)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Activity" value="" />
                            {activities.map((activity, idx) => (
                                <Picker.Item 
                                    key={activity.activityid} 
                                    label={activity.activitytype ? activity.activitytype.toString() : activity.activityid.toString()} 
                                    value={activity.activityid.toString()} 
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={styles.studentList}>
                    <Text style={styles.activityAllLabel}>List Students:</Text>
                    {filteredStudents.map((student) => (
                        <View key={student.studentid} style={styles.studentItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.studentCheckbox}>
                                    <Checkbox
                                        status={checkedStudents[student.studentid] ? 'checked' : 'unchecked'}
                                        onPress={() => handleCheckboxToggle(student.studentid)}
                                        color={theme.colors.primary}
                                    />
                                </View>
                                <Text style={styles.studentName}>{student.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            )}
        </View>
    )
};

function createStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
            backgroundColor: theme.colors.background,
            paddingTop:10,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        headerText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.onBackground,
        },
        searchContainer: {
            marginBottom: 10,
        },
        searchInput: {
            borderWidth: 1,
            borderColor: theme.colors.onSurface,
            borderRadius: 5,
            fontSize: 16,
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.surface,
        },
        evaluateContainer: {
            marginBottom: 10,
        },
        evaluateLabel: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.onBackground,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        button: {
            flex: 1,
            marginHorizontal: 5,
        },
        studentList: {
            // flex: 1,
        },
        studentItem: {
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderWidth: 1,
            borderColor: theme.colors.onSurface,
            borderRadius: 5,
            marginBottom: 10,
            backgroundColor: theme.colors.surface,
        },
        studentName: {
            fontSize: 16,
            color: theme.colors.onSurface,
        },
        pickerContainer: {
            borderWidth: 1,
            borderColor: theme.colors.onSurface,
            borderRadius: 5,
            backgroundColor: theme.colors.surface,
        },
        picker: {
            width: '100%',
            color: theme.colors.onSurface,
        },
        activityAllContainer: { 
            marginBottom: 10,
        },
        activityAllLabel: {
            fontSize: 16,
            fontWeight: 'bold',
            marginRight: 10,
            color: theme.colors.onBackground,
            marginBottom: 8
        },
        studentCheckbox: {
            marginLeft: 10,
        },
        evaluateArea: {
            borderWidth: 1,
            borderColor: theme.colors.onSurface,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal:10,
            fontSize: 16,
            backgroundColor: theme.colors.surface,
            color: theme.colors.onSurface,
            minHeight: 80,
            marginTop: 5,
            marginBottom: 10,
        },
        infoButton: {
            marginBottom: 10,
        },
        modalContainer: {
            backgroundColor: theme.colors.surface,
            padding: 24,
            margin: 24,
            borderRadius: 12,
            alignItems: 'center',
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 12,
            color: theme.colors.primary,
        },
        modalText: {
            fontSize: 16,
            marginBottom: 8,
            color: theme.colors.onSurface,
        },
    });
}

export default EvaluationScreen;