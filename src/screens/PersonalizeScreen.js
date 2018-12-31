import React, { Component } from 'react';
import { View, Alert, TouchableNativeFeedback} from 'react-native';
import {Divider, List, Headline, Colors, IconButton} from 'react-native-paper'
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import { DbDelete } from '../api/api';

export default class PersonalizeScreen extends Component {
  state = {
    isModalVisible: false,
    text: this.charactersInfo,
  };

  //help information pop-up status
  _toggleModal = (info) => {
    this.setState({ isModalVisible: !this.state.isModalVisible, text:info});
  }

  //initiate the deletion of current story and navigate back to new story selection
  _delete = () => {
    DbDelete(this.props.navigation.getParam('instance'));
    this.props.navigation.navigate('Home', {instance:this.props.navigation.getParam('instance')})
  }

  //help information for each screen. 
  charactersInfo = "In this section you'll be able to change the names and characters in the story game. \n\n For example: change the dog to be a cat and name them Woof instead of Willy\n\n";
  itemsInfo = "In this section you'll be able to change the items the child needs to 'look for' in the story game. You can also change they way they insert them into the story (take a photo or draw). \n\n For example: let the child look for a towel instead of a shampoo.\n\n"
  scriptInfo = "In this section you'll be able to change the text in the story game. You can also record your own voiceover for the game.\n\n"

  //render screen
  render() {
    const { navigate } = this.props.navigation;
    const instance = this.props.navigation.getParam('instance');
    
    return (
      <View>
        <HeaderComponent header = 'Personalize'
        buttonLAction={() => Alert.alert(
          'Alert', "You're about to delete this story with all your edits. Are you sure you want to continue?",
          [{text: 'Cancel', onPress: () => undefined, style:'cancel'},
        {text: 'Delete', onPress: () => this._delete()}],
        )}
        buttonLIcon={require('../../assets/exit.png')}
        buttonRAction={() => navigate('PublishStory')}
        buttonRIcon={require('../../assets/checked.png')}/>

        <View>
          <ModalComponent
            text={this.state.text}
            show={this.state.isModalVisible}
            closeModal={this._toggleModal}/>

          <Headline style={{margin:10, textAlign:'center'}}>
            Let's start adding some personal touches to your story!
          </Headline>

          <View>
            <List.Section>
              <Divider/>
              <TouchableNativeFeedback onPress={() => navigate('Characters', {text:this.charactersInfo, instance:instance})}>
                <List.Item title='Characters and Names'
                left={() => <IconButton color={Colors.blue500} 
                                          icon={require('../../assets/information.png')} 
                                          onPress={() => this._toggleModal(this.charactersInfo)}/>}
                right={() => <IconButton color={Colors.blue500} 
                                          icon={require('../../assets/arrowL.png')} 
                                          onPress={() => navigate('Characters', {text:this.charactersInfo, instance:instance})} 
                                          style={{transform:[{rotateY:'180deg',}]}}/>}/>
              </TouchableNativeFeedback>

              <Divider/>

              <TouchableNativeFeedback onPress={() => navigate('Input', {text:this.itemsInfo, instance:instance})}>
                <List.Item title='Item Inputs'
                left={() => <IconButton color={Colors.blue500} 
                                          icon={require('../../assets/information.png')} 
                                          onPress={() => this._toggleModal(this.itemsInfo)}/>}
                right={() => <IconButton color={Colors.blue500} 
                                          icon={require('../../assets/arrowL.png')} 
                                          onPress={() => navigate('Input', {text:this.itemsInfo, instance:instance})} 
                                          style={{transform:[{rotateY:'180deg',}]}}/>}/>
              </TouchableNativeFeedback>

              <Divider/>

              <TouchableNativeFeedback onPress={() => navigate('Script', {text:this.scriptInfo, instance:instance})}>
                <List.Item title='Script and Voiceover'
                left={() => <IconButton color={Colors.blue500} 
                                          icon={require('../../assets/information.png')} 
                                          onPress={() => this._toggleModal(this.scriptInfo)}/>}
                right={() => <IconButton color={Colors.blue500} 
                                          icon={require('../../assets/arrowL.png')} 
                                          onPress={() => navigate('Script', {text:this.scriptInfo, instance:instance})} 
                                          style={{transform:[{rotateY:'180deg',}]}}/>}/>
              </TouchableNativeFeedback>

              <Divider/>

            </List.Section>

          </View>
        </View>
      </View>
    );
  }

}