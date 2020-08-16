import {IKeys} from '../Interfaces/keys/Ikeys';
import {IProcessEnv} from '../Interfaces/processEnv/IprocessEnv';

const env: IProcessEnv = process.env;

const keys: IKeys = {
    GROUP_ID: env.GROUP_ID,
    TOKEN: env.TOKEN,
};

export default keys;