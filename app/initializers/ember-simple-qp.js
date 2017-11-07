import Ember from 'ember'
import config from '../config/environment'
import QueryParamsMixin from 'ember-simple-qp'

var alreadyRun = false

const {
  Route
} = Ember

export default {
  name: 'ember-simple-qp',

  initialize: function() {
    let options = config['ember-simple-qp']
    if (alreadyRun || (options && options['injectToRoute'] == false)) return
    alreadyRun = true
    Route.reopen(QueryParamsMixin)
  }
}
