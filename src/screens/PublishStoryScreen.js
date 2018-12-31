import React, { Component } from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Headline, Title, Card, Button} from 'react-native-paper'
import HeaderComponent from '../components/HeaderComponent';
import { DbQueryPublish, DbDelete } from '../api/api';

export default class PublishStoryScreen extends Component {

  //initiate the deletion of current story and navigate to new story selection screen
  _delete = () => {
    DbDelete(this.props.navigation.getParam('instance'));
    this.props.navigation.navigate('Home', {instance:this.props.navigation.getParam('instance')-1});
  }

  //render screen
  render() {
    const { navigate } = this.props.navigation;
    const instance = this.props.navigation.getParam('instance');
    return (
      <View>
        <HeaderComponent header = 'Publish Story'
        subtitle = 'Save and Send'
        buttonLAction={undefined}
        buttonLIcon={undefined}
        buttonRAction={undefined}
        buttonRIcon={undefined}/>

        <Headline style={{margin:10, textAlign:'center'}}>
          Review your story!
        </Headline>

        <View>
          <Title style={{marginHorizontal: 20}}>Stray Dog</Title>
          <View style={{marginHorizontal:10, marginBottom:10}}>
            <Card>
              <Card.Cover source={require('../../assets/strayDog.png')}/>
            </Card>
          </View>
          <View style={styles.buttons}>
            <Button mode='contained' style={styles.buttonSmall} 
              onPress={() => Alert.alert(
              'Alert', "You're about to delete all your edits. Are you sure you want to continue?",
              [{text: 'Cancel', onPress: () => undefined, style:'cancel'},
              {text: 'Delete', onPress: () => this._delete()}],
            )}>Delete</Button>
            <Button mode='contained' style={styles.buttonSmall} onPress={() => navigate('Personalize')}>Edit</Button>
          </View>
              <Button mode='contained' onPress={() => navigate('Home')} style={styles.button}>Save</Button>
              <Button mode='contained' onPress={() => {DbQueryPublish(instance, true); navigate('Home')}} style={styles.button}>Save and Send!</Button>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  buttons:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  button:{
    marginBottom: 10,
    marginHorizontal: 20,
  },
  buttonSmall:{
    width: '45%',
    marginHorizontal: 5,
  }
});