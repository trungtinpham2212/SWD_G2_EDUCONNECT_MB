import { ReportStudentQueryParam, teacherService, Report, ReportGroup, ReportStudentResponse} from "@/api";
import { COLORS, SIZES } from "@/constants";
import { MainStackParamList } from "@/types/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import { memo, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, ListRenderItem, Alert } from 'react-native';
import { Card, Chip, Badge, Surface, useTheme, Text, Button, ActivityIndicator, } from "react-native-paper";
import { formatDate } from '@/utils/date';
import { getStatusColor } from "@/utils/status";

type EvaluationRouteProp = RouteProp<MainStackParamList, 'TeacherReportDetail'>;

const DetailReportScreen: React.FC = () => {
    const route = useRoute<EvaluationRouteProp>();
    const { reportGroupdId } = route.params;

    const theme = useTheme();

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [initialReportLoading, setInitialReportLoading] = useState(true);
    const [listReport, setListReport] = useState<Report[]>([]);
    const [reportGroup, setReportGroup] = useState<ReportGroup>();
    const [studentNames, setStudentNames] = useState<string[]>([]); 
      
    const renderProcessedContent = (content: string, names: string[]) => {
        content = (content || "").replace(/\*\*/g, "");

        if (!content) return null;
        if (!names || names.length === 0) return <Text>{content}</Text>;
        // Sắp xếp tên dài trước để tránh trùng tên ngắn nằm trong tên dài
        const sortedNames = [...names].sort((a, b) => b.length - a.length);
        // Tạo regex bắt tất cả tên trong names, không phân biệt hoa thường
        const pattern = new RegExp(sortedNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');
        const parts = [];
        let lastIndex = 0;
        let match;
        let key = 0;
        while ((match = pattern.exec(content)) !== null) {
            if (match.index > lastIndex) {
                parts.push(<Text key={key++}>{content.slice(lastIndex, match.index)}</Text>);
            }
            const matchedName = match[0];
            parts.push(
                <Text key={key++} style={{ color: '#2563eb', paddingHorizontal: 14, fontWeight: 'bold' }}>@{matchedName.replace(/\s+/g, '')}</Text>


            );
            lastIndex = match.index + matchedName.length;
        }
        if (lastIndex < content.length) {
            parts.push(<Text key={key++}>{content.slice(lastIndex)}</Text>);
        }
        return parts;
    };

    const fetchStudentReports = async (nextPage = 1, append = false) => {
        if (reportGroupdId && !append && nextPage === 1) setLoading(true);
        try {
            const payload: ReportStudentQueryParam = {
                reportGroupId: reportGroupdId,
                page: nextPage,  
                pageSize
            };
            const response = await teacherService.getStudentReportsByReportGroupId(payload);

            if (response) {
                if (append) {
                    setListReport(prev => [...prev, ...response.items]);
                } else {
                    setListReport(response.items); 
                } 
                

                setPage(response.pageNumber);
                setHasMore(response.items.length === pageSize); // Nếu trả về đủ pageSize thì còn nữa
            }
        } catch (err) {
            // handle error
        } finally {
            setLoading(false);
            setInitialReportLoading(false);
        }
    };

    const fetchReportGroupDetailById = async() => {
        if(!reportGroupdId) return;
        try{
            const response = await teacherService.getReportGroupDetailById(reportGroupdId);
            if(response){
                setReportGroup(response);

                const fetchedNames = response.students
                    .map(i => i.name)
                    .filter(Boolean) as string[];
                setStudentNames(fetchedNames);
            } 
        }catch(err){

        } 
    }

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            fetchStudentReports(page + 1, true).finally(() => setLoadingMore(false));
        }
    };

    const handleRefresh = async () => {
        if (loading || initialReportLoading || !reportGroupdId) return;
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        setListReport([]); // Clear list trước khi fetch mới
        try {
            await fetchStudentReports(1, false);
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể làm mới báo cáo. Vui lòng thử lại.');
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!reportGroupdId) return;
        setPage(1);
        setHasMore(true);
        fetchReportGroupDetailById();
        setListReport([]);
        fetchStudentReports(1, false);
    }, [reportGroupdId]);


    const CardItemReportStudent = memo(({ item }: { item: Report }) => {
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.rowItem}>
                        <Text variant="bodySmall" style={styles.leftTitle}>
                            ID Student
                        </Text>
                        <View style={styles.rightInfor}>
                            <Text variant="bodySmall" style={styles.textRightInfor}>
                                : {item.studentid}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <Text variant="bodySmall" style={styles.leftTitle}>
                            Student
                        </Text>
                        <View style={styles.rightInfor}>
                            <Text variant="bodySmall" style={styles.textRightInfor}>
                                : {item.student?.studentName || item.student?.name}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <Text variant="bodySmall" style={styles.leftTitle}>
                            Content
                        </Text>
                        <View style={[styles.rightInfor]}>
                            <Text variant="bodySmall" style={styles.textRightInfor} numberOfLines={3} ellipsizeMode="tail"  >
                                : {renderProcessedContent(item.content, studentNames)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <Text variant="bodySmall" style={styles.leftTitle}>
                            Status
                        </Text>
                        <View style={[styles.rightInfor]}> 
                            <Text variant="labelSmall"
                                style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <Text variant="bodySmall" style={styles.leftTitle}>
                            Update
                        </Text>
                        <View style={styles.rightInfor}>
                            <Text variant="bodySmall" style={styles.textRightInfor}>
                                : {formatDate(item.updateat)}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        )
    })

    return (
        <View style={styles.container}>
            <FlatList
                data={listReport}
                keyExtractor={item => item.studentid.toString()}
                renderItem={({ item }) => <CardItemReportStudent item={item} />}
                ListHeaderComponent={
                    <View>
                        {/* <Button
                            mode="contained"
                            style={styles.buttonUpdate}
                            contentStyle={styles.buttonContentUpdate}
                            labelStyle={{ color: '#fff', fontSize: 14 }}
                        >
                            Edit report
                        </Button> */}
                        <View style={styles.containContentReportGroup}>
                            <Text variant="titleSmall" style={{ fontSize: 15 }}> 
                                {reportGroup && renderProcessedContent(reportGroup.content, studentNames)} 
                            </Text>
                        </View>
                    </View>
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={loadingMore ? <Text style={{ textAlign: 'center', color: theme.colors.primary, margin: 10 }}>Đang tải thêm...</Text> : null}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    initialReportLoading || loading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 24 }} />
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 32 }}>
                            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16 }}>Không có báo cáo nào</Text>
                        </View>
                    )
                }
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 16 }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: SIZES.DISTANCE_MAIN_POSITIVE, backgroundColor: '#f5f5f5' },
    containContentReportGroup: {
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: 10,
        marginBottom: 14
    },
    card: {
        borderRadius: 12,
        elevation: 2,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    rowItem: {
        flexDirection: 'row',
        marginBottom: 8
    },
    leftTitle: {
        fontWeight: '700',
        fontSize: 14,
        width: '30%'

    },
    rightInfor: {
        width: '70%'
    },
    textRightInfor: {
        color: '#000',
        fontSize: 14,

    },
    buttonUpdate: {
        borderRadius: 8,
        backgroundColor: COLORS.MAIN_APP_COLOR,
        marginBottom: 14
    },
    buttonContentUpdate: {
        paddingVertical: 4,
        paddingHorizontal: 0

    },

    status: {
        color: '#4CAF50',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
        fontSize: 14
    },
});
export default DetailReportScreen;