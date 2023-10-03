/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  TouchableOpacity
} from 'react-native';
import MessageQueueSpy from './MessageQueueSpy';

MessageQueueSpy.start();

const App: () => Node = () => {
  const {sum} = NativeModules.MyMathModule;
  const {getBatteryLevel} = NativeModules.MyBatteryModule;

  const [spying, setSpying] = useState<boolean>(true);
  const [result, setResult] = useState<number|string>('');
  const [batteryPercentage, setBatteryPercentage] = useState<number|string>('');
  const [count, setCount] = useState<number>(0);

  const onAddition = () => {
    sum(4,5)
      .then(v => setResult(v));
  }

  const toggleSpy = () => {
    if (spying) {
      MessageQueueSpy.stop()
    } else {
      MessageQueueSpy.start();
    }
    setSpying(!spying);
  }

  const onBatteryStatusButtonClicked = () => {
    getBatteryLevel().then(level => {
      setBatteryPercentage(parseFloat(level*100).toFixed(2))
    });
  }

  const incrementCount = () => {
    setCount(count+1);
  }

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>React Native Bridge Demonstration</Text>
        <View style={{height: 100}} />
        <View style={styles.flexedContainer}>
          <View style={styles.horizontalContainer}>
            <TouchableOpacity style={[styles.touchable, {backgroundColor: spying ? 'green': 'red'}]}  onPress={toggleSpy}>
              <Text style={styles.sectionTitle}>{spying ? 'Stop Spying' : 'Start Spying'}</Text>
            </TouchableOpacity>
            <View style={{width: 20}} />
            <TouchableOpacity style={styles.touchable} onPress={() => MessageQueueSpy.log()}>
              <Text>Show Queue Logs</Text>
            </TouchableOpacity>
          </View>
        <View style={{height: 40}} />

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.countText}>{count}</Text>
          <View style={{height: 20}} />
          <Button onPress={incrementCount} title={'Increase Count'} />
        </View>
        </View>
        <View style={{height: 20}} />
        <View style={styles.flexedContainer}>
          <Text style={styles.batteryText}>Custom Native Modules</Text>
          <View style={{height: 20}} />
          <Button onPress={onAddition} title={'Natively Adds 4 & 5'} />
          <View style={{height: 20}} />
          <Text style={styles.sectionDescription}>4+5={result}</Text>
          <View style={{height: 20}} />
          <Button onPress={onBatteryStatusButtonClicked} title={'Show Battery Percentage'} />
          <View style={{height: 20}} />
          <Text style={styles.batteryText}>Battery: {batteryPercentage} %</Text>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingVertical: 30},
  heading: {fontSize: 30, textAlign: 'center', fontWeight: 'bold'},
  flexedContainer: {flex: 1, padding: 16},
  horizontalContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  countText: {fontSize: 28, fontWeight: 'bold'},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  batteryText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  touchable: {
    padding: 20,
    backgroundColor: 'grey',
  }
});

export default App;
