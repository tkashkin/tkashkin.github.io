(function(){
	function q(selector, fn)
	{
		var els = document.querySelectorAll(selector);
		if(fn)
		{
			for(var i = 0; i < els.length; i++)
			{
				fn(els[i]);
			}
		}
		return els;
	}
	function e(selector, ename, fn)
	{
		return q(selector, function(el){
			el.addEventListener(ename, fn);
		});
	}

	function localize(lang)
	{
		lang = lang || 'en';
		lang = lang.split('-')[0].toLowerCase();
		if(['en', 'ru'].indexOf(lang) < 0) return;

		localStorage.getItem('lang', lang);

		var attr = 'data-text-' + lang;
		q('[' + attr + ']', function(el){
			if(!el.dataset.textEn) el.dataset.textEn = el.innerText;
			el.innerText = el.getAttribute(attr);
		});
		q('nav.language-selector [data-lang]', function(el){
			el.classList.remove('active');
		});
		q('nav.language-selector [data-lang=' + lang + ']', function(el){
			el.classList.add('active');
		});
	}

	function update_header_nav_scroll(el, header, anchors)
	{
		var offset = window.pageYOffset || document.documentElement.scrollTop;
		var sticky = offset > header.clientHeight;
		if(sticky)
		{
			el.classList.add('sticky');
			for(var i = anchors.length - 1; i >= 0; i--)
			{
				var anchor = anchors[i];
				var rect = anchor.getBoundingClientRect();
				if(rect.top < 64)
				{
					var a = e('body > nav > section > a[href$="' + anchor.name + '"]')[0]
					if(a)
					{
						var o = e('body > nav > section > a.active')[0];
						if(o) o.classList.remove('active');
						a.classList.add('active');
					}
					return;
				}
			}
		}
		else
		{
			el.classList.remove('sticky');
		}
		var o = e('body > nav > section > a.active')[0];
		if(o) o.classList.remove('active');
		e('body > nav > section > a.initial')[0].classList.add('active');
	}

	setTimeout(function(){
		localize(localStorage.getItem('lang') || navigator.language || navigator.userLanguage);

		if(!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) document.body.classList.add('ios');
		if(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && !(!!navigator.userAgent.match(/Linux/))) document.body.classList.add('safari');

		e('nav.language-selector', 'click', function(e){
			if(e.target !== e.currentTarget && e.target.dataset && e.target.dataset.lang)
			{
				localize(e.target.dataset.lang);
			}
			e.stopPropagation();
		});

		var header = q('body > header')[0];
		var nav = q('body > nav')[0];

		var anchors = q('h2 > a.anchor');

		var f = function(){ update_header_nav_scroll(nav, header, anchors); };
		window.addEventListener('scroll', f);
		window.addEventListener('hashchange', f);
		f();
	}, 0);

	localize(localStorage.getItem('lang') || navigator.language || navigator.userLanguage);
})();
