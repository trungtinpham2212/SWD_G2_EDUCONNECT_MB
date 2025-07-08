import MainLayout from '@/layouts/MainLayout';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback} from 'react-native';
import { TextInput } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType, ImageLibraryOptions } from 'react-native-image-picker';
import { UserInfor, authService } from '@/api';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useTheme } from 'react-native-paper';

interface EditProfileProps {
    navigation: any;
    route?: {
        params?: {
            userProfile?: UserInfor;
        };
    };
}

const DEFAULT_AVATAR = 'https://i.pinimg.com/564x/32/25/b1/3225b1ec8c0064fba95d2d84faa79626.jpg';

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false); 
    const { authState } = useAuth();
    const userId = authState.user?.userId!;
    const [userInfor, setUserInfor] = useState<UserInfor | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const theme = useTheme(); 
    useEffect(() => {
        setLoading(true);
        authService.getUserById(userId).then((res) => {
            setUserInfor(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [userId]);



    const loadUserProfile = async () => {
        try {
            setLoading(true);
            // Simulate API call 
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to load profile data');
        }
    };

    const handleImagePicker = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8, // PhotoQuality type: 0.1 to 1.0
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel || response.errorCode) {
                return;
            }

            if (response.assets && response.assets[0]) {
                const imageUri = response.assets[0].uri;
                if (imageUri) {
                    setSelectedAvatar(imageUri);
                }
            }
        });
    };

    // handleInputChange is removed

    // validateForm is removed

    const handleSave = async () => {
        // if (!validateForm()) return; // This line is removed

        try {
            setSaving(true);

            // Simulate API call
            // await updateUserProfile(profile);

            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Success',
                'Profile updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        Alert.alert(
            'Discard Changes',
            'Are you sure you want to discard your changes?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <MainLayout>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, backgroundColor: theme.colors.background }}
            >
                <View style={{ flex: 1 }}>
                    {/* Header giữ nguyên */}
                    <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }]}>
                        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                            <Text style={[styles.cancelText, { color: theme.colors.onSurfaceVariant }]}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>Edit Profile</Text>
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.headerButton, saving && styles.disabledButton]}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            ) : (
                                <Text style={[styles.saveText, { color: theme.colors.primary }]}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.colors.background }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TouchableWithoutFeedback>
                            <View>
                                {/* Avatar Section */}
                                <View style={[styles.avatarSection, { backgroundColor: theme.colors.surface }]}>
                                    <TouchableOpacity onPress={handleImagePicker} style={styles.avatarContainer}>
                                        <Image
                                            source={{ uri: selectedAvatar || userInfor?.avatarurl || DEFAULT_AVATAR }}
                                            style={styles.avatar}
                                        />
                                        <View style={styles.avatarOverlay}>
                                            <Text style={styles.avatarOverlayText}>Change Photo</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* Thông tin user chung */}
                                <View style={[styles.formSection, { backgroundColor: theme.colors.background }]}>
                                    {userInfor?.fullname && (
                                        <View style={styles.inputGroup}>
                                            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Full Name</Text>
                                            <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>{userInfor.fullname}</Text>
                                        </View>
                                    )}
                                    {userInfor?.email && (
                                        <View style={styles.inputGroup}>
                                            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Email</Text>
                                            <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>{userInfor.email}</Text>
                                        </View>
                                    )}
                                    {userInfor?.phonenumber && (
                                        <View style={styles.inputGroup}>
                                            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Phone</Text>
                                            <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>{userInfor.phonenumber}</Text>
                                        </View>
                                    )}
                                    {userInfor?.address && (
                                        <View style={styles.inputGroup}>
                                            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Address</Text>
                                            <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>{userInfor.address}</Text>
                                        </View>
                                    )}
                                    {/* Nếu là giáo viên, hiển thị thông tin giáo viên readonly */}
                                    {userInfor?.teacher !== null && (
                                        <View style={[styles.inputGroup, styles.teacherGroup, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary + '33' }]}>
                                            <Text style={[styles.label, { color: theme.colors.primary }]}>Teacher Info</Text>
                                            <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>ID: {userInfor?.teacher.teacherId}</Text>
                                            <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>Name: {userInfor?.teacher.teacherName}</Text>
                                            {userInfor?.teacher.subject && (
                                                <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>Subject: {userInfor.teacher.subject.subjectName}</Text>
                                            )}
                                        </View>
                                    )}
                                    {/* Nếu là phụ huynh, hiển thị thông tin các con readonly */}
                                    {userInfor?.students && userInfor.students.length > 0 && (
                                        <View style={[styles.inputGroup, styles.childrenGroup, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                                            <Text style={[styles.label, { color: theme.colors.primary }]}>Children</Text>
                                            {userInfor.students?.map((stu: any) =>{
                                                const dateOfBirtStudent = stu.dateOfBirth.slice(0,10);
                                                return(
                                                    <View key={stu.studentId} style={[styles.studentCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.outline }]}>
                                                    <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>ID: {stu.studentId}</Text>
                                                    <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>Name: {stu.name}</Text>
                                                    {stu.class && <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>Class: {stu.class.className}</Text>}
                                                    <Text style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}>Date of Birth: {(dateOfBirtStudent)}</Text>
                                                </View>
                                                )
                                            })}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#FFFFFF',
    },
    headerButton: {
        minWidth: 60,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    cancelText: {
        fontSize: 16,
        color: '#666666',
    },
    saveText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.6,
    },
    content: {
        flex: 1,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#F8F9FA',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E5E5E5',
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 8,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        alignItems: 'center',
    },
    avatarOverlayText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    formSection: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        color: '#333333',
    },
    bioInput: {
        height: 100,
        paddingTop: 12,
    },
    teacherGroup: {
        backgroundColor: '#f0f6ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#b3d1ff',
    },
    childrenGroup: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    studentCard: {
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    studentDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 6,
    },
});

export default EditProfileScreen;