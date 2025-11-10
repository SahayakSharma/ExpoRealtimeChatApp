import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import { gradientBackgroundColors } from "@/lib/global/colorTheme";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PhoneInputField from "./IncompleteProfile/PhoneInputField";
import ProfileActionButton from "./IncompleteProfile/ProfileActionButton";
import {
    formatFieldName,
    getFieldIcon,
    getFieldKeyboardType,
    validateProfileForm
} from "./IncompleteProfile/profileHelpers";
import ProfileInputField from "./IncompleteProfile/ProfileInputField";

interface IncompleteProfileScreenProps {
    missingFields: string[];
    userId: string;
    onProfileUpdated: () => Promise<void>;
    availableAuthData: Record<string, string>;
}

export default function IncompleteProfileScreen({
    missingFields,
    userId,
    onProfileUpdated,
    availableAuthData
}: IncompleteProfileScreenProps) {
    const [formData, setFormData] = useState<Record<string, string>>(
        missingFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async () => {
        const validation = validateProfileForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const instance = FirebaseAppConfig.getInstance();
            const db = instance.getDb();

            const updateData: Record<string, string> = {};
            
            missingFields.forEach(field => {
                if (formData[field]) {
                    updateData[field] = formData[field];
                }
            });

            Object.entries(availableAuthData).forEach(([field, value]) => {
                if (value) {
                    updateData[field] = value;
                }
            });

            await updateDoc(doc(db, 'Users', userId), updateData);

            await onProfileUpdated();
            
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrors({
                general: "Failed to update profile. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await getAuth().signOut();
        }
        catch (error) {
            console.log("Error signing out:", error);
        }
    };

    return (
        <LinearGradient
            colors={gradientBackgroundColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="px-6 pt-8 pb-6">
                            <View className="items-center mb-6">
                                <View className="bg-c4/20 p-5 rounded-full mb-4">
                                    <Ionicons name="person-circle-outline" size={48} color="#C9B59C" />
                                </View>
                                <Text className="text-gray-800 text-3xl font-bold mb-2 text-center">
                                    Complete Your Profile
                                </Text>
                                <Text className="text-gray-600 text-base text-center max-w-sm">
                                    Please provide the following information to continue
                                </Text>
                            </View>

                            <View className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-6 border border-c3/30">
                                <View className="flex-row items-start">
                                    <View className="bg-c4/20 p-2 rounded-full mr-3">
                                        <Ionicons name="information-circle" size={20} color="#C9B59C" />
                                    </View>
                                    <Text className="flex-1 text-gray-700 text-sm leading-5">
                                        Your information helps us personalize your experience and
                                        connect you with others.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Form Section */}
                        <View className="px-6 flex-1">
                            {/* General Error Message */}
                            {errors.general && (
                                <View className="bg-red-50/90 border-2 border-red-400 rounded-2xl p-4 mb-4">
                                    <View className="flex-row items-start">
                                        <Ionicons name="alert-circle" size={20} color="#dc2626" />
                                        <Text className="flex-1 text-red-700 text-sm ml-3 leading-5">
                                            {errors.general}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {missingFields.map((field) => {
                                if (field === "phone_number") {
                                    return (
                                        <PhoneInputField
                                            key={field}
                                            label={formatFieldName(field)}
                                            placeholder="Enter phone number"
                                            value={formData[field] || ""}
                                            onChangeText={(value) => handleInputChange(field, value)}
                                            error={errors[field]}
                                        />
                                    );
                                }

                                return (
                                    <ProfileInputField
                                        key={field}
                                        label={formatFieldName(field)}
                                        placeholder={`Enter your ${formatFieldName(field).toLowerCase()}`}
                                        value={formData[field] || ""}
                                        onChangeText={(value) => handleInputChange(field, value)}
                                        icon={getFieldIcon(field)}
                                        keyboardType={getFieldKeyboardType(field)}
                                        error={errors[field]}
                                    />
                                );
                            })}

                            <View className="mt-6 gap-3">
                                <ProfileActionButton
                                    title="Save & Continue"
                                    onPress={handleSubmit}
                                    variant="primary"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                />

                                <ProfileActionButton
                                    title="Sign Out"
                                    onPress={handleSignOut}
                                    variant="secondary"
                                    disabled={isSubmitting}
                                />
                            </View>

                            <View className="mt-8 mb-4">
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="shield-checkmark" size={16} color="#6b7280" />
                                    <Text className="text-gray-500 text-xs ml-2">
                                        All fields are required to access the app
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}
