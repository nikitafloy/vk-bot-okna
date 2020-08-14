import prodKeys from './prod.keys';
import devKeys from './dev.keys';

export default process.env.NODE_ENV === 'production' ?  prodKeys : devKeys;