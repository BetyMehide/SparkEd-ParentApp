import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export default class HeaderComponent extends Component {

    render() {
      return (
          <Appbar.Header>
            <Appbar.Action icon={this.props.buttonLIcon} onPress={this.props.buttonLAction}/>
            <Appbar.Content title={this.props.header} subtitle={this.props.subtitle}/>
            <Appbar.Action icon={this.props.buttonRIcon} onPress={this.props.buttonRAction}/>
          </Appbar.Header>
      );
    }
}

const styles=StyleSheet.create({
  top: {
    position: 'absolute',
    left: 0,
    right: 0, 
    top: 0,
  },
})