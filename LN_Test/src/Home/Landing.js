import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	TextInput,
	Keyboard,
	Alert,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import { Dropdown } from 'react-native-element-dropdown';
import PlaceService from '../BaseServer/Places';
import { Formik } from 'formik';
// import RenderMarker from "../Component/Marker"
const data = [
	{ label: 'home', value: 'home' },
	{ label: 'restaurant', value: 'restaurant' },
	{ label: 'park', value: 'park' },
];
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { auth } from '../../firebase';
// Add a new document in collection "cities"

const Landing = ({ navigation }) => {
	const [isModalLanguageVisible, setModalLanguageVisible] = useState(false);
	const [value, setValue] = useState(null);
	const [isFocus, setIsFocus] = useState(false);
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [places, setPlaces] = useState([]);
	const [location, setLocation] = useState(false);
	const [error, setError] = useState(null);
	const [placeDetails, setPlaceDetails] = useState({
		name: '',
		type: '',
		phoneNumber: '',
	});

	const [region, setRegion] = React.useState({
		latitude: 37.78825,
		longitude: -122.4324,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});
	const [keyboardShow, setKeyboardShow] = React.useState();
	const [refreshKey, setRefreshKey] = useState(0);
	const handleSubmet = () => {
		if (placeDetails.name.length < 3) {
			setError('Name must be at least 4 characters');
		} else if (isNaN(placeDetails.phoneNumber)) {
			setError('Phone number is not valid');
		} else if (!location) {
			setError('Select Location  Please');
		} else {
			let response = PlaceService.addPlaces(
				'' + latitude,
				'' + longitude,
				placeDetails
			);
			setRefreshKey((oldKey) => oldKey + 1);
			setModalLanguageVisible(!isModalLanguageVisible);
			return response;
		}
	};
	const renderIcon = (param) => {
		switch (param) {
			case 'restaurant':
				return <Ionicons name='restaurant' color='#0782F9' size={25} />;
			case 'home':
				return <Ionicons name='home' color='#0782F9' size={25} />;
			default:
				return <FontAwesome5 name='parking' color='#0782F9' size={25} />;
		}
	};
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardShow(true);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardShow(false);
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);
	const onLocationSelect = (event: MapEvent) => {
		console.log(event.nativeEvent.coordinate);
		setLocation(true);
		setLatitude(event.nativeEvent.coordinate.latitude);
		setLongitude(event.nativeEvent.coordinate.longitude);
	};
	useEffect(() => {
		const getItem = async () => {
			let data = await PlaceService.getPlaces();
			setPlaces(data);
			// console.log(data,"dataa");
		};
		getItem();
	}, [refreshKey]);
	return (
		<View style={{ flex: 1 }}>
			<View style={[styles.buttonContainer]}>
				<TouchableOpacity
					onPress={() => navigation.navigate('ListPlace')}
					style={styles.button}
				>
					<Text style={styles.buttonText}>View List Places</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setModalLanguageVisible(!isModalLanguageVisible)}
					style={[styles.button]}
				>
					<Text style={styles.buttonText}>Add Place</Text>
				</TouchableOpacity>
			</View>
			<MapView
				style={styles.map}
				onPress={onLocationSelect}
				onPoiClick={(e) => console.log(e)}
				// minZoomLevel={14}
				maxZoomLevel={17}
				region={{
					latitude: 37.78825,
					longitude: -122.4324,
					latitudeDelta: 1,
					longitudeDelta: 50,
				}}
				provider='google'
			>
				<MapView.Marker
					coordinate={{
						latitude: latitude,
						longitude: longitude,
					}}
				/>

				{places.map((item, index) => (
					<Marker
						key={index}
						coordinate={{
							latitude: parseInt(item.data.latitude),
							longitude: parseInt(item.data.longitude),
						}}
					>
						{renderIcon(item.data.type)}
						<Callout
							style={{
								width: Dimensions.get('window').width * 0.5,
								height: Dimensions.get('window').height * 0.1,
							}}
						>
							<Text>Name: {item.data.name}</Text>
							<Text>Phone: {item.data.phoneNumber}</Text>
						</Callout>
					</Marker>
				))}
			</MapView>

			<Overlay
				animationType='zoomIn'
				containerStyle={{ backgroundColor: 'rgba(86,86,88,.8)' }}
				childrenWrapperStyle={[
					styles.overlay,
					{ height: keyboardShow ? '65%' : '40%' },
				]}
				animationDuration={250}
				visible={isModalLanguageVisible}
				onClose={() => {
					setModalLanguageVisible(false);
				}}
				closeOnTouchOutside
			>
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
						placeholder={!isFocus ? 'Select Type ...' : '...'}
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
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						onPress={handleSubmet}
						style={[styles.button, { width: '80%' }]}
					>
						<Text style={styles.buttonText}>Add in List Place</Text>
					</TouchableOpacity>
				</View>
				{error && <Text style={{ backgroundColor: 'red' }}>{error}</Text>}
			</Overlay>
		</View>
	);
};
export default Landing;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		marginTop: 10,
	},
	buttonContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10,
	},
	button: {
		backgroundColor: '#0782F9',
		width: '40%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
	buttonOutlineText: {
		color: '#0782F9',
		fontWeight: '700',
		fontSize: 16,
	},
	overlay: {
		borderRadius: 10,
		// height: '40%',
		backgroundColor: '#fff',
	},
	inputContainer: {
		width: '80%',
	},
	input: {
		backgroundColor: '#f5f1f1',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
	dropdown: {
		marginVertical: 5,
		backgroundColor: '#f5f1f1',
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

// This for handle validation using Yup package
{
	/* <Formik
					validationSchema={ReviewInput}
					initialValues={{ name: '', phoneNumber: '' }}
					onSubmit={(values) => Submit(values.placeDetails)}
				>
					{({ handleChange, handleSubmit, values, errors }) => (
						<View style={styles.inputContainer}>
							<TextInput
								placeholder='Name'
								value={values.placeDetails.name}
								onChangeText={handleChange('name')}
								// onChangeText={(text) =>
								// 	setPlaceDetails((prevStyle) => ({
								// 		...prevStyle,
								// 		name: text,
								// 	}))
								// }
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
								placeholder={!isFocus ? 'Select Type ...' : '...'}
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
								value={values.placeDetails.phoneNumber}
								onChangeText={handleChange('phoneNumber')}
								// value={placeDetails.phoneNumber}
								// onChangeText={(text) =>
								// 	setPlaceDetails((prevStyle) => ({
								// 		...prevStyle,
								// 		phoneNumber: text,
								// 	}))
								// }
								style={styles.input}
							/>
							{errors && <Text style={styles.buttonText}>{errors}</Text>}
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									onPress={Submit}
									style={[styles.button, { width: '100%', bottom: -5 }]}
								>
									<Text style={styles.buttonText}>Add in List Place</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</Formik> */
}
// const phoneRegExp =
// 	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
// const ReviewInput = yup.object().shape({
// 	name: yup
// 		.string()
// 		.required('Name Address is Required')
// 		.min(4, ({ min }) => `Name must be at least ${min} characters`),
// 	phoneNumber: yup
// 		.string()
// 		.required('Phon number is required')
// 		.matches(phoneRegExp, 'Phone number is not valid'),
// });
