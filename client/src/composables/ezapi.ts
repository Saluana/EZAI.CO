import {Http} from "@capacitor-community/http"
import firebase from '../firebase/firebase';
const {getIdToken} = firebase

async function correctGrammar(text: string): Promise<any>{
    const idToken = await getIdToken();
    const options = {
        url: 'http://192.168.100.142:3000/image/correct',
        headers: {
            authorization: idToken,
            'Content-Type': 'application/json'
    }, data: {text}
}
const response: any = await Http.post(options);

if (response.data.status === "success") { 
    console.log("grammar response", response)
    return response.data.response;
} else {
    console.log("Grammar failure", null)
    return null;
}
} 

export default {correctGrammar}


