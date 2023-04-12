import * as ImagePicker from "expo-image-picker";
export function useImagePicker() {
  const pickImage = async () => {
    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };
  return {
    pickImage,
  };
}
