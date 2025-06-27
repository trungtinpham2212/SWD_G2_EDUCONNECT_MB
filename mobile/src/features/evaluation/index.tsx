import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "react-native-paper";

const EvaluationScreen : React.FC = () => {
    const theme = useTheme();
    return(
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <Text>
                Hello Evaluation
            </Text>
        </View>
    )
};

export default EvaluationScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})