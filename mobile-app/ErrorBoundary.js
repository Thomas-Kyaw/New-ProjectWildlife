import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, info) {
    console.log("Error boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Error: {this.state.error.toString()}</Text>
        </View>
      );
    }
    return this.props.children; 
  }
}
