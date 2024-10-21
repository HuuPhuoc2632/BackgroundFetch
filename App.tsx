import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { Header, Colors } from 'react-native/Libraries/NewAppScreen';
import BackgroundJob from 'react-native-background-actions';
import BackgroundFetch from "react-native-background-fetch";

const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

BackgroundJob.on('expiration', () => {
  console.log('iOS: I am being closed!');
});

const upload = async () => {
  const newLog = {
    createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    name: 'Background Fetch',
  };

  try {
    const res = await fetch("https://670e2a6d073307b4ee45b877.mockapi.io/api/test/log", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newLog)
    });

    if (res.ok) {
      const task = await res.json();
      // do something with the new task
    } else {
      // handle error
    }
  } catch (error) {
    // handle error
  }
};


const options = {
  taskName: 'Background Upload',
  taskTitle: 'Background Upload Running',
  taskDesc: 'Uploading logs in the background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 60000,
  },
};

const App = () => {
  useEffect(() => {
    // Configure BackgroundFetch
    BackgroundFetch.configure({
      minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
      forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
      requiresCharging: false,
      requiresDeviceIdle: false,
      requiresBatteryNotLow: false,
      requiresStorageNotLow: false
    }, async (taskId) => {
      console.log("[js] Received background-fetch event: ", taskId);
      await upload();
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start", error);
    });

    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });

    // Start the intensive task
    // BackgroundJob.start(veryIntensiveTask, options);

    return () => {
      console.log('App is going to be closed');
      BackgroundJob.stop();
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        <View style={styles.body}>
          <Text>Test background</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  scrollView: {
    // Your styles here
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
