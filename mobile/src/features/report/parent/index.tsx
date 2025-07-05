import MainLayout from '@/layouts/MainLayout';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import { SIZES } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { parentService, Student, PagedStudentReportResponse, Report, StudentReportQueryRequest } from '@/api';
import { useAuth } from '@/features/auth/context/AuthContext';
import SplashScreen from '@/features/splash/SplashScreen';  
import moment from 'moment';
// import DateRangeSelector from '@/features/report/parent/components/DateRangeSelector';
 
const ParentReportScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    const [students, setStudents] = useState<Student[]>([]);
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null); 
    const [loadingStudents, setLoadingStudents] = useState(false);

    const [listReport, setListReport] = useState<Report[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialReportLoading, setInitialReportLoading] = useState(true);

    const { authState } = useAuth();
    const parentId = authState.user?.userId; 

    const styles = React.useMemo(() => StyleSheet.create({
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
            color: theme.colors.onSurface,
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
            color: theme.colors.onSurface,
        },
        dropdownRow: {
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.colors.outline || '#ccc',
            borderRadius: 6,
            paddingHorizontal: 8,
            backgroundColor: theme.colors.background || '#fff',
            minWidth: 120,
        },
        card: {
            backgroundColor: theme.colors.background || '#fff',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: theme.colors.outline || '#eee',
        },
        cardLabel: {
            fontWeight: 'bold',
            marginTop: 4,
            marginBottom: 2,
            color: theme.colors.primary,
        },
        cardContent: {
            color: theme.colors.onSurface,
            fontSize: 15,
        },
        cardTime: {
            color: theme.colors.onSurfaceVariant || '#888',
            fontSize: 13,
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
    }), [theme]);

    const fetchReportStudent = async (studentId: number, nextPage = 1, append = false) => {
        if (!append && nextPage === 1) setLoading(true);
        try {
            const payload: StudentReportQueryRequest = {
                studentId,
                page: nextPage,
                pageSize
            };
            const response = await parentService.getStudentReports(payload);
            if (response) {
                setHasMore(response.pageNumber < response.totalPages);
                if (append) {
                    setListReport(prev => [...prev, ...response.items]);
                } else {
                    setListReport(response.items);
                }
                setPage(response.pageNumber);
            }
        } catch (err) {
            // handle error
        } finally {
            if (!append && nextPage === 1) {
                setLoading(false);
                setInitialReportLoading(false);
            }
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            if (!parentId) return;
            try {
                setLoadingStudents(true);
                const data = await parentService.getStudentsByParentId(parentId);
                setStudents(data);
                if (data.length > 0) {
                    const firstStudent = data[0];
                    const studentId = Number(firstStudent.studentid);
                    setSelectedStudentId(studentId);
                    setSelectedName(data[0].name);
                    setPage(1);
                    setHasMore(true);
                    fetchReportStudent(studentId, 1, false);
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
        if (selectedStudent) {
            setSelectedStudentId(studentId);
            setSelectedName(selectedStudent.name);
            setPage(1);
            setHasMore(true);
            fetchReportStudent(studentId, 1, false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && selectedStudentId) {
            setLoadingMore(true);
            fetchReportStudent(selectedStudentId, page + 1, true).finally(() => setLoadingMore(false));
        }
    };

    const handleRefresh = () => {
        if (selectedStudentId) {
            setRefreshing(true);
            setPage(1);
            setHasMore(true);
            fetchReportStudent(selectedStudentId, 1, false).finally(() => setRefreshing(false));
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>   
            <View style={styles.mainContent}>
                {/* <DateRangeSelector /> */}

                {/* Dropdown chọn học sinh */}
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
                {/* Loading indicator when fetching reports */}
                {initialReportLoading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 24 }} />
                ) : loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 24 }} />
                ) : listReport.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 32 }}>
                        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16 }}>Không có báo cáo nào</Text>
                    </View>
                ) : null}
                {/* Danh sách báo cáo */}
                {!initialReportLoading && !loading && listReport.length > 0 && (
                    <FlatList
                        data={listReport}
                        keyExtractor={item => item.reportstudentid.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.cardLabel}>Nội dung:</Text>
                                <Text style={styles.cardContent}>{item.content}</Text>
                                <Text style={styles.cardLabel}>Thời gian tạo:</Text>
                                <Text style={styles.cardTime}>{moment(item.createat).format('DD/MM/YYYY HH:mm')}</Text>
                            </View>
                        )}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={loadingMore ? <Text style={{textAlign:'center', color: theme.colors.primary, margin: 10}}>Đang tải thêm...</Text> : null}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                )}
            </View>
        </View>
    );
}
export default ParentReportScreen;