import { useThemeContext } from '@/context/themeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Lottie from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = '@onboarding_complete';

const OnBoardingScreen = () => {
  const router = useRouter();
  const { theme } = useThemeContext();
  
  const handleDone = async () => {
    try {
      
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      
      router.replace('/authscreen');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/authscreen');
    }
  };


  const Dots = ({ selected }: { selected: boolean }) => {
    return (
      <View
        style={{
          width: selected ? 28 : 8,
          height: 8,
          marginHorizontal: 4,
          borderRadius: 4,
          backgroundColor: selected 
            ? (theme === 'dark' ? '#F3F4F6' : '#1F2937')
            : (theme === 'dark' ? 'rgba(243, 244, 246, 0.25)' : 'rgba(31, 41, 55, 0.25)'),
        }}
      />
    );
  };

 
  const DoneButton = ({ ...props }) => (
    <TouchableOpacity
      className={`flex items-center justify-center rounded-full w-16 h-16 mx-10 ${
        theme === 'dark' ? 'bg-gray-100' : 'bg-gray-100'
      }`}
      onPress={props.onPress}
    >
      <Ionicons 
        name="arrow-forward" 
        size={24} 
        color={theme === 'dark' ? '#1F2937' : '#1F2937'} 
      />
    </TouchableOpacity>
  );

 
  const SkipButton = ({ ...props }) => (
    <TouchableOpacity
      style={styles.skipButton}
      onPress={props.onPress}
    >
      <Text className={`text-base font-medium ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>Skip</Text>
    </TouchableOpacity>
  );

 
  const NextButton = ({ ...props }) => (
    <TouchableOpacity
      className={`px-6 py-3 rounded-full mr-4 min-w-[100px] items-center justify-center ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}
      onPress={props.onPress}
    >
      <Text className={`text-base font-semibold ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`}>Next</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        DotComponent={Dots}
        bottomBarHighlight={false}
        bottomBarHeight={80}
        containerStyles={styles.onboardingContainer}
        imageContainerStyles={styles.imageWrapper}
        DoneButtonComponent={DoneButton}
        SkipButtonComponent={SkipButton}
        NextButtonComponent={NextButton}
        pages={[
          {
            backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB',
            image: (
              <View style={styles.imageContainer}>
                <View style={styles.animationWrapper}>
                  <Lottie
                    autoPlay
                    loop
                    style={styles.lottie}
                    source={require('../assets/animations/sendmail.json')}
                  />
                </View>
              </View>
            ),
            title: 'Complete Challenges',
            subtitle: 'Take on daily and weekly financial challenges to earn badges and level up your savings game.',
            titleStyles: {
              ...styles.title,
              color: theme === 'dark' ? '#F3F4F6' : '#111827',
            },
            subTitleStyles: {
              ...styles.subtitle,
              color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
            },
          },
          {
            backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB',
            image: (
              <View style={styles.imageContainer}>
                <View style={styles.animationWrapper}>
                  <Lottie
                    autoPlay
                    loop
                    style={styles.lottie}
                    source={require('../assets/animations/Task Loader.json')}
                  />
                </View>
              </View>
            ),
            title: 'Unlock Achievements',
            subtitle: 'Reach milestones, collect rewards, and build your trophy collection while mastering your finances.',
            titleStyles: {
              ...styles.title,
              color: theme === 'dark' ? '#F3F4F6' : '#111827',
            },
            subTitleStyles: {
              ...styles.subtitle,
              color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
            },
          },
          {
            backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB',
            image: (
              <View style={styles.imageContainer}>
                <View style={styles.animationWrapper}>
                  <Lottie
                    autoPlay
                    loop
                    style={styles.lottie}
                    source={require('../assets/animations/Tracking of assets.json')}
                  />
                </View>
              </View>
            ),
            title: 'Compete & Win',
            subtitle: 'Climb the leaderboards, compete with friends, and become the ultimate finance champion.',
            titleStyles: {
              ...styles.title,
              color: theme === 'dark' ? '#F3F4F6' : '#111827',
            },
            subTitleStyles: {
              ...styles.subtitle,
              color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
            },
          },
        ]}
      />
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  onboardingContainer: {
    paddingHorizontal: 0,
  },
  imageWrapper: {
    paddingBottom: 0,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height * 0.55,
    paddingHorizontal: 20,
  },
  animationWrapper: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    paddingHorizontal: 30,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    paddingHorizontal: 40,
    textAlign: 'center',
    lineHeight: 26,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});