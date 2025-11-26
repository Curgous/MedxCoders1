import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";

export default function ChatBot() {
    const [messages, setMessages] = useState([
        { id: "1", text: "Hi! Type 'hi' to start the consultation 👋", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const [step, setStep] = useState(0);
    const flatListRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now().toString(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);

        let botReply = "";
        if (step === 0 && input.toLowerCase().includes("hi")) {
            botReply = "How are you feeling today? 🤔";
            setStep(1);
        } else if (step === 1 && input.toLowerCase().includes("headache")) {
            botReply = "Do you also have a fever? (yes/no)";
            setStep(2);
        } else if (step === 2 && input.toLowerCase() === "yes") {
            botReply =
                "You may have a viral infection 🤒.\n\n👉 Remedies:\n- Take paracetamol\n- Drink fluids 💧\n- Rest well 🛌\n- Consult a doctor if it persists.";
            setStep(3);
        } else if (step === 2 && input.toLowerCase() === "no") {
            botReply =
                "Looks like a tension headache 😓.\n\n👉 Remedies:\n- Stay hydrated 💧\n- Rest in a dark room 🛌\n- Reduce screen time 📵\n- Take mild pain relief.";
            setStep(3);
        } else {
            botReply = "Sorry, I didn’t understand. Please type again 🙏";
        }

        const botMsg = { id: Date.now().toString() + "-bot", text: botReply, sender: "bot" };
        setMessages((prev) => [...prev, botMsg]);
        setInput("");
    };

    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageBubble,
                item.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
        >
            <Text style={item.sender === "user" ? styles.userText : styles.botText}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesContainer}
                keyboardShouldPersistTaps="handled"
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor="#888"
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendText}>➤</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f9",
    },
    messagesContainer: {
        flexGrow: 1,
        justifyContent: "flex-end", // Align messages to the bottom
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    messageBubble: {
        maxWidth: "80%",
        padding: 12,
        marginVertical: 4,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "transparent",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userBubble: {
        backgroundColor: "#208b8b",
        alignSelf: "flex-end",
        borderTopRightRadius: 2,
    },
    botBubble: {
        backgroundColor: "#ffffff",
        alignSelf: "flex-start",
        borderTopLeftRadius: 2,
        borderColor: "#e0e0e0",
    },
    userText: {
        color: "#fff",
        fontSize: 16,
        lineHeight: 22,
    },
    botText: {
        color: "#333",
        fontSize: 16,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#e0e0e0",
    },
    input: {
        flex: 1,
        padding: 12,
        borderRadius: 24,
        backgroundColor: "#f0f2f5",
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: "#208b8b",
        borderRadius: 24,
        padding: 12,
        aspectRatio: 1, // Makes the button square
        justifyContent: "center",
        alignItems: "center",
    },
    sendText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        transform: [{ rotate: "-45deg" }], // Rotate for a better look
    },
});