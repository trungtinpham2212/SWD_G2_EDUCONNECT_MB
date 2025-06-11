import React from 'react';
import { Pressable, ViewStyle, GestureResponderEvent, StyleProp } from 'react-native';

type Props = {
    children: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>; // ✅ sửa ở đây
};

const CustomTabButton = ({ children, onPress, style }: Props) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center', 
                     opacity: pressed ? 0.6 : 1,
                },
                style,
            ]}
        >
            {children}
        </Pressable>
    );
};

export default CustomTabButton;
