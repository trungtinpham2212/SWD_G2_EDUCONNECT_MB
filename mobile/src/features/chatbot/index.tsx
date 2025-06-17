import { FC, useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, ScrollView, Animated, Platform, Keyboard, Dimensions, StatusBar, Pressable, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import MainLayout from "@/layouts/MainLayout";
import { SIZES } from "@/constants";
import { useTheme } from "react-native-paper";
import SidebarModal from "./components/SidebarModal";


interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

const ChatbotScreen: FC = () => {
    const theme = useTheme();

    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0); 
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    const handleCloseSidebar = () => {
        setIsSidebarVisible(false);
    };

    const sendMessage = () => {
        if (message.trim() && !isSending) {
            setIsSending(true);
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message.trim(),
                isUser: true,
            };
            setMessages([...messages, newMessage]);
            setMessage("");
            scrollViewRef.current?.scrollToEnd({ animated: true });
            
            // Add bot response after 500ms
            setTimeout(() => {
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Hello",
                    isUser: false,
                };
                setMessages(prevMessages => [...prevMessages, botMessage]);
                scrollViewRef.current?.scrollToEnd({ animated: true });
                setIsSending(false);
            }, 500);
        }
    };

    const statusBarHeight = StatusBar.currentHeight || 0;
    const headerHeight = 60 + statusBarHeight;

    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Chatbot</Text>

                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setIsSidebarVisible(true)}
                    >
                        <Ionicons name="time-outline" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                </View> 
                
                <View style={[
                    styles.chatContainer,
                    { height: Dimensions.get('window').height - headerHeight - keyboardHeight }
                ]}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContentContainer}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubble,
                                    msg.isUser ? [styles.userMessage, { backgroundColor: theme.colors.primary }] :
                                        [styles.botMessage, { backgroundColor: theme.colors.surfaceVariant }]
                                ]}
                            >
                                <Text style={[
                                    styles.messageText,
                                    msg.isUser ? [styles.userMessageText, { color: theme.colors.onPrimary }] :
                                        [styles.botMessageText, { color: theme.colors.onSurfaceVariant }]
                                ]}>{msg.text}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Input Box */}
                    <View style={[
                        styles.inputContainer,
                        {
                            bottom: keyboardHeight,
                            borderTopColor: theme.colors.outline,
                            backgroundColor: theme.colors.surface
                        }
                    ]}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.surfaceVariant,
                                    color: theme.colors.onSurfaceVariant
                                }
                            ]}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message..."
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
                            onPress={sendMessage}
                            disabled={isSending}
                        >
                            <Ionicons name="send" size={24} color={isSending ? theme.colors.outline : theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <SidebarModal 
                isSidebarVisible={isSidebarVisible} 
                onClose={handleCloseSidebar} 
                theme={theme} 
            />
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    headerButton: {
        padding: 8,
        minWidth: 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContentContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    botMessage: {
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: '#fff',
    },
    botMessageText: {
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        padding: 8,
        marginLeft: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    }
});

export default ChatbotScreen;