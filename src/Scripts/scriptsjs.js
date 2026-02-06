	$thumbs = $('.carousel');
		$thumbs
  .on ('mouseover', function () {
    $thumbs.slick ('pause');
  })
  .on ('mouseout', function () {
    $thumbs.slick ('play');
  });