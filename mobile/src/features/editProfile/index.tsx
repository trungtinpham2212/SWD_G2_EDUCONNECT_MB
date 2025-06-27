import MainLayout from '@/layouts/MainLayout';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { TextInput } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType, ImageLibraryOptions } from 'react-native-image-picker';

// Types
interface UserProfile {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    dateOfBirth: string;
}

interface EditProfileProps {
    navigation: any;
    route?: {
        params?: {
            userProfile?: UserProfile;
        };
    };
}

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        id: '',
        avatar: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        dateOfBirth: '',
    });

    // Initialize profile data
    useEffect(() => {
        // Load existing profile data from props, API, or AsyncStorage
        const existingProfile = route?.params?.userProfile;
        if (existingProfile) {
            setProfile(existingProfile);
        } else {
            // Load from API or storage
            loadUserProfile();
        }
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            // Simulate API call
            // const response = await getUserProfile();
            // setProfile(response.data);

            // Mock data for demo
            setTimeout(() => {
                setProfile({
                    id: '1',
                    avatar: 'https://via.placeholder.com/150',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+84 123 456 789',
                    bio: 'Software Developer',
                    dateOfBirth: '1990-01-01',
                });
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
                    setProfile(prev => ({ ...prev, avatar: imageUri }));
                }
            }
        });
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        if (!profile.firstName.trim()) {
            Alert.alert('Validation Error', 'First name is required');
            return false;
        }
        if (!profile.lastName.trim()) {
            Alert.alert('Validation Error', 'Last name is required');
            return false;
        }
        if (!profile.email.trim()) {
            Alert.alert('Validation Error', 'Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profile.email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

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
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <MainLayout>



            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.headerButton, saving && styles.disabledButton]}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#007AFF" />
                        ) : (
                            <Text style={styles.saveText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={handleImagePicker} style={styles.avatarContainer}>
                            <Image
                                source={{ uri: profile.avatar || 'https://via.placeholder.com/150' }}
                                style={styles.avatar}
                            />
                            <View style={styles.avatarOverlay}>
                                <Text style={styles.avatarOverlayText}>Change Photo</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.firstName}
                                onChangeText={(text) => handleInputChange('firstName', text)}
                                placeholder="Enter your first name"
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.lastName}
                                onChangeText={(text) => handleInputChange('lastName', text)}
                                placeholder="Enter your last name"
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.phone}
                                onChangeText={(text) => handleInputChange('phone', text)}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.dateOfBirth}
                                onChangeText={(text) => handleInputChange('dateOfBirth', text)}
                                placeholder="YYYY-MM-DD"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                value={profile.bio}
                                onChangeText={(text) => handleInputChange('bio', text)}
                                placeholder="Tell us about yourself"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </ScrollView>


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
});

export default EditProfileScreen;