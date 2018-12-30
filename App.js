/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 /*This is the navigation buildup of the SparkEd parent side application*/
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen';
import NewStoriesScreen from './src/screens/NewStoriesScreen';
import CharactersScreen from './src/screens/CharactersScreen';
import PersonalizeScreen from './src/screens/PersonalizeScreen';
import PublishStoryScreen from './src/screens/PublishStoryScreen';
import InputScreen from './src/screens/InputScreen';
import ScriptScreen from './src/screens/ScriptScreen';
import ChildResponseScreen from './src/screens/ChildResponseScreen';

//the stack navigator for the personalization screens
const PersonalizeNav = createStackNavigator({
  Personalize: {
    screen: PersonalizeScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  Characters: {
    screen: CharactersScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  Input: {
    screen: InputScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  Script: {
    screen: ScriptScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  PublishStory: {
    screen: PublishStoryScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
})

//stack navigator for creating a new story
const NewStoriesNav = createStackNavigator({
  NewStories: {
    screen: NewStoriesScreen,
    navigationOptions: () => ({
    header: null,
    }),
  },
  Personalize: {
    screen: PersonalizeNav,
    navigationOptions: () => ({
      header: null,
    }),
  }
});

//drawer navigator for the home screen
const HomeDrawerNav = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
  },
  Settings: {
    screen: HomeScreen,
  }
});

//opening screen/navigation start point
export default createStackNavigator({
  Home: {
    screen: HomeDrawerNav,
    navigationOptions: () => ({
      header: null,
    }),
  },
  ChildResponse: {
    screen: ChildResponseScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  NewStories: {
    screen: NewStoriesNav,
    navigationOptions: () => ({
      header: null,
    }),
  },
},{
  mode: 'card',
  headerMode: 'screen',
});