import { fork } from 'redux-saga/effects';

function* watcher() {
  
}

export default function* root() {
  yield fork(watcher);
}