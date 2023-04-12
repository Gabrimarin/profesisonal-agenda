import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../lib/firebaseConfig";

export function useFirestore() {
  async function uploadImageUriToFirestore(
    ref: StorageReference,
    imageUri: string
  ) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const uploadTask = await uploadBytes(ref, blob);
    const url = await getDownloadURL(uploadTask.ref);
    return url;
  }

  async function deleteImageFromFirestore(url: string) {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  }

  return {
    uploadImageUriToFirestore,
    deleteImageFromFirestore,
  };
}
