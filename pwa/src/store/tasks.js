import PouchyStore from 'pouchy-store';
import config from '../config';

class TaskStore extends PouchyStore {
    get name() {
        return this._name;
      }
   
      setName(name) {
        this._name = name;
      }

    get urlRemote() {
        return config.couchDBUrl;
    }

    get optionsRemmote() {
        return {
            auth: config.couchDBAuth,
        };
    }


}

export default new TaskStore()