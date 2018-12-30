import React, { Component } from 'react';
import {StyleSheet,View,Picker,Alert, ScrollView} from 'react-native';
import {Headline, Colors, IconButton, Button, Paragraph, TextInput} from 'react-native-paper';
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import { DbDelete, DbScriptGet, DbScriptPost, dbQueryBlobGet, DbQueryBlobPost } from '../api/api';
import RecordingComponent from '../components/RecordingComponent';

//Audio recording and playing code taken from: https://github.com/jsierles/react-native-audio/blob/master/AudioExample/AudioExample.js

export default class InputScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      scene: 0,
      isModalVisible: false,
      scenes: [
          {"name": "Intro", "text": "It was a great day for a picnic."},
          {"name": "Picnic", "text": "But wait, what\'s this? This is a stray dog, it\'s dirty, shoo it away. He looks hungry, we should feed him. Let\'s play with him."},
          {"name": "Play", "text": "The children played with him and taught him to sit up. They named him Willy. Let\'s play some more, try to throw the ball!"},
          {"name": "Going home", "text": "Great Throw! \"Let\'s take Willy home,\" said the children. \"No,\" said the father. \"He must belong to somebody and they would miss him\" explained the mother." },
          {"name": "The way home", "text": "On the way home the girl said, \"Maybe Willy doesn\'t belong to anybody.\""},
          {"name": "During the week", "text": "During the week all the family had Willy on their minds."},
          {"name": "Back to park", "text": "When they went back to the park on Staruday they saw Willy, but he was in a big hurry."},
          {"name": "Animal control", "text": "\"He has no collar, he has no leash,\" said the dog warden. \"This dog is a stray. He doesn\"t belong to anybody.\" We have to help Willy, let\'s give him a collar to show that he\'s ours. Can you draw a collar?"},
          {"name": "Take Willy home", "text": "They took Willy home. And after that..."},
          {"name": "The End", "text": "They introduced him to the neighborhood, where he met some very interesting dogs."},
      ],
      voiceover: [
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
          {"recLength": 0, "blobName": undefined, "blobSize": 0},
      ],
    }
  }

  _setVoiceoverState(that){
    return (curVoiceover) => {
      that.setState({voiceover: curVoiceover});
    }
  }

  //get current script information from the database
  componentWillMount(){
    return DbScriptGet(this.props.navigation.getParam('instance'))
      .then((responseJson) => {
        if (responseJson){
          let curText = this.state.scenes;
          let curVoiceover = this.state.voiceover;
          if (responseJson && responseJson.rows && responseJson.rows[0].scriptText && typeof responseJson.rows[0].scriptText == 'string'){
            curText = JSON.parse(responseJson.rows[0].scriptText);
          }
          if (responseJson && responseJson.rows && responseJson.rows[0].scriptVoiceover && typeof responseJson.rows[0].scriptVoiceover == 'string'){
            curVoiceover = JSON.parse(responseJson.rows[0].scriptVoiceover);
            curVoiceover.forEach((voiceover) => {
              if(voiceover.recLength > 0){
                console.log('Found blob...');
                dbQueryBlobGet(voiceover.blobName, voiceover.blobSize);
              }
            });
            if(curVoiceover[this.state.scene].recLength > 0){
              this.setState({currentTime: curVoiceover[this.state.scene].recLength, finished: true, canPlay:true,})
            }
          }
          this.setState({scenes:curText, voiceover: curVoiceover}, () => {console.log(this.state)});
      }})
      .catch((error) =>{
        console.error(error);
      });
  }

  //update script information in database
  _DbQueryPost = () => {

    DbScriptPost(this.props.navigation.getParam('instance'), this.state.scenes, this.state.voiceover);

    this.state.voiceover.forEach((voiceover) => {
      if(voiceover.recLength > 0){
        console.log('voiceover to be uploaded to file storage: ' + voiceover)
        DbQueryBlobPost(voiceover.blobName);
      }
    })
  }

  //delete current story from database
  _delete = () => {
    DbDelete(this.props.navigation.getParam('instance'));
    this.props.navigation.navigate('NewStories', {instance:this.props.navigation.getParam('instance')-1});
  }

  //information pop-up handling
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  //handle the scene change interaction in the app
  _changeScene = (newScene) => {
    let recordingExists = false;
    let recordingTime = 0;
    if(this.state.voiceover[newScene]['recLength']>0){
      recordingExists = true;
      recordingTime = this.state.voiceover[newScene]['recLength'];
    }
    this.setState({finished: recordingExists, stoppedRecording:true, currentTime: recordingTime, canPlay: recordingExists, scene: newScene, audioPath: AudioUtils.DocumentDirectoryPath + '/test00' + this.props.navigation.getParam('instance') + newScene +'.aac'}, 
        () => {console.log(this.state)});
  }

  //handle scene script text changes
  _changeSceneText = (text) => {
    let newScenes = this.state.scenes;
    newScenes[this.state.scene].text = text;
    this.setState({scenes: newScenes});
  }

  //render screen
  render() {
    const { navigate } = this.props.navigation;
    let scenes = [...this.state.scenes];
    const instance = this.props.navigation.getParam('instance');
    
    return (
      <View>
        <HeaderComponent header = 'Personalize'
        subtitle = 'Input Items'
        buttonLAction={() => Alert.alert(
          'Alert', "You're about to delete this story and all your edits. Are you sure you want to continue?",
          [{text: 'Cancel', onPress: () => _delete(), style:'cancel'},
        {text: 'Delete', onPress: () => {this._DbQueryPost();
                                        navigate('NewStories', {instance:instance-1})}}],
        )}
        buttonLIcon={require('../../assets/exit.png')}
        buttonRAction={() => navigate('PublishStory', {instance:instance})}
        buttonRIcon={require('../../assets/checked.png')}/>

        <ModalComponent
            text={this.props.navigation.getParam('text', undefined)}
            show={this.state.isModalVisible}
            closeModal={this._toggleModal}/>

        <ScrollView style={styles.container} style={styles.container} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <View style={styles.top}>
              <Headline style={{margin:20, textAlign: 'center'}}>Edit script and/or record voiceover.</Headline>
              <IconButton color={Colors.blue500} 
                        icon={require('../../assets/information.png')} 
                        onPress={() => this._toggleModal()}/>
            </View>
            
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center' }} >
                <Paragraph style={{margin:20, flex:1, fontSize: 20,}}>Select Scene:</Paragraph>
                <Picker mode='dropdown' style={styles.picker} selectedValue={this.state.scene} onValueChange={(itemValue) => {this._changeScene(itemValue)}}>
                    <Picker.Item label='Intro' value={0}/>
                    <Picker.Item label='Picnic' value={1}/>
                    <Picker.Item label='Play' value={2}/>
                    <Picker.Item label='Going home' value={3}/>
                    <Picker.Item label='The way home' value={4}/>
                    <Picker.Item label='During the week' value={5}/>
                    <Picker.Item label='Back to park' value={6}/>
                    <Picker.Item label='Animal control' value={7}/>
                    <Picker.Item label='Take Willy home' value={8}/>
                    <Picker.Item label='The End' value={9}/>
                </Picker>
            </View>

            <TextInput
              style={{margin:10}}
              mode='outlined'
              multiline={true}
              onChangeText={(text) => this._changeSceneText(text)}
              value = {scenes[this.state.scene].text}
            />

            <RecordingComponent setVoiceoverState={this._setVoiceoverState(this)} scene={this.state.scene} voiceover={this.state.voiceover} instance={this.props.navigation.getParam('instance')}/>

        </ScrollView>

        <View style={styles.bottom}>
            <Button mode='contained' style={styles.bottomButton} onPress={() => navigate('Personalize', {instance:instance})}>Back</Button>
            <Button mode='contained' style={styles.bottomButton} onPress={() => {this._DbQueryPost();
                                                                                navigate('PublishStory', {instance:instance})}}>Save and Finish</Button>
        </View>

      </View>
    );
  }

}

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 10,
    },
    top:{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginHorizontal: 15,
    },
    picker: {
      flex:1,
      maxWidth: 200,
    },
    recordItem:{
      margin:10,
    },
    bottom:{
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      margin: 20,
      marginBottom: 70,
    },
    bottomButton:{
      marginHorizontal: 20,
      width: '45%',
    },
  });