import { fork } from 'redux-saga/effects';

function* watcher() {
    yield takeLatest('GET_ALL', getCharacters);
}

export default function* root() {
  yield fork(watcher);
}