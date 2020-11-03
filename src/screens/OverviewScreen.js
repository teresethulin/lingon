import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';
import ButtonPrimary from '../components/ButtonPrimary';
import { firebaseAuth } from '../config/keys';
import firebase from 'firebase';
import Header from '../components/Header';
const db = firebase.firestore();
const ls = require('local-storage');
import moment from 'moment';
moment().format();

let date = new Date();
let today = date.toISOString().split('T')[0];
const month = date.toLocaleString('default', { month: 'long' });
let displayedDate = date.getDate() + ' ' + month + ' ' + date.getFullYear();
const currentDayOfPeriod = 1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#7B6160',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export default function Overview({ navigation }) {
  const [pressed, setPressed] = useState(false);
  const [periodDays, setPeriodDays] = useState(['null']);
  const [nextPeriodStartDate, setNextPeriodStartDate] = useState(0);
  const [ongoingPeriod, setOngoingPeriod] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          isSubscribed ? setPressed(doc.data().ongoingPeriod) : null;
        }
      });
    return () => (isSubscribed = false);
  }, []);

  if (nextPeriodStartDate === 0) {
    db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setNextPeriodStartDate(doc.data().nextPeriodStartDate);
          return;
        }
      });
  }

  if (periodDays.includes('null')) {
    db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setPeriodDays(doc.data().periodDays);
          return;
        }
      });
  }

  const addDates = () => {
    if (!pressed) {
      db.collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setPeriodDays(doc.data().periodDays);
            firebase
              .firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .update({
                ongoingPeriod: true,
              });
            return;
          }
        });
      if (!periodDays.includes(today)) {
        periodDays.push(today);
        console.log(periodDays);
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .update({
            periodDays: periodDays,
            ongoingPeriod: true,
          });
      }
      setPressed(true);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          ongoingPeriod: false,
        });
      setPressed(false);
    }
  };

  const diff = moment(nextPeriodStartDate).diff(moment(today));

  let daysLeftBeforePeriodBegins = moment.duration(diff).days();

  if (daysLeftBeforePeriodBegins >= 2) {
    daysLeftBeforePeriodBegins = `${daysLeftBeforePeriodBegins} dagar kvar`;
  } else if (daysLeftBeforePeriodBegins === 1) {
    daysLeftBeforePeriodBegins = `${daysLeftBeforePeriodBegins} dag kvar`;
  } else if (daysLeftBeforePeriodBegins === 0) {
    daysLeftBeforePeriodBegins = 'Mensen är beräknad idag';
  } else if (daysLeftBeforePeriodBegins === -1) {
    daysLeftBeforePeriodBegins = `Mensen är ${Math.abs(
      daysLeftBeforePeriodBegins
    )} dag sen`;
  } else {
    daysLeftBeforePeriodBegins = `Mensen är ${Math.abs(
      daysLeftBeforePeriodBegins
    )} dagar sen`;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Överblick"
        icon="cog"
        onPress={() => navigation.navigate('SettingsModal')}
      />
      <Text style={[typography.h5, { marginTop: 50 }]}>{displayedDate}</Text>
      <Text style={[typography.h1, { paddingLeft: 20, paddingRight: 20 }]}>
        {pressed ? `Mensdag ${currentDayOfPeriod}` : daysLeftBeforePeriodBegins}
      </Text>
      <View style={{ marginBottom: 150 }}>
        <ButtonPrimary
          title={pressed ? 'Mensen är slut' : 'Mensen har börjat'}
          onPress={() => {
            addDates();
          }}
        />
      </View>
      <StatusBar barStyle="light-content" />
    </View>
  );
}
