import firebase from "./firebase";
const db = firebase.database().ref("/users");


class pipelineDataService {
  getAll() {
    return db;
  }

  create(user) {
    return db.push(user);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}
export default new pipelineDataService();

