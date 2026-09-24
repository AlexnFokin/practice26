import dotenv from 'dotenv';
import app from 'App';
import sequelize from './config/database';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '7002', 10);

const testDatabaseConnection = async (): Promise<boolean> => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to PostgreSQL database');
        return true;
    } catch (error: any) {
        console.error('Error connecting to PostgreSQL database:', error.message);
        return false;
    }
};

const start = async (): Promise<void> => {
    try {
        const dbConnected = await testDatabaseConnection();

        if (dbConnected) {
            app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        } else {
            console.log('Server not started due to database connection error');
            process.exit(1);
        }
    } catch (error) {
        console.log(error);
    }
};

start();
