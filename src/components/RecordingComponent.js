import React, { Component } from 'react';
import {View, Alert, Platform, StyleSheet} from 'react-native';
import {IconButton, Paragraph} from 'react-native-paper';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob';

export default class RecordingComponent extends Component{

    constructor(props){
        super(props);
        this.state={
            currentTime: 0.0,
            recording: false,
            paused: false,
            stoppedRecording: true,
            finished: false,
            canPlay:false,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test00' + this.props.instance + '0.aac',
            hasPermission: true,
        }
    }

    //prepare recording path
    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: 'Low',
          AudioEncoding: 'aac',
          AudioEncodingBitRate: 32000,
          OutputFormat: 'mpeg_4'
        });
    };
    
    //initiate recording.
    componentDidMount(){
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({hasPermission: isAuthorised});
      
            if(!isAuthorised) return;
      
            prepareRecordingPath(this.state.audioPath);
      
            AudioRecorder.onProgress = (data) => {
              this.setState({currentTime: Math.floor(data.currentTime)});
            };
      
            AudioRecorder.onFinished = (data) => {
              // Android callback comes in the form of a promise instead.
              if (Platform.OS === 'ios') {
                this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
              }
            };
      
          });
    }
    
    //pause recording
  async _pause() {
    if (!this.state.recording) {
      console.warn('Can\'t pause, not recording!');
      return;
    }

    try {
      const filePath = await AudioRecorder.pauseRecording();
      this.setState({paused: true});
    } catch (error) {
      console.error(error);
    }
  }

  //resume recording
  async _resume() {
    if (!this.state.paused) {
      console.warn('Can\'t resume, not paused!');
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({paused: false});
    } catch (error) {
      console.error(error);
    }
  }

  //stop recording
  async _stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false, paused: false});

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  //play the recording
  async _play() {
    if (this.state.recording) {
      await this._stop();
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      var sound = new Sound(this.props.voiceover[this.props.scene]['blobName'], '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
        else{
          this.setState({canPlay:false})
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
          this.setState({canPlay:true})
        });
      }, 100);
    }, 100);
  }

  //start recording
  async _record() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    //added to deal with android permission errors in developer mode. TODO: remove 
    if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath);
    }
    AudioRecorder.onProgress = (data) => {
      this.setState({currentTime: Math.floor(data.currentTime)});
    };

    this.setState({recording: true, paused: false});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  //post processing of the recording
  _finishRecording(didSucceed, filePath, fileSize) {
    let curRecordings = this.props.voiceover;
    curRecordings[this.props.scene]['blobName'] = filePath;
    curRecordings[this.props.scene]['recLength'] = this.state.currentTime;
    var base64 = require('base-64');
    RNFetchBlob.fs.readFile(filePath, 'base64').then((data) => {curRecordings[this.props.scene]['blobSize'] = base64.decode(data).length});
    this.props.setVoiceoverState(curRecordings);
    this.setState({ finished: didSucceed, canPlay:true });
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    console.log('Audio path state: ' + this.state.audioPath);
  }

  //delete the recording. Currently only changes state information. TODO: delete the file from path too.
  _deleteRecording(){
    let curRecordings = this.props.voiceover;
    curRecordings[this.props.scene]['blobName'] = undefined;
    curRecordings[this.props.scene]['blobSize'] = 0;
    this.props.setVoiceoverState(curRecordings);
    this.setState({currentTime: 0.0, recording: false, paused: false, finished: false, canPlay: false});
  }

    render() {
        return(
          <View>
            <Paragraph style={{textAlign:'center'}}>{this.state.currentTime}s</Paragraph>
            
            <View style={{marginHorizontal:10, flexDirection:'row', justifyContent:'space-evenly', alignItems: 'center'}}>
              <IconButton icon={require('../../assets/stop.png')} style={styles.recordItem} onPress={() => this._stop()} disabled={!this.state.recording}/>
              <IconButton icon={require('../../assets/pause.png')} style={styles.recordItem} onPress={() => {this.state.paused ? this._resume() : this._pause()}} disabled={!this.state.recording}/>
              <IconButton icon={require('../../assets/play.png')} style={styles.recordItem} onPress={() => this._play()} disabled={!this.state.canPlay}/>
              <IconButton icon={require('../../assets/record.png')} style={styles.recordItem} onPress={() => this._record()} disabled={this.state.recording}/>
              <IconButton icon={require('../../assets/delete.png')} style={styles.recordItem} onPress={() => Alert.alert(
                          'Alert', "Are you sure you want to delete your recording?",
                          [{text: 'Cancel', onPress: () => undefined, style:'cancel'},
                          {text: 'Delete', onPress: () => {this._deleteRecording(); this.setState({currentTime: 0.0})}}],
                          )} disabled={!this.state.finished}/>
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  recordItem:{
    margin:10,
  },
})

