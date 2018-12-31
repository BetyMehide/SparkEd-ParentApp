import React, { Component } from 'react';
import {StyleSheet,View,Picker,Alert} from 'react-native';
import {Divider, List, Headline, Colors, IconButton, Button} from 'react-native-paper'
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent'
import { DbDelete, DbInputGet, DbInputPost } from '../api/api';

export default class InputScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      item1: 'Collar', item1Camera: 'grey', item1Pencil: 'green',
      item2: 'Shampoo', item2Camera: 'green', item2Pencil: 'grey',
      isModalVisible: false,
    }
  }

  //get current input information from database
  componentWillMount(){
    return DbInputGet(this.props.navigation.getParam('instance'))
      .then((responseJson) => {
        if (responseJson){
          let curState = this.state;
          if (responseJson.rows[0].inputItems != 'null'){
            JSON.parse(responseJson.rows[0].inputItems).forEach((item) => {
              curState[`item${item.nr}`] = item.name;
            })
          }
          if (responseJson.rows[0].inputMethods != 'null'){
            JSON.parse(responseJson.rows[0].inputMethods).forEach((inputMethod) => {
              curState[`item${inputMethod.nr}Camera`] = inputMethod.camera;
              curState[`item${inputMethod.nr}Pencil`] = inputMethod.pencil;
            })
          }
          this.setState(curState, () => {console.log('Input state after database get: ' + this.state)});
      }})
      .catch((error) =>{
        console.error(error);
      });
  }

  //Update input information in the database
  _DbQueryPost = () => {
    inputItems = [
      {nr:1, name:this.state.item1},
      {nr:2, name:this.state.item2}
    ]
    inputMethods = [
      {nr:1, camera:this.state.item1Camera, pencil:this.state.item1Pencil},
      {nr:2, camera:this.state.item2Camera, pencil:this.state.item2Pencil}
    ]
    DbInputPost(this.props.navigation.getParam('instance'), inputItems, inputMethods);
  }

  //delete current story and navigate to NewStories screen
  _delete = () => {
    DbDelete(this.props.navigation.getParam('instance'));
    this.props.navigation.navigate('Home', {instance:this.props.navigation.getParam('instance')-1});
  }

  //help pop-up status
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  //render screen
  render() {
    const { navigate } = this.props.navigation;
    const instance = this.props.navigation.getParam('instance');
    return (
      <View>
        <HeaderComponent header = 'Personalize'
        subtitle = 'Input Items'
        buttonLAction={() => Alert.alert(
          'Alert', "You're about to delete this story and all your edits. Are you sure you want to continue?",
          [{text: 'Cancel', onPress: () => undefined, style:'cancel'},
        {text: 'Delete', onPress: () => this._delete()}],
        )}
        buttonLIcon={require('../../assets/exit.png')}
        buttonRAction={() => {console.log(`instance: ${instance}`)
                              this._DbQueryPost();
                              navigate('PublishStory', {instance:instance})}}
        buttonRIcon={require('../../assets/checked.png')}/>

        <ModalComponent
            text={this.props.navigation.getParam('text', undefined)}
            show={this.state.isModalVisible}
            closeModal={this._toggleModal}/>

        <View style={styles.container}>
            <View style={styles.top}>
              <Headline style={{margin:20, textAlign: 'center'}}>Change the input items and methods.</Headline>
              <IconButton color={Colors.blue500} 
                        icon={require('../../assets/information.png')} 
                        onPress={() => this._toggleModal()}/>
            </View>

            <List.Section>
                <Divider/>
                <List.Item description='Item to show the ownership of the pet:'
                    right={()=><Picker mode='dropdown' selectedValue={this.state.item1} style={styles.picker} onValueChange={(itemValue) => this.setState({item1: itemValue})}>
                    <Picker.Item label='Collar' value='Collar'/>
                    <Picker.Item label='Ribbon' value='Ribbon'/>
                </Picker>}/>
                <View style={[styles.Item, {marginTop:-42}]}>
                    <IconButton icon={require('../../assets/camera.png')} size={32} onPress={() => this.setState({item1Camera:'green', item1Pencil: 'grey'})} color={this.state.item1Camera} style={styles.itemInput}/>
                    <IconButton icon={require('../../assets/pencil.png')} size={32} onPress={() => this.setState({item1Camera:'grey', item1Pencil: 'green'})} color={this.state.item1Pencil} style={styles.itemInput}/>
                </View>

                <Divider/>

                <List.Item description='Item to wash the pet:'
                    right={() => <Picker mode='dropdown' selectedValue={this.state.item2} style={styles.picker} onValueChange={(itemValue) => this.setState({item2: itemValue})}>
                    <Picker.Item label='Shampoo' value='Shampoo'/>
                    <Picker.Item label='Brush' value='Brush'/>
                    <Picker.Item label='Towel' value='Towel'/>
                  </Picker>} />

                  <View style={styles.Item}>
                    <IconButton icon={require('../../assets/camera.png')} size={32} onPress={() => this.setState({item2Camera:'green', item2Pencil: 'grey'})} color={this.state.item2Camera} style={styles.itemInput}/>
                    <IconButton icon={require('../../assets/pencil.png')} size={32} onPress={() => this.setState({item2Camera:'grey', item2Pencil: 'green'})} color={this.state.item2Pencil} style={styles.itemInput}/>
                  </View>

                  <Divider/>

            </List.Section>
        </View>

        <View style={styles.bottom}>
            <Button mode='contained' style={styles.bottomButton} onPress={() => navigate('Personalize', {instance:instance})}>Back</Button>
            <Button mode='contained' style={styles.bottomButton} onPress={() => {this._DbQueryPost();
                                                                                navigate('Script', {instance:instance})}}>Save and Next</Button>
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
    marginHorizontal: 10,
  },
  Item:{
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginRight: '7%',
    marginBottom: 20,
    marginTop: -25,
  },
  dropdown:{
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },  
  itemInput:{
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '3%',
  },
  picker: {
    flex: 1,
    maxWidth: 200,
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