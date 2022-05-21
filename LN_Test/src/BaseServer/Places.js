export default class PlaceService {
	// Get All Place
	static async getPlaces() {
		var requestOptions = {
			method: 'GET',
			redirect: 'follow',
		};

		let res = fetch('http://10.0.2.2:3000/', requestOptions)
			.then((response) => response.json())
			.then((responseData) => {
				// console.log(responseData);
				return responseData;
			})
			.catch((error) => console.log('error', error));
		return res;
	}
	//   Add Place
	static async addPlaces(latitude, longitude, placeDetails) {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		var raw = JSON.stringify({
			name: placeDetails.name,
			type: placeDetails.type,
			phoneNumber: placeDetails.phoneNumber,
			latitude: latitude,
			longitude: longitude,
		});

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow',
		};
		fetch('http://10.0.2.2:3000/create', requestOptions)
			.then((response) => response.json())
			.then((responseData) => {
				console.log(responseData);
				return responseData;
			})
			.catch((error) => console.log('error', error));
	}
	// Edit Profile
	static async updatePlaces(id, placeDetails) {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		var raw = JSON.stringify({
			data: {
				latitude: '' + placeDetails.latitude,
				longitude: '' + placeDetails.longitude,
				name: placeDetails.name,
				phoneNumber: placeDetails.phoneNumber,
				type: placeDetails.type,
			},
			id: id,
		});

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow',
		};

		fetch('http://10.0.2.2:3000/update', requestOptions)
			.then((response) => response.text())
			.then((responseData) => {
				console.log(responseData);
				return responseData;
			})
			.catch((error) => console.log('error', error));
	}
}
