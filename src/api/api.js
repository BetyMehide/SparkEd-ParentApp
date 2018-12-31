import { apiBaseUrl } from '../config.json';
import RNFetchBlob from 'react-native-fetch-blob';


export function DbChildResponsesGet(instance) {
  return fetch(apiBaseUrl + `/ChildResponsesGet?userID=0&gameID=0&instance=${instance}`)
    .then((response) => response.json())
}

export function DbHomeGet(userID) {
  return fetch(apiBaseUrl + `/Home?userID=${userID}`)
    .then((response) => response.json())
}

//change story published status in the database
export function DbQueryPublish(instance, published) {
  return fetch(apiBaseUrl + '/Publish', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: 0,
      gameID: 0,
      instance: instance,
      published: published
    }),
  }).then((response) => {console.log('Publish db response:' + response)})
  .catch((error) => {
    console.error(error);
  });
}

//Delete current story from the user's story list in the database
export function DbDelete(instance) {
  return fetch(apiBaseUrl + '/Delete', {
    method: 'POST',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    userID: 0,
    gameID: 0,
    instance: instance,
    }),
  }).then((response) => {console.log('Delete story from db response: ' + response)})
  .catch((error) => {
      console.error(error);
  });
}

export function DbCharacterGet(instance) {
  return fetch(apiBaseUrl + `/CharactersGet?userID=0&gameID=0&instance=${instance}`)
    .then((response) => response.json())
}

export function DbCharactersPost(instance, storyName, characters, characterNames) {
  return fetch(apiBaseUrl + '/CharactersPost', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: 0,
      gameID: 0,
      instance: instance,
      storyName: storyName,
      characters: JSON.stringify(characters),
      characterNames: JSON.stringify(characterNames),
    }),
  }).then((response) => {console.log('Update characters in database response: ' + response)})
  .catch((error) => {
    console.error(error);
  });
}

export function DbScriptGet(instance) {
  return fetch(apiBaseUrl + `/ScriptGet?userID=0&gameID=0&instance=${instance}`)
    .then((response) => response.json())
}

export function DbScriptPost(instance, scriptText, scriptVoiceover) {
  return fetch(apiBaseUrl + '/ScriptPost', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: 0,
      gameID: 0,
      instance: instance,
      scriptText: JSON.stringify(scriptText),
      scriptVoiceover: JSON.stringify(scriptVoiceover),
    }),
  }).then((response) => {console.log('Script post response: ' + response)})
  .catch((error) => {
    console.error(error);
  });
}

export function DbInputGet(instance) {
  return fetch(apiBaseUrl + `/InputGet?userID=0&gameID=0&instance=${instance}`)
    .then((response) => response.json())
}

export function DbInputPost(instance, inputItems, inputMethods) {
  return fetch(apiBaseUrl + '/InputPost', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: 0,
      gameID: 0,
      instance: instance,
      inputItems: JSON.stringify(inputItems),
      inputMethods: JSON.stringify(inputMethods),
    }),
  }).then((response) => {console.log("Input post response" + response)})
  .catch((error) => {
    console.error(error);
  });
}

//get blob from filestorage
export function dbQueryBlobGet(blobName, blobSize) {
  console.log('Getting blob... ');
  return RNFetchBlob.config({
    path: blobName
  })
  .fetch('GET', apiBaseUrl + `/blobGet?blobName=${blobName}&blobSize=${blobSize}`,{})
  .then((response) => {console.log("Blob saved to ", response.path())})
  .catch((error) =>{
    console.error(error);
  });
}

//post blob to filestorage
export function DbQueryBlobPost(blobName) {
  console.log('Posting blob... ');
  return RNFetchBlob
  .fetch('POST', apiBaseUrl + '/blobPost', {
    Accept: 'application/form-data',
    'Content-Type': 'multipart/form-data',
  }, [
      {name: 'blobContent', filename: blobName, data: RNFetchBlob.wrap(blobName)},
    ]).then((response) => {console.log('Blob post response: ' + response)})
  .catch((error) => {
    console.error(error);
  });
}