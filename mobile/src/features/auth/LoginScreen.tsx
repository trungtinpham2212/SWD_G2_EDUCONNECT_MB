import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Switch, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import MainLayout from '@/layouts/MainLayout';
import { ThemeContext } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';

interface FormData {
  username: string;
  password: string;
}

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const onSubmit = (data: FormData) => {
    Alert.alert('Đăng nhập', `Email: ${data.username}\nMật khẩu: ${data.password}`);
  };
  return (
    <>
      <MainLayout>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.container, { backgroundColor: theme.colors.surface }]}
        >

          <View style={styles.innerContainer}>
            <Text variant="headlineLarge" style={[styles.title, { color: (theme.colors as any).titleBig }]}>
              Welcome to EduConnect
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to connect with teachers and parents
            </Text>

            <Controller
              control={control}
              name="username"
              rules={{
                required: 'Please enter your username',
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Username"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.username}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="default"
                />
              )}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
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
          <View style={styles.themeToggleContainer}> 
            {isDarkTheme ? <Feather name="moon" size={24} color="white" /> : <Feather name="sun" size={24} color="black" />}

            <Switch
              value={isDarkTheme}
              onValueChange={toggleTheme}
              thumbColor={isDarkTheme ? '#fff' : theme.colors.primary}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
            />
          </View>
        </KeyboardAvoidingView>
      </MainLayout>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  innerContainer: {
    // flex: 1,
    paddingHorizontal: 24,
    transform: [{ translateY: -20 }],
  },
  title: {
    textAlign: 'left',
    marginBottom: 32,
    fontWeight: 'bold',
    fontSize: 40,
  },
  subtitle: {
    textAlign: 'left',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    marginBottom: 12,
    // backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 8,
    top: 6, 
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
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  themeText: {
    marginRight: 8,
    fontSize: 16,
  },
});

export default LoginScreen;