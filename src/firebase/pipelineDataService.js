import firebase from "./firebase";
const db = firebase.database();

class PipelineDataService {

  getPipeline() {
    var uid = firebase.auth().currentUser.uid;
    let pipelines = [];
    db.ref('users/' + uid + '/pipelines/').once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          pipelines.push(childSnapshot.val());
        })
      }
      );
    return pipelines;
  }

  createUser(uid, user) {
    return db.ref('users/' + uid).set(user);
  }

  updatePipeline(key, value) {
    var uid = firebase.auth().currentUser.uid;
    return db.ref('users/' + uid + '/pipelines/').child(key).update(value);
  }

  getUserName() {
    var uid = firebase.auth().currentUser.uid;
    let name;
    db.ref('users/' + uid).once("value").then((snapshot) => {
      name = snapshot.val().userName
      console.log(name)
    });

    return name
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}
export default new PipelineDataService();

