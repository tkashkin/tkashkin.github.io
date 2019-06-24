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
		'.deb': 'li.package-deb > a',
		'.AppImage': 'li.package-appimage > a',
		'.flatpak': 'li.package-flatpak > a'
	};

	function update_release(release)
	{
		console.log(release);
		q(release.prerelease ? 'li.release-dev' : 'li.release-master', function(root)
		{
			root.firstElementChild.href = release.html_url;
			root.querySelector('span.version').innerText = release.name;
			for(var i in release.assets)
			{
				var asset = release.assets[i];
				if(asset.name.startsWith("GameHub-"))
				{
					for(var ext in asset_types)
					{
						if(asset.name.endsWith(ext))
						{
							root.querySelector(asset_types[ext]).href = asset.browser_download_url;
							break;
						}
					}
				}
			}
		});
	}

	setTimeout(function(){
		get('https://api.github.com/repos/tkashkin/GameHub/releases', function(data)
		{
			try
			{
				var releases = JSON.parse(data);
				var master_processed = false;
				var dev_processed = false;
				for(var r in releases)
				{
					var release = releases[r];
					if(!release.prerelease && !master_processed)
					{
						update_release(release);
						master_processed = true;
					}
					if(release.prerelease && !dev_processed)
					{
						update_release(release);
						dev_processed = true;
					}
					if(master_processed && dev_processed) break;
				}
			}
			catch(e)
			{
				console.error(e);
			}
		});
	}, 0);
})();
