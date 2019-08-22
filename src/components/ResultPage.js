import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Actions } from "react-native-router-flux";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";

import colors from "../../assets/variables/colors";

import Button from "../../libs/components/Button";
import ConvertedFoodCollection from "../../libs/components/ConvertedFoodCollection";
import RefreshContainer from "../../libs/components/RefreshContainer";
import HeadLine from "../../libs/components/HeadLine";

export default class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.resultImgRef = React.createRef();
  }

  state = {
    loading: false,
    refreshing: false
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
  };

  moveDetailPage = async () => {
    const { detailData } = this.props;
    const options = {
      format: "png",
      quality: 1
    };
    this.setState({ loading: true });
    const resultImgSource = await takeSnapshotAsync(
      this.resultImgRef.current,
      options
    );

    const resultImgSourcePath = resultImgSource.match("file://")
      ? resultImgSource
      : `file://${resultImgSource}`;

    this.setState({ loading: false });
    Actions.detail({ resultImgSourcePath, detailData });
  };

  render() {
    const { loading, refreshing } = this.state;
    const { foodAmounts } = this.props;
    return (
      <RefreshContainer refreshing={refreshing} onRefresh={this.onRefresh}>
        <View style={styles.resultContainer}>
          <ScrollView>
            <View
              ref={this.resultImgRef}
              collapsable={false}
              style={styles.result}>
              <HeadLine pageName="Result" />
              <ConvertedFoodCollection
                style={styles.foodList}
                foodAmounts={foodAmounts}
              />
            </View>
            <View style={styles.actions}>
              <Button text="戻る" onPress={Actions.pop} />
              <Button text="詳細" onPress={this.moveDetailPage} />
            </View>
          </ScrollView>
        </View>
      </RefreshContainer>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    width: "100%",
    flex: 1
  },
  result: {
    flex: 1,
    backgroundColor: colors.main,
    paddingHorizontal: "5%"
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20
  }
});
