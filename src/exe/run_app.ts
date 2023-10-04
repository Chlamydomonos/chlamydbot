import app from '../app';
import * as fs from 'fs';
import * as path from 'path';

app.start();

(global as any).chlamydbot = app;

function listJsFiles(rootDir: string) {
    const result: string[] = [];
    const files = fs.readdirSync(rootDir);
    for (const file of files) {
        const filePath = path.join(rootDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            result.push(...listJsFiles(filePath));
        } else if (stat.isFile() && path.extname(filePath) === '.js') {
            result.push(filePath);
        }
    }
    return result;
}

const scripts = listJsFiles(path.resolve(__dirname, '..', '..', 'scripts'));

for (const script of scripts) {
    require(script);
}

app.eventEmitter.finishRegistry();
app.startPhase2();

process.on('SIGINT', () => {
    console.log('SIGINT received, stopping...');
    app.stop();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, stopping...');
    app.stop();
    process.exit();
});

process.on('uncaughtException', (e) => {
    console.log(`Uncaught exception: ${e}`);
    app.stop();
    process.exit();
});

process.on('unhandledRejection', (e) => {
    console.log(`Unhandled rejection: ${e}`);
    app.stop();
    process.exit();
});
