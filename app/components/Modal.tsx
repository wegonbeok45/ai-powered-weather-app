import { useEffect, useRef } from 'react';
import { Animated, Easing, Modal as RNModal, TouchableWithoutFeedback, View } from 'react-native';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isVisible, onClose, children }: ModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  return (
    <RNModal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View className="flex-1 justify-center items-center">
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={{ opacity: opacityAnim }}
            className="absolute inset-0 bg-black/60"
          />
        </TouchableWithoutFeedback>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
}