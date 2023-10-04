import * as fs from 'fs';
import * as path from 'path';

function listFiles(rootDir: string): string[] {
    const result: string[] = [];
    const queue: string[] = [rootDir];
    while (queue.length > 0) {
        const dir = queue.pop()!;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                queue.push(filePath);
            } else {
                result.push(path.relative(rootDir, filePath));
            }
        }
    }
    return result;
}

const rootDir = process.argv[2];
const destRootDir = process.argv[3];

const files = listFiles(rootDir);

for (const file of files) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(destRootDir, file);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
}
