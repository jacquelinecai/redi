import auth from '@react-native-firebase/auth';
import { Button, Text, View } from 'react-native';

const Page = () => {
  const user = auth().currentUser;

  const handleSignOut = async () => {
    try {
      // With Expo's auth session, we only need to sign out from Firebase
      // The Google session will be handled automatically
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Welcome to redi {user?.email}
      </Text>
      <Button title="Sign out" onPress={handleSignOut} />
    </View>
  );
};

export default Page;