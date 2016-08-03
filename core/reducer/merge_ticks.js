var tb = require('timebucket')

module.exports = function container (get, set, clear) {
  var apply_funcs = get('utils.apply_funcs')
  return function merge_ticks (b, cb) {
    var before = new Date().getTime()
    if (!b.tick) {
      // init tick
      var bucket = tb(b.ticks[0].time).resize(b.size)
      b.tick = {
        id: get('app_name') + ':' + bucket.toString(),
        app_name: get('app_name'),
        time: bucket.toMilliseconds(),
        size: b.size
      }
    }
    var tick = b.tick, ticks = b.ticks, size = b.size
    //get('logger').info('after thought filter', new Date().getTime() - before, 'ms')
    before = new Date().getTime()
    apply_funcs(b, get('tick_reducers'), function (err) {
      //get('logger').info('after reducers', new Date().getTime() - before, 'ms')
      if (err) return cb(err)
      get('ticks').save(tick, function (err) {
        if (err) return cb(err)
        //get('logger').info('after save', new Date().getTime() - before, 'ms')
        cb()
      })
    })
  }
}