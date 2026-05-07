import app from './app';
import env from './config/env';
import connectDB from './config/db';

const startServer = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  app.listen(env.port, () => {
    console.log(`\n🚀 Server running in ${env.nodeEnv} mode on port ${env.port}`);
    console.log(`   Health: http://localhost:${env.port}/health`);
    console.log(`   API:    http://localhost:${env.port}/api\n`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  process.exit(1);
});

startServer();
