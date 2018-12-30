import React, { Component } from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import Modal from 'react-native-modal';

export default class ModalComponent extends Component {

  render() {
    return (
      <Modal isVisible={this.props.show} onBackdropPress={this.props.closeModal}>
        <View style={styles.modal}>
          <Text style={styles.header}>{this.props.text}</Text>
          <TouchableNativeFeedback onPress={() => this.props.closeModal('')}>
            <View style={styles.modalButton}>
              <Text style={styles.buttonText}>Got it!</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Modal>
    );
  }

}

const styles = StyleSheet.create({
  modal:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  modalButton:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    //width: '100%',
  },
  buttonText:{
    fontSize: 25,
    marginHorizontal: 10,
    textAlign: 'right'
  },
  header: {
    justifyContent: 'flex-start',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    borderBottomColor:'grey',
    borderBottomWidth: 1,
  },
});