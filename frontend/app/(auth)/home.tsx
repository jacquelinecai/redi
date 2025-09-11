import auth from '@react-native-firebase/auth';
import { Button, Text, View } from 'react-native';

const Page = () => {
  const user = auth().currentUser;

  return (
    <View>
      <Text>Welcome to redi {user?.email}</Text>
      <Button title="Sign out" onPress={() => auth().signOut()} />
    </View>
  );
};
export default Page;