export const generateOtp = (length = 6) => {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let otp = "";
  
    for (let i = 0; i < length; i++) {
      otp += char[Math.floor(Math.random() * char.length)];
    }
  
    return otp;
  };
  