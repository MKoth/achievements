import { call, takeLatest, put, select } from "redux-saga/effects";
import { ADD_COHORT_REQUEST, addCohortFail, addCohortSuccess } from "./actions";
import { cohortsService } from "../../services/cohorts";
import { notificationShow } from "../Root/actions";

function* addCohortRequestHandler(action) {
  try {
    const auth = yield select(state => state.firebase.auth);
    const cohortKey = yield call(
      cohortsService.addCohort,
      action.name,
      auth.uid,
      auth.displayName
    );
    yield put(addCohortSuccess(action.name, cohortKey));
  } catch (err) {
    yield put(addCohortFail(action.name, err.message));
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchAddCohortRequests() {
    yield takeLatest(ADD_COHORT_REQUEST, addCohortRequestHandler);
  }
];
