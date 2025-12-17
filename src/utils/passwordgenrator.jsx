import bcrypt from 'bcrypt';

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function createHashedPassword() {
  const password = generatePassword(16); 
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return { plainPassword: password, hashedPassword };
}



 module.exports ={createHashedPassword}