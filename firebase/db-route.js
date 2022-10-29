
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";


export default function dbSetup(service) {

    return {
        service: service,
        insert: (data, collectionPath, customId, merge) => {
            if(customId) {
                return new Promise( async (resolve, reject) => {
                    try {
                        var docRef = doc(service, collectionPath, customId)
                        docRef = await setDoc(docRef, data, { merge: merge })
                        console.log("Document written with ID: ", docRef)
                        resolve(docRef)
                    } catch (error) {
                        reject(error)
                    }
                })
            } else {
                return new Promise( async (resolve, reject) => {
                    try {
                        var collectionRef = collection(service, collectionPath)
                        var docRef = await addDoc(collectionRef, data)
                        console.log("Document written with ID: ", docRef)
                        resolve(docRef)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            
        },
        selectAll: (collectionPath) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const querySnapshot = await getDocs(collection(db, collectionPath));
                    const result = []
                    querySnapshot.forEach((doc) => {
                        //console.log(`${doc.id} => ${doc.data()}`);
                        result.push(doc)
                    })
                    resolve(result)
                } catch (error) {
                    reject(error)
                }
            })
        },
        deleteById: (id, collectionPath) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const querySnapshot = await deleteDoc(doc(service, `${collectionPath}/${id}`))
                    resolve(querySnapshot)
                } catch (error) {
                    reject(error)
                }
            })/*
            return service
            .collection(collectionPath)
            .doc(id)
            .delete()*/
        }
    }
}