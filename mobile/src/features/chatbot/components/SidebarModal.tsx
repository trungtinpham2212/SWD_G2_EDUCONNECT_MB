import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SidebarModalProps {
    isSidebarVisible: boolean;
    onClose: () => void;
    theme: Theme;
}
interface Theme {
    colors: {
      surface: string;
      onSurface: string;
      onSurfaceVariant: string;
      outline: string;
    };
  }
const SidebarModal: React.FC<SidebarModalProps> = ({ isSidebarVisible, onClose, theme }) => {
    // Animation setup
    const slideAnim = useRef(new Animated.Value(300)).current; 

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isSidebarVisible ? 0 : 300, // Slide in (0) or out (300)
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isSidebarVisible]);

    return (
        <Modal
            visible={isSidebarVisible}
            transparent={true}
            animationType="none" 
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View
                    style={[
                        styles.sidebar,
                        {
                            transform: [{ translateX: slideAnim }], // Animate translateX
                            backgroundColor: theme.colors.surface,
                            borderLeftColor: theme.colors.outline,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.sidebarHeader,
                            {
                                borderBottomColor: theme.colors.outline,
                                backgroundColor: theme.colors.surface,
                            },
                        ]}
                    >
                        <Text style={[styles.sidebarTitle, { color: theme.colors.onSurface }]}>Chat History</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.historyContainer}>
                        <Text style={[styles.historyText, { color: theme.colors.onSurfaceVariant }]}>
                            No chat history yet
                        </Text>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlay: {
        flex: 1, // Overlay covers the entire screen
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60%',
        height: '100%',
        borderLeftWidth: 1,
    },
    sidebarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    historyContainer: {
        flex: 1,
        padding: 16,
    },
    historyText: {
        textAlign: 'center',
        marginTop: 20,
    },
});

export default SidebarModal;