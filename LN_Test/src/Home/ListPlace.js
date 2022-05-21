import {
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Text,
	View,
} from 'react-native';
import React, { useEffect, useCallback, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PlaceService from '../BaseServer/Places';
import { auth } from '../../firebase';
// Add a new document in collection "cities"
const renderIcon = (param) => {
	switch (param) {
		case 'restaurant':
			return <Ionicons name='restaurant' color='#0782F9' size={30} />;
		case 'home':
			return <Ionicons name='home' color='#0782F9' size={30} />;
		default:
			return <FontAwesome5 name='parking' color='#0782F9' size={30} />;
	}
};
const Item = ({ place }) => (
	<View style={styles.place}>
		<Text style={styles.name}>{place.data.name}</Text>
		{renderIcon(place.data.type)}
		<Ionicons name='arrow-forward' color='#0782F9' size={30} />
	</View>
);

const ListPlace = ({ navigation }) => {
	const [data, setData] = useState([]);

	const renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => navigation.navigate('PlaceInfo', { placeInfo: item })}
		>
			<Item place={item} />
		</TouchableOpacity>
	);

	useEffect(() => {
		const addItem = async () => {
			let getData = await PlaceService.getPlaces();
			const dataSort = getData.sort((a, b) =>
				a.name > b.name ? 1 : b.name > a.name ? -1 : 0
			);
			setData(dataSort);
			// console.log(data,"dataa");
		};
		addItem();
	}, [data]);
	return (
		<View style={styles.container}>
			<View style={styles.body}>
				<FlatList
					data={data}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					initialNumToRender={6}
				/>
			</View>
		</View>
	);
};

export default ListPlace;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		// justifyContent: 'center',
		alignItems: 'center',
	},
	body: {
		width: '94%',
		alignItems: 'center',
		// backgroundColor: '#000',
	},
	place: {
		paddingHorizontal: 10,
		width: '93%',
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 15,
		borderRadius: 20,
		alignItems: 'center',
		backgroundColor: '#f9f3f3',
	},
	name: {
		// textAlign: 'center',
		fontWeight: '500',
		fontSize: 25,
		width: '50%',
	},
	type: { textAlign: 'center', width: '20%' },
});
