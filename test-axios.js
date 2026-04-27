import axios from 'axios';
import FormData from 'form-data';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const form = new FormData();
form.append('caption', 'hello');

api.interceptors.request.use(req => {
    console.log(req.headers);
    return req;
});

api.postForm('http://example.com', form).catch(()=>{}).then(() => console.log('Done 3'));
