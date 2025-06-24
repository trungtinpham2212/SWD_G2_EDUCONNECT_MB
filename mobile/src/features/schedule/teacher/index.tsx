import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, FlatList } from 'react-native';
import MainLayout from '@/layouts/MainLayout';
import { useTheme } from 'react-native-paper';
import moment from 'moment';
import { SIZES } from '@/constants';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



const TeacherScheduleScreen: React.FC = () => {
  const theme = useTheme();
  // const [currentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));

  
const todaySchedule = [
  { subject: 'Mathematics' },
  { subject: 'Physics' },
  { subject: 'Chemistry' },
  { subject: 'Biology' },
  { subject: 'Biology' },
  { subject: 'Biology' },
  { subject: 'Biology' },
  { subject: 'Biology' },
];

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = moment(currentWeek).add(i, 'days');
    return {
      day: date.format('ddd'),
      date: date.format('DD'),
      fullDate: date,
      isToday: date.isSame(moment(), 'day'),
      isSelected: date.isSame(selectedDate, 'day')
    };
  });

  const goToPreviousWeek = () => {
    const newWeek = moment(currentWeek).subtract(1, 'week');
    setCurrentWeek(newWeek);
    // Reset selected date to first day of new week
    setSelectedDate(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = moment(currentWeek).add(1, 'week');
    setCurrentWeek(newWeek);
    // Reset selected date to first day of new week
    console.log(newWeek)
    setSelectedDate(newWeek);
  };

  const renderDayItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        item.isToday && styles.todayContainer,
        item.isSelected && !item.isToday && styles.selectedContainer
      ]}
      onPress={() => setSelectedDate(item.fullDate)}
    >
      <Text style={[
        styles.dayText,
        (item.isToday || item.isSelected) && styles.todayText
      ]}>{item.day}</Text>
      <Text style={styles.dayText}>{item.date}</Text>
    </TouchableOpacity>
  );


  const renderScheduleItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity>
      <View style={styles.scheduleItem}>
        <View style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.periodText,{color: theme.colors.onSurface}]}>1</Text>
          <Text style={[styles.timeText, {color: theme.colors.primary}]}>07:30 - 08:15</Text>
        </View>
        <View style={{ width: '60%' }}>
          <Text style={[styles.subjectText, {color: theme.colors.onSurface}]}>{item.subject}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

 
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.mainContent}>
        <View style={{ marginHorizontal: SIZES.DISTANCE_MAIN_NEGATIVE }}>
           <View style={styles.weekNavigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, {backgroundColor: theme.colors.primary}]}
              onPress={goToPreviousWeek}
            >
              <MaterialIcons name="keyboard-arrow-left" size={24} color="#fff" style={{ paddingHorizontal: 4 }} />
            </TouchableOpacity>

            <FlatList
              data={weekDates}
              renderItem={renderDayItem}
              keyExtractor={(_, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.weekContainer}
              snapToInterval={width * 0.25}
              ItemSeparatorComponent={() => <TouchableOpacity style={{ width: 10 }} />}
              ListHeaderComponent={<View style={{ width: 4 }} />}
              ListFooterComponent={<View style={{ width: 4 }} />}
            />

            <TouchableOpacity
              style={[styles.navButton, {backgroundColor: theme.colors.primary}]}
              onPress={goToNextWeek}
            >
              <MaterialIcons name="keyboard-arrow-right" size={24} color="#fff" style={{ paddingHorizontal: 4 }} />
            </TouchableOpacity>
          </View> 
        </View>
        <View style={[styles.scheduleContainer, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.scheduleTitle, {color: theme.colors.onSurface}]}>
              Schedule for {selectedDate.format('dddd, MMMM D')}
            </Text>
            <FlatList
              data={todaySchedule}
              renderItem={renderScheduleItem}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scheduleList}
              style={styles.scheduleFlatList}
              nestedScrollEnabled={true}
            />
          </View>
      </View>
    </View>
  );
};



const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
    marginTop: 20,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  infoItem: {
    flex: 1,
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
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 'auto',
    width: '100%',
    color: '#2C3E50',
  },
  weekContainer: {
    paddingVertical: 0,
  },
  dayContainer: {
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    width: width * 0.25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todayContainer: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  selectedContainer: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  todayText: {
    color: '#FFFFFF',
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleFlatList: {
    flex: 1,
  },
  scheduleList: {
    paddingBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    alignItems: 'center',
  },
  periodText:{
    fontSize: 20,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  subjectText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2C3E50',
  },
  subjectTextSecondary: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2C3E50',
  },
  weekNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
  },
  navButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});


export default TeacherScheduleScreen; 