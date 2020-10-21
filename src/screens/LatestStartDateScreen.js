import React, { Component } from "react";
import { View, Text, SafeAreaView, Dimensions, StyleSheet } from "react-native";
import PageControl from "react-native-page-control";
import colors from "../styles/colors";
import typography from "../styles/typography";
import Button from "../components/Button";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
});
const width = Dimensions.get("window").width;

export class LatestStartDate extends Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.wrapper}>
        <SafeAreaView>
          <PageControl
            numberOfPages={3}
            currentPage={0}
            hidesForSinglePage
            pageIndicatorTintColor={colors.primary}
            currentPageIndicatorTintColor={colors.white}
            indicatorStyle={{ borderRadius: 5 }}
            currentIndicatorStyle={{ borderRadius: 5 }}
            indicatorSize={{ width: width / 3, height: 5 }}
            onPageIndicatorPress={this.onItemTap}
          />
        </SafeAreaView>
        <View style={styles.container}>
          <Text style={typography.h1}>Ange när senaste mensen startade</Text>
          <Button
            title="Fyll i senare"
            backgroundColor="secondary"
            font="buttonSecondary"
          />
          <Button
            title="Fortsätt"
            onPress={() => navigate("CycleLengthScreen")}
          />
        </View>
      </View>
    );
  }
}

export default LatestStartDate;
