const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db.config.js');

const app = express();

// ✅ CORS config — clean and PATCH-friendly
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend to make requests
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/', require('./routes/user.routes.js'));
app.use('/', require('./routes/blog.routes.js'));

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running on port ${PORT}`);
});
