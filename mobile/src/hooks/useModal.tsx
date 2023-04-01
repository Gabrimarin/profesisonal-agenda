import React from "react";
import {
  Modal as RNModal,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export function useModal() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const Modal = ({ children }: { children: React.ReactNode }) => (
    <RNModal
      visible={isModalVisible}
      transparent
      animationType="fade"
      onRequestClose={hideModal}
      className=""
    >
      <Pressable onPress={hideModal} className="w-full h-full bg-[#00000066]">
        {children}
      </Pressable>
    </RNModal>
  );

  return { visible: isModalVisible, showModal, hideModal, toggleModal, Modal };
}
