import auth from '@react-native-firebase/auth';
import * as AuthSession from 'expo-auth-session';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Check your emails!');
    } catch (e: any) {
      const err = e as FirebaseError;
      Alert.alert('Registration failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      Alert.alert('Sign in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const request = new AuthSession.AuthRequest({
        clientId: '827839734794-ms5jes64lv5u1590imn34gnd4o9m7hj1.apps.googleusercontent.com', // Google Client ID
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'com.incubator.redi', 
        }),
        responseType: AuthSession.ResponseType.IdToken,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success') {
        const { id_token } = result.params;
        
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(id_token);
        
        // Sign-in the user with the credential
        await auth().signInWithCredential(googleCredential);
      } else if (result.type === 'cancel') {
        Alert.alert('Sign in cancelled');
      }
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      Alert.alert('Google Sign-In failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        {loading ? (
          <ActivityIndicator size={'small'} style={{ margin: 28 }} />
        ) : (
          <>
            <Button onPress={signIn} title="Login" />
            <Button onPress={signUp} title="Create account" />
            <View style={styles.divider} />
            <Button onPress={signInWithGoogle} title="Sign in with Google" />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  divider: {
    marginVertical: 10,
  },
});