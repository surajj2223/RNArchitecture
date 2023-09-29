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

import { useEffect } from 'react';

const App: () => Node = () => {
  const {sum} = NativeModules.MyMathModule;
  const {getBatteryLevel} = NativeModules.MyBatteryModule;

  const [spying, setSpying] = useState<boolean>(true);
  const [result, setResult] = useState<number|string>('');
  const [batteryPercentage, setBatteryPercentage] = useState<number|string>('');

  useEffect(()=>{
    MessageQueueSpy.start();

    return () => {
      MessageQueueSpy.stop();
    }
  }, []);

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
        <Text style={styles.batteryText}>React Native Bridge Demonstration</Text>
        <View style={{height: 30}} />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{backgroundColor: spying ? 'green': 'red', padding: 20}}  onPress={toggleSpy}>
            <Text style={styles.sectionTitle}>{spying ? 'Stop Spying' : 'Start Spying'}</Text>
          </TouchableOpacity>
          <View style={{width: 20}} />
          <TouchableOpacity style={{padding: 20, backgroundColor: 'grey'}} onPress={() => MessageQueueSpy.log()}>
            <Text>Show Queue Logs</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 20}} />
        <Button onPress={onAddition} title={'Adds 4 & 5'} />
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
  }
});

export default App;
