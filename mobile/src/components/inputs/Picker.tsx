import { Feather } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, useFormContext } from "react-hook-form";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import { useModal } from "../../hooks/useModal";
import { InputWrapper } from "./InputWrapper";

interface PickerProps extends TouchableOpacityProps {
  checked?: boolean;
  label?: string;
  name: string;
  control?: Control<any>;
  items: any[];
  getValue: (item: any) => string;
  renderInputItem: (item: any, inModal?: boolean) => React.ReactNode;
  renderModalItem?: (item: any) => React.ReactNode;
  placeholder?: string;
}

export function Picker({
  name,
  control,
  label,
  items,
  getValue,
  renderInputItem,
  renderModalItem,
  placeholder = "",
}: PickerProps) {
  const usedModalItem =
    renderModalItem || ((item) => renderInputItem(item, true));
  const { Modal, toggleModal } = useModal();
  const formMethods = useFormContext();
  const usedControl = control || formMethods.control;
  return (
    <Controller
      name={name}
      control={usedControl}
      render={({ field: { onChange, value } }) => (
        <TouchableOpacity onPress={toggleModal}>
          <InputWrapper
            label={label}
            endAdornment={
              <Feather name="chevron-down" size={20} color={colors.gray[400]} />
            }
          >
            <View className="flex-row items-center">
              {value ? (
                renderInputItem(items.find((item) => getValue(item) === value))
              ) : (
                <Text className="text-gray-400">{placeholder}</Text>
              )}
            </View>
          </InputWrapper>
          <Modal>
            <View
              className="w-[90%] bg-white rounded-lg m-auto p-4"
              onStartShouldSetResponder={(event) => true}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
            >
              {items.map((item) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(getValue(item));
                    toggleModal();
                  }}
                >
                  {usedModalItem(item)}
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
        </TouchableOpacity>
      )}
    />
  );
}
