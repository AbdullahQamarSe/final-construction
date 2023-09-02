import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CostCalculator = ({ navigation }) => {
  const [marlas, setMarlas] = useState('');
  const [floors, setFloors] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  const calculateCost = () => {
    const areaPerFloor = marlas * 272.251; // Area in sq feet
    const totalArea = areaPerFloor * floors;

    // Estimated quantities per sq foot
    const steelPerSqFoot = 2.5; // kg
    const cementPerSqFoot = 0.5; // 50 kg bags
    const bricksPerSqFoot = 50; // bricks
    const laborPerSqFoot = 1; // days

    // Costs
    const costPerKgSteel = 272; // PKR
    const costPerBagCement = 1130; // PKR
    const costPerBrick = 14; // PKR
    const costPerDayLabor = 1000; // PKR

    // Total costs
    const totalSteelCost = totalArea * steelPerSqFoot * costPerKgSteel;
    const totalCementCost = totalArea * cementPerSqFoot * costPerBagCement;
    const totalBricksCost = totalArea * bricksPerSqFoot * costPerBrick;
    const totalLaborCost = totalArea * laborPerSqFoot * costPerDayLabor;

    const totalCost = totalSteelCost + totalCementCost + totalBricksCost + totalLaborCost;

    setTotalCost(totalCost);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Marlas"
        keyboardType="numeric"
        value={marlas}
        onChangeText={setMarlas}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter number of floors"
        keyboardType="numeric"
        value={floors}
        onChangeText={setFloors}
      />
      <Button title="Calculate Cost" onPress={calculateCost} />
      <Text style={styles.totalCostText}>Total cost: {totalCost} PKR</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: 'tomato',
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  totalCostText: {
    marginTop: 10,
    color: 'white',
    fontSize: 18,
  },
});

export default CostCalculator;
