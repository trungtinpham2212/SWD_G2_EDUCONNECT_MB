import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import MainLayout from '@/layouts/MainLayout';

interface FormData {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const onSubmit = (data: FormData) => {
    // Xử lý đăng nhập tại đây
    Alert.alert('Đăng nhập', `Email: ${data.email}\nMật khẩu: ${data.password}`);
  };
  return (
    <> 
         <KeyboardAvoidingView
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome to EduConnect
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign in to connect with teachers and parents
        </Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Please enter your email', 
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Please enter a valid email address',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              error={!!errors.email}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Please enter your password', 
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                label="password"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                secureTextEntry={secureTextEntry}
                error={!!errors.password}
                style={styles.passwordInput}
                autoCapitalize="none"
              />
              <IconButton
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
                style={styles.eyeIcon}
              />
            </View>
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
        {errorResponse && (
          <Text style={styles.errorText}>{errorResponse}</Text>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={{ color: '#000' }}
        >
          Sign in
        </Button>
      </View>
    </KeyboardAvoidingView>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  innerContainer: {
    // flex: 1,
    paddingHorizontal: 24,
    transform: [{ translateY: -20 }],
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#4bfcff',  
  },
  buttonContent: {
    paddingVertical: 8, 

  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
    marginLeft: 8,
    fontSize: 14,
  },
});

export default LoginScreen;