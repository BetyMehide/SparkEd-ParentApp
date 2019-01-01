import React, { Component } from 'react';
import { StyleSheet,View,Picker,Alert,ScrollView } from 'react-native';
import { TextInput, IconButton, Colors, Divider, Headline, Button, List } from 'react-native-paper';
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import { DbDelete, DbCharacterGet, DbCharactersPost } from '../api/api';

export default class CharactersScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      isModalVisible: false,
      storyName: "Stray Dog",
      character1: "Dog", character1Name: "Willy",
      character2: "Girl",
      character3: "Boy", 
      character4: "Mom",
      character5: "Dad",
      character6: "Animal Control - Male"
    };
  }

  //get previous edit information from the database. 
  componentWillMount(){
    return DbCharacterGet(this.props.navigation.getParam('instance'))
      .then((responseJson) => {
        if (responseJson){
          let curState = this.state;
          if (JSON.parse(responseJson.rows[0].storyName) !== null){
            curState['storyName'] = responseJson.rows[0].storyName;
          }
          if (JSON.parse(responseJson.rows[0].characters) !== null){
            JSON.parse(responseJson.rows[0].characters).forEach((character) => {
              curState[`character${character.nr}`] = character.name;
            })
          }
          if (JSON.parse(responseJson.rows[0].characterNames) !== null){
            JSON.parse(responseJson.rows[0].characterNames).forEach((characterName) => {
              curState[`character${characterName.nr}Name`] = characterName.name;
            })
          }
          this.setState(curState, () => {console.log('Characters state in database: ' + this.state)});
      }})
      .catch((error) =>{
        console.error(error);
      });
  }

  //Update database characters information
  _DbQueryPost = () => {
    characters = [
      {nr:1, name:this.state.character1},
      {nr:2, name:this.state.character2},
      {nr:3, name:this.state.character3},
      {nr:4, name:this.state.character4},
      {nr:5, name:this.state.character5},
      {nr:6, name:this.state.character6}
    ]
    characterNames = [
      {nr:1, name:this.state.character1Name}
    ]
    DbCharactersPost(this.props.navigation.getParam('instance'), this.state.storyName, characters, characterNames);
  }

  //Delete current story from database
  _delete = () => {
    DbDelete(this.props.navigation.getParam('instance'));
    this.props.navigation.navigate('Home', {instance:this.props.navigation.getParam('instance')-1});
  }

  //change the information modal visibility
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  //render screen
  render() {
    const { navigate } = this.props.navigation;
    const instance = this.props.navigation.getParam('instance');
    return (
      <View>
        <HeaderComponent header = 'Personalize'
        subtitle = 'Characters and Names'
        buttonLAction={() => Alert.alert(
          'Alert', "You're about to delete this story with all your edits. Are you sure you want to continue?",
          [{text: 'Cancel', onPress: () => undefined, style:'cancel'},
        {text: 'Delete', onPress: () => this._delete()}],
        )}
        buttonLIcon={require('../../assets/exit.png')}
        buttonRAction={() => {this._DbQueryPost();
                              navigate('PublishStory', {instance:instance})}}
        buttonRIcon={require('../../assets/checked.png')}/>
        
        {/* Help pop-up */}
        <ModalComponent
            text={this.props.navigation.getParam('text', undefined)}
            show={this.state.isModalVisible}
            closeModal={this._toggleModal}/>


        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
          <View style={styles.top}>
            <Headline style={{alignSelf: 'center'}}>Edit the characters in the story.</Headline>
            <IconButton color={Colors.blue500} 
                        icon={require('../../assets/information.png')} 
                        onPress={() => this._toggleModal()}/>
          </View>
          
          <List.Section>

          <List.Item title='Story name:'
            right={() => <TextInput
              style={styles.textInput}
              mode='outlined'
              onEndEditing ={(storyName) => this.setState({storyName: storyName.nativeEvent.text})}
              placeholder = {this.state.storyName}
            />}/>
          
          <Divider/>

          <List.Item title='Pet:'
            description='Main character'
            right={() => <Picker mode='dropdown' selectedValue={this.state.character1} style={styles.picker} onValueChange={(itemValue) => this.setState({character1: itemValue})}>
            <Picker.Item label='Dog' value='Dog'/>
            <Picker.Item label='Cat' value='Cat'/>
          </Picker>}/>

          <List.Item title=''
            right={() => <TextInput
              style={[styles.textInput, {marginTop: -20}]}
              mode='outlined'
              onEndEditing={(character1Name) => this.setState({character1Name:character1Name.nativeEvent.text})}
              placeholder = {this.state.character1Name}
            />}/>

          <Divider/>

          <List.Item title='Child 1:'
            right={() => <Picker mode='dropdown' selectedValue={this.state.character2} style={styles.picker} onValueChange={(itemValue) => this.setState({character2: itemValue})}>
            <Picker.Item label='Girl' value='Girl'/>
            <Picker.Item label='Boy' value='Boy'/>
            <Picker.Item label='Gender Neutral' value='Gender Netural'/>
          </Picker>}/>

          <Divider/>

          <List.Item title='Child 2:'
            right={() =><Picker mode='dropdown' selectedValue={this.state.character3} style={styles.picker} onValueChange={(itemValue) => this.setState({character3: itemValue})}>
            <Picker.Item label='Boy' value='Boy'/>
            <Picker.Item label='Girl' value='Girl'/>
            <Picker.Item label='Gender Neutral' value='Gender Netural'/>
            <Picker.Item label='none' value='none'/>
          </Picker>}/>

          <Divider/>

           <List.Item title='Grown up 1:'
            right={() =><Picker mode='dropdown' selectedValue={this.state.character4} style={styles.picker} onValueChange={(itemValue) => this.setState({character4: itemValue})}>
            <Picker.Item label='Mom' value='Mom'/>
            <Picker.Item label='Dad' value='Dad'/>
            <Picker.Item label='Sister' value='Sister'/>
            <Picker.Item label='Brother' value='Brother'/>
            <Picker.Item label='Grandmother' value='Grandmother'/>
            <Picker.Item label='Grandfather' value='Grandfather'/>
          </Picker>}/>

          <Divider/>

          <List.Item title='Grown up 2:'
            right={() =><Picker mode='dropdown' selectedValue={this.state.character5} style={styles.picker} onValueChange={(itemValue) => this.setState({character5: itemValue})}>
            <Picker.Item label='Dad' value='Dad'/>
            <Picker.Item label='Mom' value='Mom'/>
            <Picker.Item label='Sister' value='Sister'/>
            <Picker.Item label='Brother' value='Brother'/>
            <Picker.Item label='Grandmother' value='Grandmother'/>
            <Picker.Item label='Grandfather' value='Grandfather'/>
            <Picker.Item label='none' value='none'/>
          </Picker>}/>

          <Divider/>

          <List.Item title='Animal Control:'
            right={() =><Picker mode='dropdown' selectedValue={this.state.character6} style={styles.picker} onValueChange={(itemValue) => this.setState({character6: itemValue})}>
            <Picker.Item label='Male' value='Animal Control - Male'/>
            <Picker.Item label='Female' value='Animal Control - Female'/>
            <Picker.Item label='Gender Neutral' value='Gender Netural'/>
          </Picker>}/>

          <Divider/>

          </List.Section>
          
        <View style={styles.bottom}>
            <Button mode='contained' style={styles.bottomButton} onPress={() => {navigate('Personalize', {instance:instance})}}>Back</Button>
            <Button mode='contained' style={styles.bottomButton} onPress={() => {this._DbQueryPost();
                                                                                navigate('Input', {instance:instance})}}>Save and Next</Button>
          </View>

        </ScrollView>
        
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  top:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin:10,
    marginBottom: 15,
  },
  item:{
    marginBottom:3,
    marginTop:2,
  },
  character:{
    justifyContent: 'space-between', 
    alignItems: 'center',
    flexDirection:'row', 
  },  
  textInput:{ 
    marginBottom:3,
    width: '50%',
  },
  picker: {
    width: '50%',
    marginBottom:3,
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