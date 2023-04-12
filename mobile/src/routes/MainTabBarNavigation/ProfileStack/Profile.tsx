import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../../components/Button";
import { useAppContext } from "../../../contexts/AppContext";
import { deleteValueFor } from "../../../lib/storage";
import { useNavigation } from "@react-navigation/native";
import { useImagePicker } from "../../../hooks/useImagePicker";
import { storage } from "../../../lib/firebaseConfig";
import { ref } from "firebase/storage";
import { useFirestore } from "../../../hooks/useFirestore";
import { updateProfilePicture } from "../../../api/user";
import uuid from "react-native-uuid";
import { Feather } from "@expo/vector-icons";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import axios from "axios";
import { useToast } from "../../../components/Toast";
const getImagePath = () => {
  return `images/profile_${uuid.v4()}.jpg`;
};

export function Profile() {
  const { toast } = useToast();
  const { setUser, user } = useAppContext();
  const [loadingImage, setLoadingImage] = useState(false);
  const { Modal, showModal, hideModal } = useModal();
  const profileImage = user.image_url;
  const { uploadImageUriToFirestore, deleteImageFromFirestore } =
    useFirestore();
  const { navigate } = useNavigation();
  async function signOut() {
    setUser(null);
    deleteValueFor("token");
  }
  const { pickImage } = useImagePicker();

  const onUpdateProfilePicture = async (url?: string) => {
    const user = await updateProfilePicture(url);
    setUser(user.data);
  };

  const handlePickImage = async () => {
    try {
      setLoadingImage(true);
      const result = await pickImage();
      if (result.canceled) return null;
      hideModal();
      const uri = result.assets[0].uri;
      const profileImagesRef = ref(storage, getImagePath());
      var url = await uploadImageUriToFirestore(profileImagesRef, uri);
      await onUpdateProfilePicture(url);
      toast("Profile Picture Updated", "success");
    } catch (error) {
      toast("Error Updating Profile Picture", "error");
      if (error instanceof FirebaseError) {
        console.log("FirebaseError", error);
      } else if (axios.isAxiosError(error) && url!) {
        console.log("AxiosError", error);
        await deleteImageFromFirestore(url);
      } else {
        console.log("Error", error);
      }
    } finally {
      setLoadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setLoadingImage(true);
      hideModal();
      await deleteImageFromFirestore(profileImage);
      await onUpdateProfilePicture(undefined);
      toast("Profile Picture Removed", "success");
    } catch (error) {
      toast("Error Removing Profile Picture", "error");
      console.log(error);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <View className="h-full p-2">
      <TouchableOpacity
        className="h-[150px] w-[150px] mx-auto mt-10 border rounded-full overflow-hidden flex items-center justify-center"
        onPress={showModal}
      >
        {loadingImage && <ActivityIndicator />}
        {!loadingImage && profileImage && (
          <Image
            source={{
              uri: profileImage,
            }}
            style={{
              resizeMode: "cover",
              height: "100%",
              width: "100%",
            }}
          />
        )}
        {!loadingImage && !profileImage && (
          <Feather name="smile" size={100} color="black" />
        )}
      </TouchableOpacity>
      <Text className="text-center text-2xl mt-5">{user.name}</Text>
      <View className="mt-10" />
      <Button
        text="My Activity Types"
        onPress={() => navigate("ActivityTypeHome")}
      />
      <View className="mt-auto">
        <Button onPress={signOut} variant="outlined" text="SignOut" />
      </View>
      <Modal>
        <View className="p-10 bg-white m-auto rounded-lg">
          <Button
            onPress={handlePickImage}
            startIcon={<Feather name="camera" size={24} color="white" />}
            text={
              profileImage ? "Change Profile Picture" : "Add Profile Picture"
            }
          />
          {profileImage && (
            <Button
              variant="outlined"
              style={{
                marginTop: 10,
              }}
              onPress={handleRemoveImage}
              startIcon={<Feather name="trash-2" size={24} color="black" />}
              text="Remove Profile Picture"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
