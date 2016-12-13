	

	// 恢复图片原大小,去掉遮罩层,隐藏 figcaption
	var returOriginImage = function (aImage) {
		aImage.css({
			'-webkit-transform': 'scale(1)',
			'-moz-transform': 'scale(1)',
			'transform': 'scale(1)',
			'-webkit-transform': 'rotate(0deg)',
			'-moz-transform': 'rotate(0deg)',
			'transform': 'rotate(0deg)',
			'z-index': '99'
		})

		// 测试当时有无遮罩层，若有，拖动的同时去掉。
		if ($('.wrap-div').length > 0) {
			$('.wrap-div').remove();
		}

		// 无论标志值为多少，都设置展示图片，并将标志设为0，表示原始大小
		aImage.find('IMG').addClass('is-visible').removeClass('is-hidden');
		aImage.find('FIGCAPTION').addClass('is-hidden').removeClass('is-visible');
		aImage.attr('show-big-index', 0);
		

		// 隐藏 figcaption
		// aImage.find('FIGCAPTION').css('display', 'none');
	}

	// 放大后点击图片切换文字
	var transformImageText = function (aImage) {

		// 目前展示图片，点击后展示背后的文字
		aImage.on('click', function (event) {
			event.stopPropagation();
			// 判断图片被放大，并且图片正面向前，标志为1
			if (aImage.attr('show-big-index') === '1') {
				aImage.find('IMG').addClass('is-hidden').removeClass('is-visible');
				aImage.find('FIGCAPTION').addClass('is-visible').removeClass('is-hidden');
				aImage.attr('show-big-index', '2');
			}
		})

		// 目前展示文字内容，点击后回到图片展示
		aImage.find('FIGCAPTION').on('click', function (event) {
			event.stopPropagation();
			// 此时不用判断标志，因为当可以点击文字内容时，肯定是放大之后。
			$(this).addClass('is-hidden').removeClass('is-visible');
			aImage.find('IMG').addClass('is-visible').removeClass('is-hidden');
			aImage.attr('show-big-index', '1');
		})
	}

	// 随机摆放图片（包括上下层）
	var setImage = function (obj, oTop, oLeft) {
		for (var i = obj.length - 1; i >= 0; i--) {
			var that = obj.eq(i);
			var angleNumber = Math.ceil(Math.random() * 30) * (Math.random() > 0.5 ? 1 : -1),
				topNumber, leftNumber;

			// 使得图片显示在父元素框内
			do {
				topNumber = Math.random() * that.parent().height();
			} while (topNumber < 0 || topNumber > that.parent().height() - that.height())

			do {
				leftNumber = Math.random() * that.parent().width();
			} while (leftNumber < 0 || leftNumber > that.parent().width() - that.width())

			if (oTop && oLeft) {
				that.css({
					'top' : oTop,
					'left': oLeft
				})
			} else {
				that.css({
					'top': topNumber,
					'left': leftNumber,
				})
			}

			that.css({
				'-webkit-transform': 'rotate(' + angleNumber +'deg)',
				'-moz-transform': 'rotate(' + angleNumber +'deg)',
				'transform': 'rotate(' + angleNumber +'deg)',
				'transition': 'top 0.5s, left 0.5s',
				// 设置随机上下层的效果（最大值是30）
				'z-index': angleNumber > 0 ? angleNumber : angleNumber * -1
			})
		};
	}

	// 拖动图片函数
	var dragImage = function (obj) {
		obj.mousedown(function (event) {
			var event = event || window.event;

			var mouseStartX = event.pageX,
				mouseStartY = event.pageY,
				imageStartX = $(this).css('left').replace('px', ''),
				imageStartY = $(this).css('top').replace('px', ''),
				zIndex = $(this).css('z-index');

			$(this).mousemove(function (e) {
				var mouseEndX = parseInt(e.pageX) - parseInt(mouseStartX) + parseInt(imageStartX),
					mouseEndY = parseInt(e.pageY) - parseInt(mouseStartY) + parseInt(imageStartY);

				$(this).css({
					'left': mouseEndX + 'px',
					'top': mouseEndY + 'px',
					'transition': 'top 0s, left 0s'
				})

				$(this).attr('show-big-index', 0);
				returOriginImage($(this));

			}).mouseup(function () {
				$(this).unbind('mousemove');
				$(this).css('z-index', zIndex);
			}).mouseleave(function () {
				$(this).unbind('mousemove');
			})
		})
	}

	// 双击图片放大
	var showBig = function (obj) {
		var arr = [];
		obj.dblclick(function (event) {

			// 用数组存放当前照片和上一张照片，点击点前照片后，上一张照片调用setImage() 函数重新摆放；
			// 当前照片和上一张照片是同一张时，照片不随机摆放。
			arr.push({
				oIndex: obj.index($(this)),
				oTop: $(this).css('top'),
				oLeft: $(this).css('left'),
			})
			// arr.push(obj.index($(this)));

			if (arr.length > 1) {
				if (arr[0].oIndex !== arr[1].oIndex) {
					// 将上一张图片放回原位
					setImage(obj.eq(arr[0].oIndex), arr[0].oTop, arr[0].oLeft);
				}
				arr.shift();
			}

			// 设置属性 "show-big-index" 
			// 0：标志图片没有被放大，原始大小。
			// 1：标志图片被放大，而且图片正面。
			// 2：标志图片放大，而且图片反面。 
			$(this).attr('show-big-index', '1');
			$(this).css({
				'top': '50%',
				'left': '50%',
				'margin-top': $(this).height() / -2,
				'margin-left': $(this).width() / -2,
				'-webkit-transform': 'rotate(0deg)',
				'-moz-transform': 'rotate(0deg)',
				'transform': 'rotate(0deg)',
				'transform-origin': 'center center',
				'z-index': '90',
				'transition': 'transform 0.5s, top 0.5s, left 0.5s'
			})
			// 当屏幕大于 768px 是时才放大，手机屏幕不放大图片
			if (parseInt($(window).width()) > 768) {
				$(this).css({
					'-webkit-transform': 'scale(2)',
					'-moz-transform': 'scale(2)',
					'transform': 'scale(2)',
				})
			}


			// 方案一：双击放大后，为其他部分设置遮罩层，点击放大的图片之外的遮罩层部分回到原大小
			if ($('.wrap-div').length <= 0) {
				var newDiv = $('<div class="wrap-div"></div>');
				$(this).parent().append(newDiv);
				var that = $(this);
				newDiv.click(function () {
					returOriginImage(that);
				})
			}

			// 方案二：不设置遮罩层，当鼠标点击放大之外的部分，回到原大小
			// $('body').click(function (e) {
			// 	e = e || window.event;
			// 	e.stopPropagation();
			// 	if (e.pageX < parseInt(that[0].offsetLeft)
			// 		|| e.pageX > parseInt(that[0].offsetLeft) + parseInt(that[0].offsetWidth) * 2 + 20
			// 		|| e.pageY - 360 < parseInt(that[0].offsetTop)
			// 		|| e.pageY - 360 > parseInt(that[0].offsetTop) + parseInt(that[0].offsetHeight) * 2) {
			// 		that.css({
			// 			'-webkit-transform': 'scale(1)',
			// 			'-moz-transform': 'scale(1)',
			// 			'transform': 'scale(1)',
			// 		})
			// 	}
			// }

			transformImageText($(this));
		})
		obj.off('click');
	}


$(function () {
	var images = $('.gallery .gallery-images');

	// 放置图片
	setImage(images);

	// 调用拖动函数，拖动图片
	dragImage(images);

	// 双击展示图片
	showBig(images);

	// 使得想下滚动时，导航栏固定头部
    (function (){
        document.addEventListener('scroll',function(){
            var currentTop = window.pageYOffset,
                navbar =  document.querySelector(".navbar-custom");
            currentTop > navbar.clientHeight
                ?navbar.classList.add('is-fixed')
                :navbar.classList.remove('is-fixed')
        })
    })()

})