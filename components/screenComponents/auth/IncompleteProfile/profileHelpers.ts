export function validateProfileField(
  fieldName: string,
  value: string
): true | string {
  if (!value || value.trim() === "") {
    return `${fieldName.replace(/_/g, " ")} is required`;
  }

  switch (fieldName) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      break;

    case "phone_number":
      const phoneWithoutCode = value.replace(/^\+\d{1,4}/, "").replace(/[\s\-\(\)]/g, "");
      if (!/^\d{7,15}$/.test(phoneWithoutCode)) {
        return "Please enter a valid phone number (7-15 digits)";
      }
      break;

    case "name":
      if (value.trim().length < 2) {
        return "Name must be at least 2 characters";
      }
      break;
  }

  return true;
}

export function validateProfileForm(data: {
  name?: string;
  email?: string;
  phone_number?: string;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  Object.entries(data).forEach(([field, value]) => {
    const validation = validateProfileField(field, value || "");
    if (validation !== true) {
      errors[field] = validation;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getFieldIcon(fieldName: string): any {
  switch (fieldName) {
    case "name":
      return "person-outline";
    case "email":
      return "mail-outline";
    case "phone_number":
      return "call-outline";
    default:
      return "information-circle-outline";
  }
}

export function getFieldKeyboardType(
  fieldName: string
): "default" | "email-address" | "phone-pad" {
  switch (fieldName) {
    case "email":
      return "email-address";
    case "phone_number":
      return "phone-pad";
    default:
      return "default";
  }
}
