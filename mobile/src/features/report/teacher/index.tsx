import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';

// Dummy data, thay bằng API nếu cần
const studentsData = [
  { id: 1, name: 'John Kenedy' },
  { id: 2, name: 'John Kenedy' },
  { id: 3, name: 'John Kenedy' },
  { id: 4, name: 'John Kenedy' },
  { id: 5, name: 'John Kenedy' },
];

const TeacherReportScreen: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Filter students by search
  const filteredStudents = studentsData.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredStudents.map(s => s.id));
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
    <View style={styles.container}>
      {/* Date pickers */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateInput}>
          <Text>{fromDate ? fromDate.toLocaleDateString() : 'DD/MM/YYYY'}</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 8 }}>to</Text>
        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateInput}>
          <Text>{toDate ? toDate.toLocaleDateString() : 'DD/MM/YYYY'}</Text>
        </TouchableOpacity>
      </View>
      {dateError && <Text style={{ color: 'red', marginBottom: 4 }}>{dateError}</Text>}
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
        style={styles.searchInput}
        placeholder="Search by name ..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Select all and Generate */}
      <View style={styles.row}>
        <Checkbox
          status={selectAll ? 'checked' : 'unchecked'}
          onPress={handleSelectAll}
        />
        <Text style={{ flex: 1 }}>Select all</Text>
        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} disabled={!!dateError}>
          <Text>Generate</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>{item.name}</Text>
            <Checkbox
              status={selected.includes(item.id) ? 'checked' : 'unchecked'}
              onPress={() => handleSelect(item.id)}
            />
            <TouchableOpacity>
              <Text>Select</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ marginTop: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, minWidth: 100, alignItems: 'center' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 },
  generateBtn: { backgroundColor: '#eee', padding: 8, borderRadius: 4 },
});

export default TeacherReportScreen;