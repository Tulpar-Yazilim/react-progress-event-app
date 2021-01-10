import firebase from "../db/firebase";
const db = firebase.ref("/progress-events");

class ProgressEventDataService {
  getAll() {
    return db;
  }

  get(key) {
    return db.child(key);
  }

  create(progressEvent) {
    return db.push(progressEvent);
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

export default new ProgressEventDataService();
