// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapCenter: { lat: 24.774265, lng: 46.738586 },
  taskAttachmentsPath: `${window.location.origin}${'//AttachmentFiles//'}`,
  // Nedss-BackEnd-main API (see API/Properties/launchSettings.json)
  baseApiUrl: 'https://localhost:7065/',
  // baseApiUrl: 'http://localhost:5069/',
  chatApiUrl: 'https://localhost:7065/',
  encryptionKey: '#$%(*gHj18)%$#@R',
  pageSize: 50,
  CardListPageSize: 12,
  GridListPageSize: 10,
  DropdownPageSize: 20,
  DebounceWaiting: 1000,
  operationRoomPageSize: 3,
  inspectorOfflineIntervalInMinutes: 5,

  PrintStatusInterval: 5000,
  DashboardRefreshInterval: 300000,
  dateFormate: 'dd/MM/yyyy',
  dateTimeFormat: 'dd/MM/yyyy - hh:mm a',
  geaographical: {
    lowColor: '#CAD2D5',
    highColor: '#81C0BF',
    averageColor: '#FFB67D',
    veryHighColor: '#0FAFA1',
    darkMapStyles: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#ffff' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#eeea' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#eeea' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#eeea' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
      },
    ],
  },
  iconsPath: 'Content/Images/IncidentTypesIcons/',
  incidenTypesIcons: [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png',
    '8.png',
    '9.png',
    '10.png',
  ],
  distributionCategoryId: 1,
  appStoreURL:
    'https://drive.google.com/file/d/15FrirRO761_7PHiutfra2QWwOw8K532z/view?usp=sharing',
  playStoreURL:
    'https://drive.google.com/file/d/1HLTMu6IF3QQUs9PhA6t9-Dh-UwwpZwWq/view?usp=sharing',
  firebase: {
    apiKey: 'AIzaSyD6i4mKxZ4r64XCSD7vRFfOYq1-NEglNNU',
    authDomain: 'bravo-30de5.firebaseapp.com',
    databaseURL: 'https://bravo-30de5-default-rtdb.firebaseio.com',
    projectId: 'bravo-30de5',
    storageBucket: 'bravo-30de5.appspot.com',
    messagingSenderId: '186700315202',
    appId: '1:186700315202:web:58f52eccd60629b76c0bdb',
    measurementId: 'G-JVR9H23EMT',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
