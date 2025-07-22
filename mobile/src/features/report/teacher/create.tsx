import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Alert, RefreshControl } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Checkbox, ActivityIndicator, useTheme, Surface, Text, Button, Searchbar, Card, Chip, Divider,
  IconButton
} from 'react-native-paper';
import { Student, teacherService, StudentQueryParam, AICreateReportGroupRequest } from "@/api";
import { useAuth } from '@/features/auth/context/AuthContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '@/types/navigation';

const CreateReportScreen: React.FC = () => {
  const theme = useTheme();
  const { authState } = useAuth();
  const teacherId = authState.user?.teacherId!;

  // Date states
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [className, setClassName] = useState<string>('');

  // Student states
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Search and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(40);
  const [hasMore, setHasMore] = useState(true); 
  const navigation: NavigationProp<MainStackParamList> = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const [initialStudentsLoading, setInitialStudentsLoading] = useState(true);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fixed fetchStudents function with correct parameters
  const fetchStudents = useCallback(async (nextPage = 1, searchName = '', isRefresh = false, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else if (isRefresh) {
      setRefreshing(true);
    } else if (nextPage === 1) {
      setLoading(true);
    }

    try {
      const payload: StudentQueryParam = {
        teacherId,
        page: nextPage,
        pageSize,
        name: searchName || undefined
      };
      
      const response = await teacherService.getStudentsByTeacherId(payload);
      if (response) {
        setHasMore(response.pageNumber < response.totalPages);
        console.log('Pagination info:', { 
          currentPage: response.pageNumber, 
          totalPages: response.totalPages, 
          hasMore: response.pageNumber < response.totalPages 
        });
        
        if (isLoadMore) {
          setStudents(prev => [...prev, ...response.items]);
        } else {
          setStudents(response.items);
          // Reset selected when doing fresh search/refresh
          setSelected([]);
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
      setError('Failed to load students');
      console.error('Error fetching students:', err);
      if (!isLoadMore) {
        setStudents([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      if (nextPage === 1) {
        setInitialStudentsLoading(false);
      }
    }
  }, [teacherId, pageSize, className]);

  // Initial load
  useEffect(() => {
    fetchStudents();
  }, [teacherId]);

  // Handle search with debounce
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchStudents(1, query);
    }, 500);

    setSearchTimeout(timeout);
  }, [fetchStudents, searchTimeout]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchStudents(1, searchQuery, true);
  }, [fetchStudents, searchQuery]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && !refreshing && students.length > 0) {
      console.log('Load more triggered:', { currentPage: page, hasMore, studentsCount: students.length });
      fetchStudents(page + 1, searchQuery, false, true);
    }
  }, [loadingMore, hasMore, loading, refreshing, page, searchQuery, fetchStudents, students.length]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(students.map(s => s.studentid));
    }
    setSelectAll(!selectAll);
  }, [selectAll, students]);

  // Handle select one
  const handleSelect = useCallback((id: number) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  // Update selectAll state when selected changes
  useEffect(() => {
    const allSelected = students.length > 0 && selected.length === students.length;
    setSelectAll(allSelected);
  }, [selected, students]);

  // Date handlers
  const handleFromDate = (date: Date | undefined) => {
    setShowFromPicker(false);
    if (date) {
      setFromDate(date);
      if (toDate && date >= toDate) {
        setDateError('From date must be before To date');
      } else {
        setDateError(null);
      }
    }
  };

  const handleToDate = (date: Date | undefined) => {
    setShowToPicker(false);
    if (date) {
      setToDate(date);
      if (fromDate && fromDate >= date) {
        setDateError('From date must be before To date');
      } else {
        setDateError(null);
      }
    }
  };

  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      setDateError('Please select both dates');
      return;
    }
    if (fromDate >= toDate) {
      setDateError('From date must be before To date');
      return;
    }
    if (selected.length === 0) {
      Alert.alert('Warning', 'Please select at least one student');
      return;
    }
    setDateError(null);
    
    const payload: AICreateReportGroupRequest = {
      startDate: formatDateV2(fromDate),
      endDate: formatDateV2(toDate),
      teacherId: teacherId,
      studentIds: selected
    };

    try {
      setIsLoadingCreate(true);
      const response = await teacherService.createReportGroupWithAI(payload);
      if (response) {
        Alert.alert('Success', 'Report generated successfully!');
        navigation.goBack();
      }
    } catch (err) {
      console.error('Error creating report:', err);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const formatDateV2 = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString('vi-VN') : 'Select date';
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <Card style={{ marginHorizontal: 16, marginVertical: 4 }} mode="outlined">
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyLarge">{item.name}</Text>
            {item.class?.classname && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                Class: {item.class?.classname}
              </Text>
            )}
          </View>
          <Checkbox
            status={selected.includes(item.studentid) ? 'checked' : 'unchecked'}
            onPress={() => handleSelect(item.studentid)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {searchQuery ? 'No students found for your search' : 'No students available'}
        </Text>
      </View>
    );
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <Surface style={{ flex: 1 }}>
      {/* Date Selection Section */}
      <Surface style={{ margin: 16, borderRadius: 12 }} elevation={1}>
        <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
            Select Date Range
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Button
              mode="outlined"
              onPress={() => setShowFromPicker(true)}
              style={{ flex: 1, marginRight: 8 }}
              contentStyle={{}}
            >
              {formatDate(fromDate)}
            </Button>

            <Text variant="bodyMedium" style={{ marginHorizontal: 2 }}>
              to
            </Text>

            <Button
              mode="outlined"
              onPress={() => setShowToPicker(true)}
              style={{ flex: 1, marginLeft: 8 }}
              contentStyle={{}}
            >
              {formatDate(toDate)}
            </Button>
          </View>

          {dateError && (
            <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: 4 }}>
              {dateError}
            </Text>
          )}
        </View>
      </Surface>

      {/* Search Section */}
      <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
        <Searchbar
          placeholder="Search students by name..."
          onChangeText={handleSearch}
          value={searchQuery}
          elevation={1}
        />
      </View>

      {/* Selection Controls */}
      <Surface style={{ margin: 16, borderRadius: 12 }} elevation={1}>
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Checkbox
                status={selectAll ? 'checked' : 'unchecked'}
                onPress={handleSelectAll}
              />
              <Text variant="bodyLarge" style={{ marginLeft: 8 }}>
                Select all ({students.length})
              </Text>
            </View>

            {selected.length > 0 && (
              <Chip icon="account-multiple">
                {selected.length} selected
              </Chip>
            )}
          </View>

          <Divider style={{ marginVertical: 12 }} />

          <Button
            mode="contained"
            onPress={handleGenerate}
            disabled={!!dateError || selected.length === 0 || !fromDate || !toDate || isLoadingCreate}
            icon="file-document"
            contentStyle={{ paddingVertical: 8 }}
            loading={isLoadingCreate}
          >
            Generate Report
          </Button>
        </View>
      </Surface>

      {/* Students List */}
      <View style={{ flex: 1 }}>
        {loading && students.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text variant="bodyMedium" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
              Loading students...
            </Text>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={item => item.studentid.toString()}
            renderItem={renderStudentItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
              />
            }
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>

      {/* Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => handleFromDate(date)}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => handleToDate(date)}
        />
      )}
    </Surface>
  );
};

export default CreateReportScreen;