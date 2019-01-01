# SparkEd Parent Application

SparkEd is an educational app that allows parents to personalize their child’s learning experience. Unlike other learning apps, SparkEd provides parents with the opportunity to customize the lessons and skills they teach their children, relative to their own values and beliefs. It’s designed for the remote parenting space, and ideal for parents and young children who are unable to spend time together because of location differences or time schedules.

This repository contains the code for the parent side react-native application prototype. This application allows parents to customize certain aspects of an educational story-based game.  

## Project buildup
The starting point for the code in this project is the App.js file in the root folder and it defines the navigation logic of the application. The rendering code for each screen can be found from the ./src/screens folder. The code for self-made components can be found from the ./src/components folder and the API connection calls can all be found from the ./src/api folder. Icons used in the code (e.g. add new icon) have been taken from flaticon.com, the specific images can be found in the ./assets folder.

## Dependencies

* react-navigation - (https://github.com/react-navigation/react-navigation)
* react-native-paper - (https://github.com/callstack/react-native-paper)
* react-native-audio - (https://github.com/jsierles/react-native-audio)
* react-native-sound - (https://github.com/zmxv/react-native-sound)
* react-native-fetch-blob - (https://github.com/wkh237/react-native-fetch-blob), This version is no longer maintainer, but a maintained fork "rn-fetch-blob" could also be used (https://github.com/joltup/rn-fetch-blob)

## Screenshots of the application

<img src=https://github.com/BetyMehide/SparkEd-ParentApp/blob/master/screenshots/HomeScreen.png height="520" alt="Home screen"> <img src=https://github.com/BetyMehide/SparkEd-ParentApp/blob/master/screenshots/NewStoriesScreen.png height="520" alt="Add new stories screen"> 
<img src=https://github.com/BetyMehide/SparkEd-ParentApp/blob/master/screenshots/PersonalizeScreen.png height="520" alt="Personalization menu screen"> <img src=https://github.com/BetyMehide/SparkEd-ParentApp/blob/master/screenshots/CharactersScreen.png height="520" alt="Character personalization screen"> 
<img src=https://github.com/BetyMehide/SparkEd-ParentApp/blob/master/screenshots/InputScreen.png height="520" alt="Input item personalization screen"> <img src=https://github.com/BetyMehide/SparkEd-ParentApp/blob/master/screenshots/ScriptScreen.png height="520" alt="Script personalization screen"> 
<img src=https://github.com/BetyMehide/SparkEd-ParentApp/blob/master/screenshots/PublishStoryScreen.png height="520" alt="Save and publish story screen"> 
