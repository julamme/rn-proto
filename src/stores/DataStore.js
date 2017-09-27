class DataStoreClass {
    const geofire = new Geofire(firebase.database().ref('locations'));
    geofire.set('testkey', [60.78846339038239, 24.41154379831676]);
    firebase
      .database()
      .ref('locations/testkey')
      .update({
        id: 1,
        name: 'testailuhuussi 1',
        latitude: 60.78846339038239,
        longitude: 24.41154379831676,
        address: 'paasikatu 3',
        rating: 2,
        price: 0,
        imageUrl: 'todo',
        ratingCount: 1,
        description: 'Testi huussi mestapaikka',
        reviews: [
          {
            id: 1,
            user: 19839489138394,
            rating: 2,
            description: 'Ihan jees.'
          }
        ]
      });
    geofire.get('testkey').then(resp => console.log(resp));
    const geoQuery = geofire.query({
      center: [60.78, 24.41],
      radius: 10.5
    });
    const onReady = geoQuery.on('ready', () => {
      console.log('ready!!');
    });
    const onEnter = geoQuery.on(
      'key_entered',
      (key, location, distance) => {
        console.log(
          key +
            ' entered query at ' +
            location +
            ' (' +
            distance +
            ' km from center)'
        );
      }
    );
}

const DataStore = new DataStoreClass();

export default DataStore;
