import {
	StyleSheet,
	KeyboardAvoidingView,
	TextInput,
	Text,
	View,
	TouchableOpacity,
	Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import PlaceService from '../BaseServer/Places';
const data = [
	{ label: 'home', value: '1' },
	{ label: 'restaurant', value: '2' },
	{ label: 'park', value: '3' },
];
const PlaceInfo = ({ route, navigation }) => {
	const { placeInfo } = route.params;
	const [value, setValue] = useState(placeInfo.type);
	const [isFocus, setIsFocus] = useState(false);
	const [placeDetails, setPlaceDetails] = useState({
		name: placeInfo.data.name,
		type: placeInfo.data.type,
		phoneNumber: placeInfo.data.phoneNumber,
		latitude: placeInfo.data.latitude,
		longitude: placeInfo.data.longitude,
	});

	const handleSubmet = () => {
		let response = PlaceService.updatePlaces(placeInfo.id, placeDetails).then(
			(res) => {
				Alert.alert(
					'Updated',
					'Done',
					[
						{
							text: 'Cancel',
							onPress: () => navigation.navigate('ListPlace'),
							style: 'cancel',
						},
						{
							text: 'OK',
							onPress: () => navigation.navigate('ListPlace'),
						},
					],
					{ cancelable: false }
				);
			}
		);
		return response;
	};
	return (
		<KeyboardAvoidingView style={styles.container} behavior='padding'>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder='Name'
					value={placeDetails.name}
					onChangeText={(text) =>
						setPlaceDetails((prevStyle) => ({
							...prevStyle,
							name: text,
						}))
					}
					style={styles.input}
				/>
				<Dropdown
					style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
					placeholderStyle={styles.placeholderStyle}
					selectedTextStyle={styles.selectedTextStyle}
					inputSearchStyle={styles.inputSearchStyle}
					iconStyle={styles.iconStyle}
					data={data}
					search
					maxHeight={300}
					labelField='label'
					valueField='value'
					placeholder={!isFocus ? placeDetails.type : '...'}
					searchPlaceholder='Search...'
					value={value}
					onFocus={() => setIsFocus(true)}
					onBlur={() => setIsFocus(false)}
					onChange={(item) => {
						setValue(item.value);
						setPlaceDetails((prevStyle) => ({
							...prevStyle,
							type: item.label,
						}));

						setIsFocus(false);
					}}
				/>
				<TextInput
					placeholder='Phone Number'
					value={placeDetails.phoneNumber}
					onChangeText={(text) =>
						setPlaceDetails((prevStyle) => ({
							...prevStyle,
							phoneNumber: text,
						}))
					}
					style={styles.input}
				/>
				<View style={styles.location}>
					<TextInput
						placeholder='lat'
						value={placeDetails.latitude}
						onChangeText={(text) =>
							setPlaceDetails((prevStyle) => ({
								...prevStyle,
								latitude: text,
							}))
						}
						style={[styles.input, { width: '45%' }]}
					/>
					<TextInput
						placeholder='log'
						value={placeDetails.longitude}
						onChangeText={(text) =>
							setPlaceDetails((prevStyle) => ({
								...prevStyle,
								longitude: text,
							}))
						}
						style={[styles.input, { width: '45%' }]}
					/>
				</View>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={handleSubmet} style={styles.button}>
					<Text style={styles.buttonText}>Save</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default PlaceInfo;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: '20%',
	},
	inputContainer: {
		width: '80%',
	},
	input: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginVertical: 5,
	},

	buttonContainer: {
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,
	},
	button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},

	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
	location: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dropdown: {
		marginVertical: 5,
		backgroundColor: '#fff',
		height: 50,
		borderRadius: 8,

		paddingHorizontal: 8,
	},
	icon: {
		marginRight: 5,
	},
	label: {
		position: 'absolute',
		backgroundColor: 'white',
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});
