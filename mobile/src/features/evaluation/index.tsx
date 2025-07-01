import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Checkbox, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { SIZES } from '@/constants';

const windowHeight = Dimensions.get('window').height;

type Student = {
    studentid: number;
    name: string;
    dateofbirth: string;
    parentid: number;
    classid: number;
    activity?: string;
    groupNote?: string;
}

export type Activity = {
    activityid: number;
    isnegative: boolean;
    activitytype: boolean;
}

const EvaluationScreen: React.FC = () => {
    const theme = useTheme();
    const [searchText, setSearchText] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    const [students, setStudents] = useState<Student[]>([
        { studentid: 1, name: 'John Kennedy', dateofbirth: '2000-01-01', parentid: 1, classid: 1, activity: '', groupNote: '' },
        { studentid: 2, name: 'Jane Smith', dateofbirth: '2001-02-02', parentid: 2, classid: 1, activity: '', groupNote: '' },
        { studentid: 3, name: 'Alice Brown', dateofbirth: '2002-03-03', parentid: 3, classid: 1, activity: '', groupNote: '' },
        { studentid: 4, name: 'Bob White', dateofbirth: '2003-04-04', parentid: 4, classid: 1, activity: '', groupNote: '' },
    ]);
    const [checkedStudents, setCheckedStudents] = useState<{ [key: number]: boolean }>({});
    const [selectAll, setSelectAll] = useState(false);
    const [activityAll, setActivityAll] = useState<string>("");

    const activities = ['Activity 1', 'Activity 2', 'Activity 3'];

    const handleSelectAll = () => {
        if (selectAll) {
            setCheckedStudents({});
        } else {
            const newCheckedStudents = students.reduce((acc, student) => {
                acc[student.studentid] = true;
                return acc;
            }, {} as { [key: number]: boolean });
            setCheckedStudents(newCheckedStudents);
        }
        setSelectAll(!selectAll);
    };

    const handleCheckboxToggle = (studentid: number) => {
        setCheckedStudents((prev) => ({
            ...prev,
            [studentid]: !prev[studentid],
        }));
    };

    const handleRemoveStudent = (studentid: number) => {
        setStudents((prev) => prev.filter((s) => s.studentid !== studentid));
        setCheckedStudents((prev) => {
            const newChecked = { ...prev };
            delete newChecked[studentid];
            return newChecked;
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Class: 9A1</Text>
                    <Text style={styles.headerText}>Section: 1</Text>
                </View>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                <View style={styles.evaluateContainer}>
                    <Text style={styles.evaluateLabel}>Evaluate</Text>
                    <TextInput
                        style={styles.evaluateArea}
                        placeholder="Enter evaluation..."
                        multiline
                        numberOfLines={4}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleSelectAll} style={styles.button}>
                        Select all
                    </Button>
                    <Button mode="contained" onPress={() => { }} style={styles.button}>
                        Add
                    </Button>
                </View> 
                <View style={styles.activityAllContainer}>
                    <Text style={styles.activityAllLabel}>Activity all:</Text>
                    <View style={[styles.pickerContainer, { flex: 1 }]}>
                        <Picker
                            selectedValue={activityAll}
                            onValueChange={(value) => {
                                setActivityAll(value as string);
                                setStudents((prev) => prev.map(s => ({ ...s, activity: value as string })));
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Activity" value="" />
                            {activities.map((activity, idx) => (
                                <Picker.Item key={idx} label={activity} value={activity} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={styles.studentList}>
                    {students.map((student, index) => (
                        <View key={student.studentid} style={styles.studentItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.studentCheckbox}>
                                    <Checkbox
                                        status={checkedStudents[student.studentid] ? 'checked' : 'unchecked'}
                                        onPress={() => handleCheckboxToggle(student.studentid)}
                                    />
                                </View>
                                <Text style={styles.studentName}>{student.name}</Text>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={student.activity}
                                    onValueChange={(value) => {
                                        const updatedStudents = [...students];
                                        updatedStudents[index].activity = value as string;
                                        setStudents(updatedStudents);
                                    }}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Activity" value="" />
                                    {activities.map((activity, idx) => (
                                        <Picker.Item key={idx} label={activity} value={activity} />
                                    ))}
                                </Picker>
                            </View>

                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
};

export default EvaluationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
        backgroundColor: '#f5f5f5',
        marginTop:10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        fontSize: 16,
    },
    evaluateContainer: {
        marginBottom: 10,
    },
    evaluateLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    studentList: {
        // flex: 1,
    },
    studentItem: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    studentName: {
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    picker: {
        width: '100%',
    },
    activityAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    activityAllLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    studentCheckbox: {
        marginLeft: 10,
    },
    evaluateArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal:10,
        fontSize: 16,
        backgroundColor: '#fff',
        minHeight: 80,
        marginTop: 5,
        marginBottom: 10,
    },
});