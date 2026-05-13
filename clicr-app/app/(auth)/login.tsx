import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function requestOtp() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      setOtpSent(true)
    }

    setLoading(false)
  }

  async function verifyOtp() {
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (error) {
      Alert.alert('Invalid code', error.message)
    }

    setLoading(false)
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-gray-800 mb-2">
        Welcome to Clicr
      </Text>
      <Text className="text-gray-500 mb-8">
        {otpSent ? 'Enter the code sent to your email' : 'Enter your email to sign in'}
      </Text>

      {!otpSent ? (
        <>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
            onPress={requestOtp}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-base">
              {loading ? 'Sending...' : 'Send Code'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base tracking-widest text-center text-xl"
            placeholder="000000"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={8}
          />
          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
            onPress={verifyOtp}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-base">
              {loading ? 'Verifying...' : 'Verify Code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => setOtpSent(false)}
          >
            <Text className="text-gray-500">Use a different email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
