import {IKeys} from '../Interfaces/keys/IKeys';
import {IProcessEnv} from '../Interfaces/processEnv/IProcessEnv';

const env: IProcessEnv = process.env;

const keys: IKeys = {
    ADMIN_ID: env.ADMIN_ID,
    GROUP_ID: env.GROUP_ID,
    TOKEN: env.TOKEN,
    REDIS_HOST: env.REDIS_HOST,
    REDIS_PORT: env.REDIS_PORT,
    REDIS_USER: env.REDIS_USER,
    REDIS_PASSWORD: env.REDIS_PASSWORD,
    REDIS_URL: env.REDIS_URL,
};

export default keys;