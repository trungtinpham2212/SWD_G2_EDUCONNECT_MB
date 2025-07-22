import { COLORS, SIZES } from "@/constants";
import { useState, useEffect, memo, useCallback } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useAuth } from '@/features/auth/context/AuthContext';
import { Student, teacherService, StudentQueryParam } from "@/api";
import { FlatList } from "react-native";

const windowHeight = Dimensions.get('window').height;

const ClassStudentScreen: React.FC = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [className, setClassName] = useState<string>('');

    const { authState } = useAuth();
    const teacherId = authState.user?.teacherId!;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(40);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [initialStudentsLoading, setInitialStudentsLoading] = useState(true);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const fetchStudentbyTeacherId = useCallback(async (nextPage = 1, append = false, searchName = '') => {
        if (!append && nextPage === 1) setLoading(true);
        try {
            const payload: StudentQueryParam = {
                teacherId,
                page: nextPage,
                pageSize,
                name: searchName || undefined // Thêm name vào payload nếu có
            }
            
            const response = await teacherService.getStudentsByTeacherId(payload);
            if (response) {
                setHasMore(response.pageNumber < response.totalPages);
                if (append) {
                    setStudents(prev => [...prev, ...response.items]);
                } else {
                    setStudents(response.items);
                }
                setPage(response.pageNumber);
                
                // Set class name từ student đầu tiên nếu có
                if (response.items.length > 0 && !className) {
                    const firstStudent = response.items[0];
                    const newClassName = firstStudent?.class?.classname ?? 'Unknown Class';
                    setClassName(newClassName);
                }
            }
        } catch (err) {
            setError('Failed to load Student');
            console.error('Error fetching student:', err);
            setStudents([]);
        } finally {
            if (!append && nextPage === 1) {
                setLoading(false);
                setInitialStudentsLoading(false);
            }
        }
    }, [teacherId, pageSize, className]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        const timeout = setTimeout(() => {
            setPage(1);
            setHasMore(true);
            fetchStudentbyTeacherId(1, false, query);
        }, 500);
        
        setSearchTimeout(timeout);
    }, [fetchStudentbyTeacherId, searchTimeout]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            fetchStudentbyTeacherId(page + 1, true, searchQuery).finally(() => setLoadingMore(false));
        }
    };

    const handleRefresh = async () => {
        if (loading || initialStudentsLoading || !teacherId) return;
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        setStudents([]);
        try {
            await fetchStudentbyTeacherId(1, false, searchQuery);
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể làm mới danh sách học sinh. Vui lòng thử lại.');
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!teacherId) return;
        setPage(1);
        setHasMore(true);
        fetchStudentbyTeacherId(1, false, '');
    }, [teacherId]);

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.mainContent}>
                    <View style={[styles.infoValueContainer,
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, },
                    ]}>
                        <Text style={[styles.infoValue, { color: theme.colors.onSurface, }]} >
                            Class: {className}
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
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                    
                    <View style={[styles.listCard, { height: windowHeight * 0.7 }]}>
                        {loading && !refreshing ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                        ) : error ? (
                            <View>
                                <Image style={styles.imgNodata} source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/woman-with-no-appointment-illustration-download-in-svg-png-gif-file-formats--waiting-issue-empty-state-pack-people-illustrations-10922122.png' }} />
                                <Text style={[styles.noDataText, { color: theme.colors.onSurface }]}>
                                    No Student
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={students}
                                renderItem={({ item }) => <RenderItemStudent item={item} />}
                                keyExtractor={(item) => item.studentid.toString()}
                                contentContainerStyle={styles.scheduleList}
                                showsVerticalScrollIndicator={true}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.2}
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                ListFooterComponent={() => 
                                    loadingMore ? (
                                        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 10 }} />
                                    ) : null
                                }
                                ListEmptyComponent={() => 
                                    !loading ? (
                                        <View>
                                            <Image style={styles.imgNodata} source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/woman-with-no-appointment-illustration-download-in-svg-png-gif-file-formats--waiting-issue-empty-state-pack-people-illustrations-10922122.png' }} />
                                            <Text style={[styles.noDataText, { color: theme.colors.onSurface }]}>
                                                {searchQuery ? 'No students found for your search' : 'No students available'}
                                            </Text>
                                        </View>
                                    ) : null
                                }
                            />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
};

const RenderItemStudent = memo(({ item }: { item: Student }) => {
    const theme = useTheme();
    return (
        <TouchableWithoutFeedback>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Image source={{ uri: 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740' }} style={styles.cardImage} />
                    <View>
                        <Text style={[styles.cardName, { color: theme.colors.primary }]}>{item.name}</Text>
                        <Text style={[styles.cardSubject, { color: theme.colors.onBackground }]}>{item.dateofbirth.split('T')[0]}</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardContentItem}>
                        <Text style={[styles.cardContentItemTextLeft, { color: theme.colors.onSurface }]}>Phone:</Text>
                        <Text style={[styles.cardContentItemTextRight, { color: theme.colors.onBackground }]}>{item.parent?.phonenumber}</Text>
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={[styles.cardContentItemTextLeft, { color: theme.colors.onSurface }]}>Parent Name: </Text>
                        <Text style={[styles.cardContentItemTextRight, { color: theme.colors.onBackground }]}
                            numberOfLines={1} ellipsizeMode="tail"
                        >{item.parent?.fullname}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
});

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
    studentsFlatList: {
    },
    scheduleList: {
        paddingBottom: 0,
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
});

export default ClassStudentScreen;