import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox, ActivityIndicator, useTheme } from 'react-native-paper';
import { Student, teacherService } from "@/api";
import { useAuth } from '@/features/auth/context/AuthContext';
import { SIZES } from '@/constants';

const TeacherReportScreen: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const theme = useTheme();

  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { authState } = useAuth();
  const teacherId = authState.user?.teacherId!;
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudents = async () => {
      if (!teacherId) return;
      setLoading(true);
      try {
        const data = await teacherService.getStudentsByTeacherId(teacherId);
        if (Array.isArray(data)) setStudents(data);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    };
    fetchStudents();
  }, [teacherId]);

  function normalize(str: string) {
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  }
  const filteredStudents = students.filter(s => normalize(s.name).includes(normalize(search)));

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredStudents.map(s => s.studentid));
    }
    setSelectAll(!selectAll);
  };

  // Handle select one
  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(sid => sid !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Kiểm tra khi chọn ngày
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

  // Khi bấm Generate
  const handleGenerate = () => {
    if (!fromDate || !toDate) {
      setDateError('Please select both dates');
      return;
    }
    if (fromDate >= toDate) {
      setDateError('From date must be before To date');
      return;
    }
    setDateError(null);
    // ... thực hiện logic generate
    Alert.alert('Success', 'Generate logic here!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
        </View>
      ) : (
      <View style={styles.container}>
        {/* Date pickers */}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setShowFromPicker(true)} style={[styles.dateInput, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
            <Text style={{ color: theme.colors.onSurface }}>{fromDate ? fromDate.toLocaleDateString() : 'DD/MM/YYYY'}</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 8, color: theme.colors.onSurface }}>to</Text>
          <TouchableOpacity onPress={() => setShowToPicker(true)} style={[styles.dateInput, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
            <Text style={{ color: theme.colors.onSurface }}>{toDate ? toDate.toLocaleDateString() : 'DD/MM/YYYY'}</Text>
          </TouchableOpacity>
        </View>
        {dateError && <Text style={{ color: theme.colors.error, marginBottom: 4 }}>{dateError}</Text>}
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

        {/* Search */}
        <TextInput
          style={[styles.searchInput, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]}
          placeholder="Search by name ..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
        />

        {/* Select all and Generate */}
        <View style={styles.row}>
          <Checkbox
            status={selectAll ? 'checked' : 'unchecked'}
            onPress={handleSelectAll}
            color={theme.colors.primary}
          />
          <Text style={{ flex: 1, color: theme.colors.onSurface }}>Select all</Text>
          <TouchableOpacity style={[styles.generateBtn, { backgroundColor: theme.colors.primary }]} onPress={handleGenerate} disabled={!!dateError}>
            <Text style={{ color: theme.colors.onPrimary, paddingHorizontal:10 }}>Generate</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.studentid.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={{ flex: 1, color: theme.colors.onSurface }}>{item.name}</Text>
              <Checkbox
                status={selected.includes(item.studentid) ? 'checked' : 'unchecked'}
                onPress={() => handleSelect(item.studentid)}
                color={theme.colors.primary}
              /> 
            </View>
          )}
          style={{ marginTop: 8 }}
        />
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, flex: 1, paddingTop:10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dateInput: { borderWidth: 1, borderRadius: 4, padding: 8, minWidth: 100, alignItems: 'center' },
  searchInput: { borderWidth: 1, borderRadius: 4, paddingVertical: 8, marginBottom: 8 },
  generateBtn: { borderRadius: 4, paddingVertical: 8 },
});

export default TeacherReportScreen;