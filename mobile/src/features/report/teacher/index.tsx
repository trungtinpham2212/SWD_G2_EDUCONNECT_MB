import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox, ActivityIndicator, useTheme, Button, TextInput, HelperText, Card, Text } from 'react-native-paper';
import { Student, teacherService, Report,ReportGroupQueryParams } from "@/api";
import { useAuth } from '@/features/auth/context/AuthContext';
import { COLORS, SIZES } from '@/constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '@/types/navigation';
import { formatDate } from '@/utils/date';


const TeacherReportScreen: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = React.useState("");

  const [listReport, setListReport] = useState<Report[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(3);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [initialReportLoading, setInitialReportLoading] = useState(true);
  const navigation: NavigationProp<MainStackParamList> = useNavigation();
 
  const { authState } = useAuth();
  const teacherId = authState.user?.teacherId!;

  const fetchReportStudent = async (nextPage = 1, append = false) => {
    if (!append && nextPage === 1) setLoading(true);
    try {
      const payload: ReportGroupQueryParams = {
        teacherId,
        page: nextPage,
        pageSize
      };
      const response = await teacherService.getStudentReporstByTeacherId(payload);
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

    } finally {
      if (!append && nextPage === 1) {
        setLoading(false);
        setInitialReportLoading(false);
      }
    }

  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchReportStudent(page + 1, true).finally(() => setLoadingMore(false));
    }
  };

  const handleRefresh = async () => {
    if (loading || initialReportLoading || !teacherId) return; // Không cho phép refresh khi đang loading
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    setListReport([]); // Clear list trước khi fetch mới
    try {
      await fetchReportStudent(1, false);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể làm mới danh sách báo cáo. Vui lòng thử lại.');
    } finally {
      setRefreshing(false);
    }
  }; 

  useEffect(() => {
    if (!teacherId) return;
    setPage(1);
    setHasMore(true);
    fetchReportStudent(1, false);
  }, [teacherId]);


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateReport')}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={{ color: '#fff', fontSize: 14 }}
          >
            + Create new report
          </Button>

          <TextInput
            mode="outlined"
            label="Find report with title"
            value={title}
            onChangeText={text => setTitle(text)}
            autoCapitalize="none"
            style={{ marginBottom: 14 }}
          />
          <FlatList
            data={listReport}
            keyExtractor={item => item.reportgroupid.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback>
                  <View style={{ paddingVertical: 7 }}>
                    <Card style={styles.card}>
                      <Card.Content>
                        <View style={styles.headerCard}>
                          <Text variant="titleMedium" style={styles.titleCard} numberOfLines={2} ellipsizeMode="tail">
                            {item.title}
                          </Text>
                        </View>
                        <Text variant="bodySmall" style={styles.date}>
                          {formatDate(item.startdate)} - {formatDate(item.enddate)}
                        </Text>
                        <View style={styles.statusContainer}>
                          <Text variant="labelSmall"
                            style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
                            {item.status}
                          </Text>
                        </View>
                        <Button
                          mode="contained"
                          style={styles.buttonCard}
                          labelStyle={styles.buttonLabel}
                          icon="eye"
                          onPress={() => navigation.navigate('TeacherReportDetail', {
                            reportGroupdId: item.reportgroupid
                          })}
                        >
                          View Detail
                        </Button>
                      </Card.Content>
                    </Card>
                  </View>
                </TouchableWithoutFeedback>
              )
            }}
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'draft':
      return '#fef9c3';
    case 'sent':
      return '#E8F5E9'; // blue
    case 'approved':
      return 'green';
    case 'rejected':
      return 'red';
    default:
      return 'black';
  }
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SIZES.DISTANCE_MAIN_POSITIVE, flex: 1, paddingTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dateInput: { borderWidth: 1, borderRadius: 4, padding: 8, minWidth: 100, alignItems: 'center' },
  searchInput: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    marginBottom: 8,
    fontSize: 14
  },
  generateBtn: { borderRadius: 4, paddingVertical: 8 },

  button: {
    borderRadius: 8,
    backgroundColor: COLORS.MAIN_APP_COLOR,
    marginBottom: 14
  },
  buttonContent: {
    paddingVertical: 4,
    paddingHorizontal: 0

  },
  containListCard: {
    marginTop: 15,
    flex: 1
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff'
  },
  headerCard: {
    flexDirection: 'row',
  },
  titleCard: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    color: '#757575',
    marginBottom: 10,
    fontSize: 16
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  buttonCard: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 4,
    width: '100%'
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TeacherReportScreen;