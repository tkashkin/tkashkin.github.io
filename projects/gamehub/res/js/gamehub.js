(function(){
	function get(url, cb)
	{
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.onreadystatechange = function()
		{
			if(request.readyState != 4) return;
			if(request.status != 200)
			{
				console.error(request.statusText, request);
			}
			else
			{
				cb(request.responseText);
			}
		}
		request.send();
	}

	var asset_types = {
		'.deb': 'a.package-deb',
		'.AppImage': 'a.package-appimage',
		'.flatpak': 'a.package-flatpak'
	};

	function asset_update_links(asset)
	{
		if(asset.name.startsWith("GameHub-bionic-"))
		{
			for(var ext in asset_types)
			{
				if(asset.name.endsWith(ext))
				{
					q(asset_types[ext], function(link)
					{
						link.href = asset.browser_download_url;
						var counter = link.querySelector('span.counter');
						if(counter)
						{
							counter.innerText = asset.download_count;
							counter.classList.add('visible');
						}
					});
					return;
				}
			}
		}
	}

	setTimeout(function(){
		get('https://api.github.com/repos/tkashkin/GameHub/releases', function(data)
		{
			try
			{
				var releases = JSON.parse(data);
				var assets = releases[0].assets;
				for(var i in assets)
				{
					var asset = assets[i];
					asset_update_links(asset);
				}
			}
			catch(e)
			{
				console.error(e);
			}
		});
	}, 0);
})();
