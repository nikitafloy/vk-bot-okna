import {Ikeys} from '../Interfaces/keys/Ikeys';
import {IprocessEnv} from '../Interfaces/processEnv/IprocessEnv';

const env: IprocessEnv = process.env;

const keys: Ikeys = {
    GROUP_ID: env.GROUP_ID,
    TOKEN: env.TOKEN,
};

export default keys;