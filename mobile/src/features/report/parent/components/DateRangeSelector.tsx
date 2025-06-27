import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { COLORS } from '@/constants';

const DateRangeSelector: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Mặc định hơn fromDate 1 ngày
  const [showFromPicker, setShowFromPicker] = useState<boolean>(false);
  const [showToPicker, setShowToPicker] = useState<boolean>(false);

  const onChange = (type: 'from' | 'to', event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      if (type === 'from') setShowFromPicker(false);
      else setShowToPicker(false);
      return;
    }

    if (!selectedDate) return;

    if (type === 'from') {
      // Nếu chọn fromDate mới mà toDate <= fromDate thì cập nhật toDate luôn
      setFromDate(selectedDate);
      if (toDate <= selectedDate) {
        const newToDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
        setToDate(newToDate);
      }
      setShowFromPicker(false);
    } else {
      // To date phải lớn hơn from date ít nhất 1 ngày
      const minToDate = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
      if (selectedDate < minToDate) {
        Alert.alert('Lỗi', 'Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 1 ngày.');
        setShowToPicker(false);
        return;
      }
      setToDate(selectedDate);
      setShowToPicker(false);
    }
  };

  // Show date picker
  const showDatePicker = (type: 'from' | 'to') => {
    if (type === 'from') setShowFromPicker(true);
    else setShowToPicker(true);
  };

  const handleConfirm = () => {
    console.log('Ngày bắt đầu:', fromDate.toISOString());
    console.log('Ngày kết thúc:', toDate.toISOString());

    // Gọi API hoặc xử lý lọc tại đây
    // fetchData(fromDate, toDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>From:</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('from')}>
          <Text style={styles.dateText}>{fromDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedDate) => onChange('from', event, selectedDate)}
            minimumDate={new Date()}
          />
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>To:</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('to')}>
          <Text style={styles.dateText}>{toDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedDate) => onChange('to', event, selectedDate)}
            minimumDate={new Date(fromDate.getTime() + 24 * 60 * 60 * 1000)}
          />
        )}
      </View>
      <Button
        mode="contained"
        onPress={handleConfirm}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={{ color: '#fff' }}
      //   disabled={isLoading}
      //   loading={isLoading}
      >
        {/* {isLoading ? 'Signing in...' : 'Sign in'} */}
        Confirm
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    width: 60,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: COLORS.MAIN_APP_COLOR
  },
  buttonContent: {
    paddingVertical: 8,

  },
});

export default DateRangeSelector;