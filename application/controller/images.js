
exports.getImage = function (data, callback) {
  if (data['report_id']) {
    var image_path = './view/hazard_images/' + data['report_id'] + '-thumb.jpg'
    callback(null, image_path)
  } else {
    callback('No ID given', null)
  }
}
