import React, { Component } from 'react';
import {StyleSheet, View,} from 'react-native';
import {Card, Title, Headline, Button, Chip, Paragraph} from 'react-native-paper'
import HeaderComponent from '../components/HeaderComponent';

export default class HomeScreen extends Component {

  //create new story in database
  DbQuery = () => {
    fetch('https://gixsparked.herokuapp.com/NewStories', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: 0,
        gameID: 0,
        instance: this.props.navigation.getParam('instance', 0)+1,
      }),
    }).then((response) => {console.log(response)})
    .catch((error) => {
      console.error(error);
    });
  }

  //initiate the creation of a new story and navigate to personalization options
  _newStory = () => {
    this.DbQuery();
    this.props.navigation.navigate('Personalize', {instance:this.props.navigation.getParam('instance', 0)+1})
  }

  //render screen
  render() {
    const { navigate } = this.props.navigation;
    const StrayDogDescription = "A little dog appears at a family picnic and a girl and boy play with him all afternoon. They name him willy. At day's end, they say good-bye. But they think about Willy all week long. So the family returns to the picnic grounds to find him. They are not alone-the dogcatcher is looking for Willy, too! In the end the children manage to save Willy and the parents allow them to take him home."
    return (
      <View>
        <HeaderComponent header = 'New Story'
        buttonLAction={() => navigate('Home')}
        buttonLIcon={require('../../assets/arrowL.png')}
        buttonRAction={undefined}
        buttonRIcon={undefined}/>

        <View style={{margin:10}}>
          <Headline style={{textAlign:'center', margin: 10}}>
            Choose a story to personalize!
          </Headline>
          <Card syle={{marginBottom:20,}}>
            <Card.Cover source={require('../../assets/strayDog.png')}/>
            <Card.Content>
              <Title style={{margin:10}}>Stray Dog</Title>
              <Paragraph>{StrayDogDescription}</Paragraph>
            </Card.Content>
            <Card.Actions style={{justifyContent:'space-between'}}>
              <View style={{justifyContent:'flex-start'}}>
                <View style={{marginHorizontal:10}}>
                  <Chip>Empathy</Chip>
                </View>
              </View>
              <View style={{justifyContent:'flex-end', width:80, marginHorizontal: 10}}>
                <Button mode='contained' onPress={() => this._newStory()}>Edit</Button>
              </View>
            </Card.Actions>
          </Card>

        </View>
      </View>
    );
  }

}