import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type SignupFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
  editable?: boolean;
  errorMessage?: string;
};

export default function SignupField({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  errorMessage,
}: SignupFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          !editable && styles.inputDisabled,
          errorMessage ? styles.inputError : null,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#5C5A63"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        editable={editable}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: "100%",
    gap: 8,
  },
  label: {
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.07,
    color: "#111827",
    fontFamily: "System",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    fontFamily: "System",
  },
  inputDisabled: {
    opacity: 0.5,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    fontSize: 11,
    lineHeight: 15,
    color: "#FF3B30",
    fontFamily: "System",
    marginTop: -4,
  },
});
