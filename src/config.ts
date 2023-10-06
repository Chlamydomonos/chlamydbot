import hjson from 'hjson';
import * as path from 'path';
import * as fs from 'fs';

const configPath = path.resolve(__dirname, '..', 'config', 'config.hjson');

const config = hjson.parse(fs.readFileSync(configPath, 'utf-8'));

export const MCL_HOST = config.MCL_HOST as string;
export const MCL_PORT = config.MCL_PORT as number;
export const QQ = config.QQ as number;
export const VERIFY_KEY = config.VERIFY_KEY as string;
export const BACKEND_PORT = config.BACKEND_PORT as number;
export const DB_HOST = config.DB_HOST as string;
export const DB_PORT = config.DB_PORT as number;
export const DB_USER = config.DB_USER as string;
export const DB_PASSWORD = config.DB_PASSWORD as string;
export const DB_DATABASE = config.DB_DATABASE as string;
