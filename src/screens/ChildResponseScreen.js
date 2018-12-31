import React, { Component } from 'react';
import { StyleSheet, View, ScrollView} from 'react-native';
import {Headline, Paragraph, Card} from 'react-native-paper'
import HeaderComponent from '../components/HeaderComponent';
import { DbChildResponsesGet } from '../api/api';

//TODO: integrate
export default class HomeScreen extends Component {

  state = { 
    multipleChoice: undefined,
    openEnded1: "They thought someone else owned him.",
    openEnded2: "Hey!",
  };

  //Get the child response information from the database
  componentWillMount(){
    return DbChildResponsesGet(this.props.navigation.getParam('instance'))
      .then((responseJson) => {
        if(responseJson.rows[0]){
          this.setState({multipleChoice: responseJson.rows[0].multipleChoice.replace(/''/g, "\'")});
      }})
      .catch((error) =>{
        console.error(error);
      });
  }

  //render screen
  render() {
    const { openDrawer } = this.props.navigation;
    var images = [
      require('../../assets/drawImg.png'),
      require('../../assets/cameraImg.png')
    ]
    return (
      <View>
        <HeaderComponent header='Child Responses'
        buttonLAction={openDrawer} 
        buttonLIcon={require('../../assets/menu.png')} 
        buttonRAction={undefined}
        buttonRIcon={undefined} />

        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>

          <View style={{margin:10, justifyContent: 'flex-start', marginBottom:50}}>
            <Headline>{this.props.navigation.getParam('storyName')}</Headline>

            <Paragraph>Answer to multiple choice question: Who's this (implying the stray dog), what should we do?:</Paragraph>
                <Paragraph style={styles.answer}>{this.state.multipleChoice}</Paragraph>
            
            <Paragraph>Answer to open ended question: Why do you think the parent's didn't want to take Willy home?</Paragraph>
                <Paragraph style={styles.answer}>{this.state.openEnded1}</Paragraph>

            <Paragraph>Child's drawing of the Collar</Paragraph>
                <Card style={{marginBottom:20,}}>
                <Card.Cover source={images[0]}/>
                </Card>

            <Paragraph>Answer to open ended question: Say hi to Willy!</Paragraph>
                <Paragraph style={styles.answer}>{this.state.openEnded2}</Paragraph>

            <Paragraph>Child's picture of the shampoo bottle</Paragraph>
                <Card style={{marginBottom:20,}}>
                <Card.Cover source={images[1]}/>
                </Card>    

          </View>


        </ScrollView>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  answer:{
    color: 'grey',
    marginBottom:20,
  }
});