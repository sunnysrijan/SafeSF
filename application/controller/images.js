/*
David Stillwagon (Ryan)
Course: CSc 648 Software Engineering Summer 2019 Team 2

Returns the thumbnail for the given report
*/

exports.getImage = function (data, callback) {
  if (data['report_id']) {
    var image_path = './view/hazard_images/' + data['report_id'] + '-thumb.jpg'
    callback(null, image_path)
  } else {
    callback('No ID given', null)
  }
}
