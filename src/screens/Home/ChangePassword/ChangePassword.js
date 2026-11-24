import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { changePassword } from '../../../services/authService';
import { i18n } from '../../../translations/i18n';
import { colors } from '../../../utils/colors';
import { validatePasswordChange } from '../../../utils/passwordChange';

const theme = {
  roundness: 12,
  colors: { ...colors, background: 'white', placeholder: '#dedede', text: '#707070' },
};

/**
 * Password change of the logged-in account (needs a connection).
 * The session and offline data are kept: the server keeps the same token.
 */
function ChangePassword() {
  const navigation = useNavigation();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [hidden, setHidden] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field) => (value) => {
    setForm({ ...form, [field]: value });
    setError(null);
  };

  const submit = async () => {
    const problem = validatePasswordChange(form);
    if (problem) {
      setError(i18n.t(problem));
      return;
    }
    setLoading(true);
    const result = await changePassword(form.current, form.next);
    setLoading(false);
    if (result.error) {
      setError(result.error.offline ? i18n.t('password_change_offline') : String(result.error));
      return;
    }
    setForm({ current: '', next: '', confirm: '' });
    setSuccess(true);
  };

  const field = (name, label) => (
    <TextInput
      theme={theme}
      mode="outlined"
      label={label}
      value={form[name]}
      onChangeText={update(name)}
      secureTextEntry={hidden}
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.input}
      right={<TextInput.Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} onPress={() => setHidden(!hidden)} />}
    />
  );

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={styles.success}>{i18n.t('password_change_done')}</Text>
        <Button mode="contained" color={colors.primary} onPress={() => navigation.goBack()}>
          {i18n.t('back')}
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.help}>{i18n.t('password_change_help')}</Text>
        {field('current', i18n.t('current_password'))}
        {field('next', i18n.t('new_password'))}
        {field('confirm', i18n.t('confirm_new_password'))}
        {error && <Text style={styles.error}>{error}</Text>}
        <Button
          mode="contained"
          color={colors.primary}
          onPress={submit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {i18n.t('change_password')}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: 'white', flexGrow: 1 },
  help: { color: colors.secondary, marginBottom: 16, fontSize: 14 },
  input: { marginBottom: 12, backgroundColor: 'white' },
  error: { color: 'red', marginBottom: 12 },
  success: { color: colors.primary, fontSize: 16, marginBottom: 24, textAlign: 'center' },
  button: { marginTop: 8 },
});

export default ChangePassword;
