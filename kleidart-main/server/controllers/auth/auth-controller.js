const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const nodemailer = require("nodemailer");
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";
const BASE_URL = process.env.BASE_URL || "http://localhost";

// Helper: Send Email
const sendEmail = async (email, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, // Or 587 if using STARTTLS
    secure: true, // Use SSL/TLS
    // service: "Gmail", // or any email service like Outlook, etc.
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent, 
  });
};


//register
const registerUser = async (req, res) => {
  const { userName, email, phone, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      phone,
      password: hashPassword,
    });

    await newUser.save();

    await sendEmail(
      newUser.email,
      "Welcome to Kleidart - Let's Make Gifting Special!",
      `
        <html>
          <body>
            <p>Welcome to Kleidart! We're excited to help you make gifting effortless and meaningful.</p>
    
            <p><strong>✨ Here's how you can get started:</strong></p>
            <ul>
              <li>🎁 <strong>Explore Unique Gifts</strong> - Browse our curated collection.</li>
              <li>📦 <strong>Send a Gift in a Few Clicks</strong> - Seamless ordering & delivery.</li>
              <li>💌 <strong>Personalize Your Gifts</strong> - Add messages & customizations.</li>
            </ul>
    
            <p>Start exploring now: <a href='https://www.kleidart.com/auth/login'>Login</a></p>
    
            <p>Need help? Our support team is here for you - reach us at <a href="mailto:info@kleidartgifts.com">info@kleidartgifts.com</a>.</p>
    
            <p>Let's make every occasion extra special! 🎉</p>
    
            <p>Best,<br />
            Kleidart Gifts</p>
          </body>
        </html>
      `
    );
    

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Invalid username or password!",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      SECRET_KEY,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { 
      httpOnly: true, 
      secure: false,
    })

    res.cookie("isUserAuthenticated", true, { 
      httpOnly: false, 
      secure: false,
    })
    
    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  try {

    res.cookie("isUserAuthenticated", false, { 
      httpOnly: false, 
      secure: false,
    })

    res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.log(error)
  }
};


// forget pass

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // console.log(email)
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    // console.log("user_id", user._id)
    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "15m" });
    // console.log("resetToken", resetToken)
    
    const resetLink = `${BASE_URL}/auth/reset-password/?token=${resetToken}`;
    // console.log("resetLink", resetLink)

    // Send reset link via email
    await sendEmail(
      email,
      "Password Reset",
      `You requested a password reset. Click the link to reset your password: <a href='${resetLink}'> Link </a> `
    );

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { token } = req.body;
  console.log("param token", token)
  const { password } = req.body;
  console.log("newPassword", password)

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log("decoded", decoded)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashedPassword", hashedPassword)
    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token", error });
  }
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, resetPassword, forgotPassword, authMiddleware };
