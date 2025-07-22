import { FC, useState, useEffect, useRef } from "react";
import { View, StyleSheet, Keyboard, Platform, Dimensions, ScrollView, KeyboardAvoidingView } from "react-native";
import { Appbar, TextInput, Button, useTheme, Surface, Card, Text, Drawer, Modal, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {ChatbotResponse,Chatbox,ChatMessage, ChatbotSendRequest} from '@/api'; 
import { parentService } from '@/api/parent/parentService';
import { useAuth } from "@/features/auth/context/AuthContext";

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
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const {authState } = useAuth();

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                // Delay scroll để đảm bảo layout đã update
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
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

    const sendMessage = async () => {
        if (message.trim() && !isSending) {
            setIsSending(true);
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message.trim(),
                isUser: true,
            };
            setMessages(prev => [...prev, newMessage]);
            setMessage("");
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 50);

            try {
                const userId = authState?.user?.userId;
                if (!userId) {
                    setIsSending(false);
                    return;
                }
                const payload = {
                    messagetext: newMessage.text,
                    parentId: userId
                };
                const response = await parentService.sendChatbotMessage(payload);
                if (response && response.success && response.data) {
                    const botMessage: Message = {
                        id: response.data.messageid.toString(),
                        text: response.data.messagetext,
                        isUser: false,
                    };
                    setMessages(prev => [...prev, botMessage]);
                    setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 50);
                } else {
                    // Nếu lỗi, có thể push message lỗi
                    setMessages(prev => [...prev, {
                        id: Date.now().toString() + '-err',
                        text: 'Bot không phản hồi hoặc có lỗi xảy ra.',
                        isUser: false
                    }]);
                }
            } catch (err) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '-err',
                    text: 'Có lỗi khi gửi tin nhắn.',
                    isUser: false
                }]);
            } finally {
                setIsSending(false);
            }
        }
    };

    // Drawer/Modal for history
    const renderHistory = () => (
        <Portal>
            <Modal visible={isHistoryVisible} onDismiss={() => setIsHistoryVisible(false)} contentContainerStyle={styles.historyModal}>
                <Drawer.Section title="Chat History">
                    {messages.length === 0 && <Drawer.Item label="No messages yet" />}
                    {messages.map((msg, idx) => (
                        <Drawer.Item
                            key={msg.id + idx}
                            label={msg.text}
                            icon={msg.isUser ? "account" : "robot"}
                            style={{ backgroundColor: msg.isUser ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
                        />
                    ))}
                </Drawer.Section>
                <Button mode="contained-tonal" onPress={() => setIsHistoryVisible(false)} style={{ marginTop: 16 }}>Close</Button>
            </Modal>
        </Portal>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Appbar.Header elevated>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Chatbot" />
                    <Appbar.Action icon="history" onPress={() => setIsHistoryVisible(true)} />
                </Appbar.Header>
                
                <View style={styles.chatContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={[
                            styles.messagesContentContainer,
                            // Thêm padding bottom động khi keyboard hiện
                            { paddingBottom: keyboardHeight > 0 ? 24 : 24 }
                        ]}
                        onContentSizeChange={() => {
                            setTimeout(() => {
                                scrollViewRef.current?.scrollToEnd({ animated: true });
                            }, 100);
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg) => (
                            <Card
                                key={msg.id}
                                style={msg.isUser ? [styles.userMessage, { alignSelf: 'flex-end', backgroundColor: theme.colors.primary }] : [styles.botMessage, { alignSelf: 'flex-start', backgroundColor: theme.colors.surfaceVariant }]}
                            >
                                <Card.Content>
                                    <Text style={msg.isUser ? { color: theme.colors.onPrimary } : { color: theme.colors.onSurfaceVariant }}>
                                        {msg.text}
                                    </Text>
                                </Card.Content>
                            </Card>
                        ))}
                    </ScrollView>
                    
                    <View style={[
                        styles.inputContainer, 
                        { 
                            backgroundColor: theme.colors.surface, 
                            borderTopColor: theme.colors.outline,
                            // Đảm bảo input container luôn ở bottom
                            position: 'relative',
                            bottom: 0
                        }
                    ]}> 
                        <TextInput
                            style={[styles.input]}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message..."
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            multiline
                            maxLength={1000}
                            mode="outlined"
                            onFocus={() => {
                                // Scroll to bottom khi focus vào input
                                setTimeout(() => {
                                    scrollViewRef.current?.scrollToEnd({ animated: true });
                                }, 200);
                            }}
                        />
                        <Button
                            mode="contained"
                            onPress={sendMessage}
                            loading={isSending}
                            disabled={isSending || !message.trim()}
                            style={styles.sendButton}
                            contentStyle={{ height: 48 }}
                        >
                            Send
                        </Button>
                    </View>
                </View>
                {renderHistory()}
            </Surface>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between', // Đảm bảo input luôn ở bottom
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContentContainer: {
        padding: 16,
        paddingBottom: 24,
        flexGrow: 1, // Đảm bảo content có thể grow
    },
    userMessage: {
        marginBottom: 8,
        borderRadius: 12,
        maxWidth: '80%',
        elevation: 1,
    },
    botMessage: {
        marginBottom: 8,
        borderRadius: 12,
        maxWidth: '80%',
        elevation: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        borderTopWidth: 1,
        // Loại bỏ các style có thể gây conflict
    },
    input: {
        flex: 1,
        marginRight: 8,
        maxHeight: 120, // Giới hạn chiều cao của input
    },
    sendButton: {
        alignSelf: 'flex-end',
        borderRadius: 8,
    },
    historyModal: {
        backgroundColor: 'white',
        margin: 24,
        borderRadius: 12,
        padding: 16,
        minHeight: 200,
        maxHeight: '80%',
        elevation: 4,
    },
});

export default ChatbotScreen;