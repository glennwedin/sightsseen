const tools = {
	ajax: function (options) {
		let settings = {
			url: '', 
			data: 'GET', 
			type: 'json', 
			callback: null
		};
		settings.assign(options);

		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4 && xhr.status === 200) {
				if(settings.callback) {
					callback(xhr.responseText);
				}
			}
		}
		xhr.open(type, url);
		xhr.send(data);
	},

	Transitions: function () {
		return {
			/*Hammer må være ekstern?*/
			flipout: function (elmnt, opts) {
				var el = document.querySelector(elmnt),
					hammertime = new Hammer(el, {}),
					scale = 1,
					drag = 0,
					rotate = 0,
					delta = 0,
					maxDelta = 150,
					horizontal = null;

				hammertime.on('pan', function(ev) {
					//ev.preventDefault();
					delta = ev.deltaX;

				   	if(ev.direction === 4) {
				   		drag = drag+0.01;
				    	rotate += 0.5;
				    	scale = scale-0.005;
					} else if(ev.direction === 2) {
						drag = drag-0.01;
						rotate -= 0.5;
				    	scale = scale+0.005;
					}

				    el.style.transform = 'translate('+(ev.deltaX*drag)*2+'px,0) rotate('+rotate+'deg) scale('+scale+')';
				});

				hammertime.on('panend', function () {
					horizontal = null;
					if(delta < maxDelta) {
						drag = 0;
						scale = 1;
						rotate = 0;
						el.style.transform = '';
						el.style.transition = 'all .3s ease-in';
							el.addEventListener('transitionend', function () {
								el.style.transition = '';
							});
					}
					if(delta > maxDelta) {
					   	el.addEventListener('transitionend', function () {
					   		if(opts.after) {
								opts.after(hammertime);
							}
					   		el.style.transform = '';
							el.style.transition = '';
					   	});
					   	el.style.transition = 'all .6s ease-in';
					   	el.style.transform = 'translate(1000px,0) rotate(180deg) scale(0)';
					}
				});
				
			}
		}
	}
}

export default tools;