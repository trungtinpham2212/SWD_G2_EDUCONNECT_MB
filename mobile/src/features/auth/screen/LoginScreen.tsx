import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Switch, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import MainLayout from '@/layouts/MainLayout';
import { ThemeContext } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { FONTS } from '@/constants/fonts';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from '@/constants/colors'; 
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { FormLoginRequest, authService } from '@/api'; 

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 

const LoginScreen = () => { 
  const { control, handleSubmit, formState: { errors } } = useForm<FormLoginRequest>({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const { login } = useAuth();
  const onSubmit = async (data: FormLoginRequest) => {  
    try { 
      setIsLoading(true);
      const res = await authService.login(data);  
      if ('token' in res) {   
        if(res.roleId === 1){
          setErrorResponse('Tài khoản này không có quyền truy cập ứng dụng.');
          setIsLoading(false);
          return;
        }
        await login(res.token, {
          email: res.email,
          userName: res.userName,
          roleId: Number(res.roleId),
          userId: Number(res.userId),
          teacherId: res.teacherId,
          fullname: res.fullname,
          phoneNumber: res.phoneNumber,
          address: res.address,
          avatarURL: res.avatarURL   
        });  
      } else {
        console.log("Login failed: dd");
        setErrorResponse(res.message);
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert('Error', 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <MainLayout>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.container, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.innerContainer}>
            <View style={{ marginBottom: 10 }}>
              <FontAwesome5 name="graduation-cap" size={60} color={COLORS.MAIN_APP_COLOR} />
            </View>
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
                  keyboardType="web-search"
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
              labelStyle={{ color: '#fff' }}
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
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
    paddingHorizontal: 24,
    transform: [{ translateY: -20 }],
  },
  title: {
    textAlign: 'left',
    marginBottom: 32,
    fontWeight: 'bold',
    fontSize: 40,
    fontFamily: FONTS.OPENSANS_REGULAR
  },
  subtitle: {
    textAlign: 'left',
    marginBottom: 32,
    fontFamily: FONTS.OPENSANS_REGULAR
  },
  input: {
    marginBottom: 12,
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
    backgroundColor: COLORS.MAIN_APP_COLOR
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