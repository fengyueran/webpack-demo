import React from 'react';
import ReactDOM from 'react-dom';
import a from 'test';
import App from './app';
import './test.css';
import manifest from './manifest.webapp';
import alien from './alien.png';

console.log('alien', alien);
console.log('manifest', manifest);
console.log('manifest', a);
function test() {
  console.log('test');
}

ReactDOM.render(<App />, document.getElementById('root'));
