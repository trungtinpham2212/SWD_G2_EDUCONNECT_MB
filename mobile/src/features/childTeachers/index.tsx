import { parentService, Student, Teacher, TeachersOfStudentRequest } from "@/api";
import { COLORS, SIZES } from "@/constants";
import MainLayout from "@/layouts/MainLayout";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, Modal } from "react-native";
import { useTheme } from "react-native-paper";
import { useAuth } from '@/features/auth/context/AuthContext';


const ChildTeachersScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [listTeacher, setListTeacher] = useState<Teacher[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
 
    
    const { authState } = useAuth();
    const parentId = authState.user?.userId;

    const fetchTeacherOfStudent = async(classId : number, nextPage = 1, append = false ) => {
        if (!append && nextPage === 1) setLoading(true);
        try{
            const payload: TeachersOfStudentRequest = {
                classId,
                start: '2024-11-01',
                end: '2025-03-01',
                page: nextPage,
                pageSize,
            };
            const response = await parentService.getTeachersOfStudent(payload);
            if(response){
                setHasMore(response.pageNumber < response.totalPages);
                if (append) {
                    setListTeacher(prev => [...prev, ...response.items]);
                } else {
                    setListTeacher(response.items);
                }
                setPage(response.pageNumber);
            }

        }catch(error){
            console.error('Error fetching teachers:', error);
        } finally {
            if (!append && nextPage === 1) {
                setLoading(false);
                setInitialLoading(false);
            }
        }
    }

    useEffect(() => {
        const fetchStudents = async () => {
            if (!parentId) return;
            try {
                setLoadingStudents(true);
                const data = await parentService.getStudentsByParentId(parentId);
                setStudents(data);
                if (data.length > 0) {
                    const firstStudent = data[0];
                    const classId = Number(firstStudent.classid);
                    setSelectedClassId(classId);
                    setSelectedName(data[0].name);
                    await fetchTeacherOfStudent(classId, 1, false);
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
            setPage(1);
            setHasMore(true);
            await fetchTeacherOfStudent(selectedStudent.classid, 1, false);
        }  
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && selectedClassId) {
            setLoadingMore(true);
            fetchTeacherOfStudent(selectedClassId, page + 1, true).finally(() => setLoadingMore(false));
        }
    };

    const handleRefresh = () => {
        if (selectedClassId) {
            setRefreshing(true);
            setPage(1);
            setHasMore(true);
            fetchTeacherOfStudent(selectedClassId, 1, false).finally(() => setRefreshing(false));
        }
    };

    const handleTeacherPress = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTeacher(null);
    };


    const styles = useMemo(() => StyleSheet.create({
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
            borderColor: theme.colors.outline || '#ccc',
            borderRadius: 6,
            paddingHorizontal: 8,
            backgroundColor: theme.colors.background || '#f9f9f9',
            minWidth: 120,
            position: 'relative',
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
        listCard: {

        },
        card: {
            borderWidth: 1,
            borderColor: theme.colors.outline || '#ccc',
            borderRadius: 6,
            padding: 10,
            marginBottom: 10,
            backgroundColor: theme.colors.background || '#fff',
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
            color: theme.colors.primary || COLORS.MAIN_APP_COLOR
        },
        cardSubject: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant || '#666',
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
            color: theme.colors.onSurfaceVariant || '#666',
            fontWeight: 'bold',
            width: '20%'
        },
        cardContentItemTextRight: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant || '#666',
            width: '80%',
            paddingRight: 10
        },
        flatListContainer: {
            paddingBottom: 20,
        },
        loadingContainer: {
            alignItems: 'center',
            marginTop: 20,
        },
        noDataContainer: {
            alignItems: 'center',
            marginTop: 50,
        },
        noDataText: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant || '#666',
            textAlign: 'center',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: theme.colors.background || '#fff',
            borderRadius: 12,
            padding: 20,
            margin: 20,
            width: '90%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            gap: 15,
        },
        modalImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.primary || COLORS.MAIN_APP_COLOR,
            flex: 1,
        },
        modalCloseButton: {
            padding: 8,
        },
        modalInfoItem: {
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'flex-start',
        },
        modalInfoLabel: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.onSurfaceVariant || '#666',
            width: '30%',
            marginRight: 10,
        },
        modalInfoValue: {
            fontSize: 16,
            color: theme.colors.onSurface || '#333',
            flex: 1,
        },
    }), [theme]);

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
                            selectedValue={selectedName}
                            onValueChange={(value) => handleStudentChange(Number(value))}
                            style={{
                                color: theme.colors.onSurface,
                                backgroundColor: theme.colors.background,
                            }}
                            dropdownIconColor={theme.colors.primary}
                            itemStyle={{ color: theme.colors.onSurface }}
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
                    
                    {/* Loading indicator when fetching teachers */}
                    {initialLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : listTeacher.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>Không có giáo viên nào</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={listTeacher}
                            keyExtractor={(item) => item.teacherId?.toString() || Math.random().toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.card}
                                    onPress={() => handleTeacherPress(item)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardHeader}>
                                        <Image 
                                            source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} 
                                            style={styles.cardImage} 
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardName}>
                                                {item.fullName || 'Unknown Teacher'}
                                            </Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardSubject}>
                                                {item.subjectName || 'Unknown Subject'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardContentItem}>
                                            <Text style={styles.cardContentItemTextLeft}>Phone:</Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardContentItemTextRight}>
                                                {item.phoneNumber || 'N/A'}
                                            </Text>
                                        </View>
                                        <View style={styles.cardContentItem}>
                                            <Text style={styles.cardContentItemTextLeft}>Email:</Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.cardContentItemTextRight]}>
                                                {item.email || 'N/A'}   
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.2}
                            ListFooterComponent={loadingMore ? (
                                <View style={styles.loadingContainer}>
                                    <Text style={{ color: theme.colors.primary, margin: 10 }}>Đang tải thêm...</Text>
                                </View>
                            ) : null}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            showsVerticalScrollIndicator={true}
                            style={{ flex: 1 }}
                            contentContainerStyle={styles.flatListContainer}
                        />
                    )}

                    {/* Teacher Detail Modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={closeModal}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Image 
                                        source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} 
                                        style={styles.modalImage} 
                                    />
                                    <Text style={styles.modalTitle}>
                                        {selectedTeacher?.fullName || 'Unknown Teacher'}
                                    </Text>
                                    <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                                        <Ionicons name="close" size={24} color={theme.colors.onSurface} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalInfoItem}>
                                    <Text style={styles.modalInfoLabel}>Subject:</Text>
                                    <Text style={styles.modalInfoValue}>
                                        {selectedTeacher?.subjectName || 'N/A'}
                                    </Text>
                                </View>

                                <View style={styles.modalInfoItem}>
                                    <Text style={styles.modalInfoLabel}>Phone:</Text>
                                    <Text style={styles.modalInfoValue}>
                                        {selectedTeacher?.phoneNumber || 'N/A'}
                                    </Text>
                                </View>

                                <View style={styles.modalInfoItem}>
                                    <Text style={styles.modalInfoLabel}>Email:</Text>
                                    <Text style={styles.modalInfoValue}>
                                        {selectedTeacher?.email || 'N/A'}
                                    </Text>
                                </View> 
                            </View>
                        </View>
                    </Modal>
                </View>
            </View> 
    )
}

export default ChildTeachersScreen;