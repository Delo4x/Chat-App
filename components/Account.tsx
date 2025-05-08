import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text} from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { FlashList } from "@shopify/flash-list";


export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [users, setUsers] = useState<{id: string}[]> ([])



  useEffect(() => {
    if (session) getProfile()
    if (session) getAllUsers()
  }, [session])

  async function getAllUsers() {
    const {data, error} = await supabase.from('profiles').select('id')
    if (error) console.log(error.message)
    setUsers(data?? [])
  }



  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled 
          inputStyle={{ color: 'white' }}
          labelStyle={{ color: 'white' }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)}
          inputStyle={{ color: 'white' }}
          labelStyle={{ color: 'white' }}
          placeholderTextColor="gray"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)}
          inputStyle={{ color: 'white' }}
          labelStyle={{ color: 'white' }}
          placeholderTextColor="gray"
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button 
          title="Sign Out" 
          onPress={() => supabase.auth.signOut()}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
      <View style={[styles.verticallySpaced, {height: 200}]}>
        <FlashList
            data={users}
            renderItem={({ item }) => <Text style={{ color: 'white' }}>{item.id}</Text>}
            estimatedItemSize={200}
        />
      </View>
      <View style={styles.tabar}>
        <Text style={{ color: 'white' }}>Tabar</Text>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    backgroundColor: 'black',
    flex: 1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  tabar: {
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5
  },
  buttonText: {
    color: 'white'
  }
})