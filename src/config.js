import * as url from 'url';
import path, { dirname } from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const config ={
    PORT:8080,
    DIRNAME: url.fileURLToPath(new URL('.',import.meta.url)),
    BASE_PATH: path.join(__dirname, '..')
}

export default config