export const validateUserInput = (username, full_name, accountNumber, IDNumber, password) => {
  const errors = [];

  if (!username || !full_name || !accountNumber || !IDNumber || !password) {
    errors.push('All fields (username, full name, account number, ID number, password) are required');
    return { isValid: false, errors };
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  const fullNameRegex = /^[a-zA-Z .,'-]{2,50}$/;
  const accountNumberRegex = /^\d{6,20}$/;
  const idNumberRegex = /^\d{13}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

  if (!usernameRegex.test(username)) {
    errors.push('Username must be 3-16 characters and contain only letters, numbers, or underscores');
  }
  if (!fullNameRegex.test(full_name)) {
    errors.push('Full name contains invalid characters');
  }
  if (!accountNumberRegex.test(accountNumber)) {
    errors.push('Account number must be 6-20 digits');
  }
  if (!idNumberRegex.test(IDNumber)) {
    errors.push('ID Number must be exactly 13 digits');
  }
  if (!passwordRegex.test(password)) {
    errors.push('Password must be at least 6 characters and contain at least one letter and one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeUserInput = (reqBody) => {
  const allowedFields = ["username", "full_name", "accountNumber", "IDNumber", "password"];
  const sanitized = {};
  
  Object.keys(reqBody).forEach(key => {
    if (allowedFields.includes(key)) {
      sanitized[key] = reqBody[key];
    }
  });
  
  return sanitized;
};

