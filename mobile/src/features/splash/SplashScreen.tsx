import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

type SplashScreenProps = {
  loading: boolean;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ loading }) => {
  const { colors } = useTheme(); 
  return (
    <>
      {loading && (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={colors.primary}
            style={styles.indicator}
          />
          <Text style={[styles.subtitle, { color: colors.surface }]}>Loading...</Text>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  indicator: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default SplashScreen;