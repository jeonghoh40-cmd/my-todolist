const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../../swagger/swagger.json');
require('dotenv').config();

const { testConnection } = require('./db/connection');
const authRoutes = require('./routes/auth.routes');
const todosRoutes = require('./routes/todos.routes');

// Import composition root
const compositionRoot = require('./composition-root');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Request/Response 로깅 미들웨어
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log(`  Headers:`, JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    // 비밀번호는 로그에서 제외
    const bodyToLog = { ...req.body };
    if (bodyToLog.password) bodyToLog.password = '***';
    console.log(`  Body:`, JSON.stringify(bodyToLog, null, 2));
  }

  // 응답 후 로그
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// 인증 라우터 등록
app.use('/api/auth', authRoutes);

// 할일 라우터 등록
app.use('/api/todos', todosRoutes);

const startServer = async () => {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log('Clean Architecture backend initialized successfully');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
