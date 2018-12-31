import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import {FAB, Switch, Paragraph, Card, Title, Button} from 'react-native-paper'
import HeaderComponent from '../components/HeaderComponent';
import { DbQueryPublish, DbHomeGet } from '../api/api';


export default class HomeScreen extends Component {

  state = {
    reRender: true,
    myStories: []
  };

  //function to render each story in the user's sotry list onto the screen. 
  _renderStories = (navigate) => {
    return this.state.myStories.map((data) => {
      return(
        <Card style={{marginBottom:10}} key={data.instance}>
          <Card.Cover source={require('../../assets/strayDog.png')}/>
          <Card.Content>
            <Title style={{margin:10}}>{data.storyName}</Title>
          </Card.Content>
          <Card.Actions style={{justifyContent:'space-between'}}>
            <View style={{justifyContent:'flex-start'}}>
              <View style={{marginHorizontal:10, width:160}}>
                <Button mode='contained' onPress={() => {this.setState({reRender: true});
                                                        navigate('Personalize', {instance:data.instance})}}>Edit</Button>
              </View>
              <View style={{marginHorizontal:10, marginVertical:10, width:160}}>
                <Button mode='contained' disabled={!data.responded} onPress={() => {this.setState({reRender: true});
                                                                                    navigate('ChildResponse', {instance:data.instance, storyName:data.storyName})}}>View Response</Button>
              </View>
            </View>
            <View style={{justifyContent:'flex-end', width:80, marginHorizontal: 10}}>
              <Paragraph>Published</Paragraph>
              <Switch value={data.published} onValueChange={() => {this._changeState(data.instance)}}/>    
            </View>
          </Card.Actions>
        </Card>
      )
    })
  }

  //change story published status
  _changeState = (instance) => {
    let myStories = JSON.parse(JSON.stringify(this.state.myStories))
    myStories.forEach((element) => {
      if(element.instance == instance){
        element.published = !element.published;
        DbQueryPublish(instance, element.published);
      }
    });
    this.setState({myStories: myStories}, () => {console.log('Changed published state: ' + this.state.myStories)});
  }

  //get user story list from the database
  DbQueryGet = () => {
    return DbHomeGet(0) //TODO: userId hardcoded as 0 until support for multiple users is added
      .then((responseJson) => {
        let myStories = responseJson.rows;
        this.setState({myStories: myStories}, () => {console.log('State after initial db query: ' + this.state.myStories)});
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  //get user story list when loading screen
  componentWillMount(){
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.setState({reRender: false});
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  //get user story list when updating screen (to handle cache)
  componentWillUpdate(){
    if(this.state.reRender){
      this.setState({reRender: false});
      this.DbQueryGet();
    }
  }

  //render screen
  render() {
    //set up navigation variables
    const { navigate, openDrawer } = this.props.navigation;
    if (this.state.myStories.length == 0){
      instance = -1}
    else {
      instance = this.state.myStories[this.state.myStories.length-1].instance
    }

    //view rendering
    return (
      <View>
        <HeaderComponent header='Your Stories'
        buttonLAction={openDrawer} 
        buttonLIcon={require('../../assets/menu.png')} 
        buttonRAction={undefined}
        buttonRIcon={undefined} />

        <View>
          <FAB
          style={styles.fab}
          color='#000'
          icon={require('../../assets/add.png')}
          onPress={()=>{navigate('NewStories', {instance:instance})
                        this.setState({reRender: true});}}
          />
        </View>

        <ScrollView style={{flexDirection:'column'}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
          <View style={{margin:10, justifyContent: 'space-between'}}> 
            {this._renderStories(navigate)}
          </View>
          <View style={{height:130}}></View>
        </ScrollView>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  //style for the add new story button
  fab: {
    position: 'absolute',
    marginHorizontal: 50,
    marginVertical: Dimensions.get('screen').height - 210,
    right: 0,
    top: 0,
    zIndex: 100,
  },
});