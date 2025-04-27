import { View, Text, StyleSheet } from 'react-native';
import App from '../App';


export function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text>Welcome to the App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
