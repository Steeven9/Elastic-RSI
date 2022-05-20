import { call } from "redux-saga/effects";
import { getAll } from "../actions";

export function* getData() {
    try {
      const {data} = yield call(getAll);
  
    } catch (e) {
      console.error(e);
    }
  }