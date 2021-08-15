const awan = {
	_eventsMap: [
		{attr: 'onclick', event: 'click'},
		{attr: 'onchange', event: 'change'},
		{attr: 'onkeypress', event: 'keypress'},
		{attr: 'onkeyup', event: 'keyup'},
		{attr: 'onkeydown', event: 'keydown'},
		{attr: 'onblur', event: 'blur'},
		{attr: 'onmousemove', event: 'mousemove'},
		{attr: 'onmousedown', event: 'mousedown'},
		{attr: 'onmouseup', event: 'mouseup'}
	],
	_endpoint: function(request){
		return this._endpoint_url + request + '/' + this._api_key;		
	},
	_mainNodes: [],
	_staticNodes: [],
	_subNode: null,
	_currentNode: null,
	_prepLoop: function (_el){
		
		var _loopID = 0;
		var _loops = [];
		
		_el.querySelectorAll('[loop]').forEach(function(_lel){
			
			var _npl = true; // no parent loop
			var _a = _lel;
			while (_a) { // recursion to parents
				
				if (_a.tagName != 'BODY'){
					_a = _a.parentNode;
					if (_a){
						if (_a.getAttribute('loop')){
							_npl = false;
							_a = false;
						}
					}
				} else {
					_a = false;
				}
			}
			
			if (_npl){
				var _singleNode = 0;
				_lel.parentNode.childNodes.forEach(function(node){
					
					if (node.nodeName == '#text' && (node.nodeValue+'').trim().length > 0){
						_singleNode++;
					} else if (node.nodeName != '#text') {						
						_singleNode++;
					}
				})
				
				
				if (_singleNode == 1){

					_lel.parentNode.setAttribute('lid',_loopID);
					
				} else {
				
					var _lc = document.createElement('l');
					_lc.setAttribute('lid',_loopID);
					_lel.parentNode.insertBefore(_lc, _lel);
					_lc.appendChild(_lel)
				}
			
				var _t = _lel.getAttribute('loop').split(' as ');
			
				_loops[_loopID] = {
					_el: _lel,
					_id: _loopID,
					_collection: _t[0].trim(),
					_single: _t[1].trim()
				}
			}
			
			_loopID++;	
			
		})
		
		return _loops;
	
	},
	_prep: function(_el, _key, _collection, _idx){
		
		var _node = {
			_idx: _idx,
			_collection: _collection,
			_key: _key
		};
		var _loops = this._prepLoop(_el)
		
		_el.querySelectorAll('l').forEach(function(_lel){
			var _npl = true;
			var _a = _lel;
			while (_a) {
				if (_a.tagName != 'BODY'){
					_a = _a.parentNode;
					if (_a){
						if (_a.getAttribute('loop')){
							_npl = false;
							_a = false;
						}
					}
				} else {
					_a = false;
				}
				 
			}
			if (_npl) _lel.innerHTML = '';
		})
		
		
		var _vhtml = _el.innerHTML;	
	
				
		var _attr_expressions = _vhtml.match(/<(.*)">/g);
		var _aexpr = [];
		var _aID = 0;
		
		
		
		for (var _i in _attr_expressions){
			var _shtml = _attr_expressions[_i];
						
			var _subattr_expressions = _shtml.match(/\w+=\"[\w-_'\(\)\/\t\s]{0,}\{\{[\w\(\)!$%^*+:,.;'"?&#<>\[\]\^=\/\-\t\s]+\}\}[\w-_'\(\)\/\t\s]{0,}\"/g);
			
			if (Array.isArray(_subattr_expressions)){
				var _saexpr = [];
				for (var _j in _subattr_expressions){
					
				
					var t = _subattr_expressions[_j].split('"');
					
					var _attr = t[0].replace('=','');
					var _expr = t[1].match(/\{\{[\w\(\)!$%^*+:,.;'"?&#<>\[\]\^=\/\- 	]+\}\}/g)[0].replace('}}','').replace('{{','');
					var x = t[1].split('{{');
					var _leading = x[0].replace('"').trim();
					var y = t[1].split('}}');
					var _trailing = y[1].replace('"').trim();
					
					
					
					_shtml = this._replaceAll(_shtml, _subattr_expressions[_j], '');
					_saexpr.push({
						attr: _attr,
						expr: _expr,
						trailing: _trailing,
						leading: _leading
					});
				}
				_aexpr[_aID] = _saexpr;
				_vhtml = this._replaceAll(_vhtml, _attr_expressions[_i], _shtml.replace('>','aid="a-'+_aID+'">'));
				_aID++;				
			}
		}
		
		
		var _expressions = _vhtml.match(/>\s{0,}\{\{[\w\(\)!$%^*+:,.;'"?&#<>\[\]\^=\/\- 	]+\}\}\s{0,}\</g);
		var _expr = [];
		var _eID = 0;
		
		for (var _i in _expressions){
			
			_expr['a-'+_eID] = _expressions[_i].match(/\{\{[\w\(\)!$%^*+:,.;'"?&#<>\[\]\^=\/\- 	]+\}\}/g)[0];
			_vhtml = this._replaceAll(_vhtml, _expressions[_i], '><v id="a-'+_eID+'"></v><');
			_eID++;
		}
		
		var _expressions = _vhtml.match(/\{\{[\w\(\)!$%^*+:,.;'"?&#<>\[\]\^=\/\- 	]+\}\}/g);
		
		
		for (var _i in _expressions){
			_expr['a-'+_eID] = _expressions[_i];
			_vhtml = this._replaceAll(_vhtml, _expressions[_i], '<v id="a-'+_eID+'"></v>');
			_eID++;
		}

		_el.innerHTML = _vhtml;
		
		var _els = [];
		var _aels = [];
		var _lels = [];
		
		for (var _id in _expr){
			
			_els[_id] = _el.querySelector('#'+_id);
			_els[_id].removeAttribute('aid');
		}
		
		for (var _id in _aexpr){
			_aels[_id] = _el.querySelector('[aid="a-'+_id+'"]');
			_aels[_id].removeAttribute('aid');
		}
				
		for (var _id in _loops){
			
			try {
				_lels[_id] = _el.querySelector('[lid="'+_id+'"]')
				_lels[_id].removeAttribute('lid');
				
				_loops[_id]._lc = _lels[_id];
			} catch (e){
				
			}
		}
		
		var _bindvals = _el.querySelectorAll('[bind]');
		var _bels = [];
		
		_bindvals.forEach(function(_el){
			
			var _bind = _el.getAttribute('bind');
			var _ccol;
			
			if (_collection){
				_ccol = _collection+'['+_idx+'].'+_bind.replace(_key+'.','');
				
			}
			

			_el.addEventListener('change', function(){
				awan._subNode = false;
				awan._render(awan._currentNode);
				awan._render(awan._staticNode);
			})
			
			_el.addEventListener('keyup', function(){
				
				awan._subNode = _node;
				
				var _value = _el.value;
				if (_ccol){
					eval(_ccol+' = _value');
				} else {
					eval(_bind+' = _value');
				}
			})
			
			_bels.push({
				el: _el,
				bind: _el.getAttribute('bind'),
				type: _el.getAttribute('type'),
				tag: _el.tagName
			});
		})
	
		
		for (var _i in this._eventsMap){
			var _ev_els = _el.querySelectorAll('['+this._eventsMap[_i].attr+']');
			that = this;
			_ev_els.forEach(function(_el){
				var _expr = _el.getAttribute(that._eventsMap[_i].attr);
				_el.addEventListener(that._eventsMap[_i].event, function(){
					
					awan._subNode = false;
					
					var go = function(page, isBack){
						awan.go(page,isBack);
					}
					eval(_expr);
				})
				_el.removeAttribute(that._eventsMap[_i].attr)
			})
			
		}

		_node._expr = _expr;
		_node._aexpr = _aexpr,
		_node._loops = _loops,
		_node._els = _els,
		_node._aels = _aels,
		_node._bels = _bels
	
		
		
		return _node;
	},
	_renderLoop: function(_loop, _lkey, _lcol, _idx){
		var _collection;
		var _ccol = '';
		
		eval('_collection = ' + _loop._collection);
		if (_collection){
			eval(_loop._single + ' = _collection[_idx]');
		}		
		
		if (_idx){
			
			
						
			_ccol = _lcol+'['+_idx+'].'+_loop._collection.replace(_lkey+'.','');
			eval('_collection = ' + _loop._collection);
			//eval('_collection = ' + _lcol+'['+_idx+'].'+_loop._collection.replace(_lkey+'.',''));
			
			
		} else {
			eval('_collection = ' + _loop._collection);
		}
		
		
		var _parent = _loop._lc;
		_parent.innerHTML = '';
		_loop._el.removeAttribute('loop')
		
		for (var _i in _collection){
			
			
			
			var _child = _loop._el.cloneNode(true)
			var _slcol = _ccol ? _ccol : _loop._collection;
			var _slkey = _loop._single;
			
			
			_parent.appendChild(_child);
			var _node = this._prep(_child, _slkey, _slcol, _i);
			
			_node._idx = _i;
			
			this._render(_node, _slkey, _slcol, _i);
			
		}
	},
	_render: function(_node, _lkey, _lcol, _idx){
		
		
		
		var t0;
		if (!this._renderExecuting){
			t0 = performance.now();	
			this._renderExecuting = true;
		}
		
		
		
		
		
		if (_lkey){
			eval(_lkey + ' = '+ _lcol+'['+_idx+']');
		}
		
		var _expr = _node._expr;
		var _aexpr = _node._aexpr;
		var _els = _node._els;
		var _aels = _node._aels;
		var _bels = _node._bels;
		var _loops = _node._loops;
		
		for (var _i in _loops){
			this._renderLoop(_loops[_i], _lkey, _lcol, _node._idx);
		}

		for (var _id in _expr){
			try {
				eval('var _value = ' + _expr[_id].replace('{{','').replace('}}',''));
			} catch(e) {
				var _value = '';
			}
			_els[_id].innerHTML = _value;
		}
		
		for (var _id in _aexpr){
			
			if (Array.isArray(_aexpr[_id])){
				for (var _n in _aexpr[_id]){
					try {
						eval('var _value = ' + _aexpr[_id][_n].expr);
					} catch(e) {
						var _value = '';
					}
					_aels[_id].setAttribute(_aexpr[_id][_n].attr, _aexpr[_id][_n].leading + ' ' +  _value + ' ' + _aexpr[_id][_n].trailing);	
				}
			} else {
				eval('var _value = ' + _aexpr[_id].expr);
				_aels[id].setAttribute(_aexpr[_id].attr, _aexpr[_id][_n].leading + ' ' +  _value + ' ' + _aexpr[_id][_n].trailing);	
			}
		}
		
		for (var _i in _bels){
			try {
				eval('var _value = ' + _bels[_i].bind);
			} catch (e){
				var _value = '';
			}
			if (!_value) _value = '';
			_bels[_i].el.value = _value;
		}
		
		
		
		
		if (t0){
			var t1 = performance.now();
			var ms = t1 - t0;
//			console.log('Rendering took '+ms+' miliseconds')
		}
		
		this._renderExecuting = false;
	
	},
	_transit: function(){
		var page = window.location.hash;
		
		var el = document.querySelector(page)
		var init = el.getAttribute('init');	
		this._currentPage = el.id;
		
		if (init){
			eval(init);
		}	
		
		this._render(this._mainNodes[this._currentPage])
		awan._transitPage(window.location.hash)
	},
	_transitPage: function(page){
		if (!page){
			page = '#index';
		}
		var el = document.querySelector(page);
		this._currentPage = el.id;
		
		if (awan._transitionBack){
					
			if (awan._transition){
				// to do more transitions
			} else {
				
				var oldEl = document.querySelector('.page-current');
				if (oldEl){
					oldEl.classList.remove('page-current')
					oldEl.style.left = '20%';
				}
			
				el.style.display = 'block';
				el.classList.add('page-current');
				
				setTimeout(function(){
					oldEl.style.left = '0';
				},250);
			}
			
		} else {
			
			if (awan._transition){
	
			} else {
				
				var oldEl = document.querySelector('.page-current');
				if (oldEl){
					oldEl.classList.remove('page-current')
				}
				
				el.style.display = 'block';
				el.style.left = '20%';
				
				
				setTimeout(function(){
					el.classList.add('page-current');
					el.style.left = 0;
					
				}, 100)
				
			}
		}	
	},
	_escapeRegExp: function(string){
		return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); 
	},
	_replaceAll: function(str, find, replace) {
		return str.replace(new RegExp(this._escapeRegExp(find), 'g'), replace);
	},
	_proxify: function (object, change) {
		if (object && object.__proxy__) {
			 return object;
		}
		var proxy = new Proxy(object, {
			get: function(object, name) {
				if (name == '__proxy__') {
					return true;
				}
				return object[name];
			},
			set: function(object, name, value) {
				var old = object[name];
				if (value && typeof value == 'object') {
					value = awan._proxify(value, change);
				}
				object[name] = value;
				change(object, name, old, value);
			}
		});
		for (var prop in object) {
			if (object.hasOwnProperty(prop) && object[prop] &&
				typeof object[prop] == 'object') {
				object[prop] = awan._proxify(object[prop], change);
			}
		}
		return proxy;
	},
	back: function(){
		awan._transitionBack = true;
		awan._transition = transition;
		history.back();	
	},
	set_userdata: function(d,v){
		localStorage.setItem(d,v);	
	},
	get_userdata: function(d) {
		return localStorage.getItem(d);
	},
	go: function(page, back, transition){
		
		if (back === true){
			this._transitionBack = true;		
		} else {	
			this._transitionBack = false;
		}
		
		if (transition) this._transition = transition;
		else this._transition = null;
				
		this._lastTransition = this._transition;
		window.location.hash = page;
	},
	getJSON: function(url, params, headers){
		
		return this.http('GET', url, params, headers, { responseType: 'json'});
	},
	get: function (url, params, headers){
		return this.http('GET', url, params, headers);
	},
	post: function (url, params, headers){
		return this.http('POST', url, params, headers);
	},
	postJSON: function (url, params, headers){
		headers = headers || {};
		headers['Content-Type'] = 'application/json';
		return this.http('POST', url, params, headers, { responseType: 'json'});
	},
	put: function (url, params, headers){
		return this.http('PUT', url, params, headers);
	},
	delete: function (url, params, headers){
		return this.http('DELETE', url, params, headers);
	},
	http: function(method, url, params, headers, opt) {
		opt = opt || {};
		
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open(method, url);
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					
					if (opt.responseType == 'json'){
						var response = JSON.parse(xhr.response);
					} else {
						var response = xhr.response;
					}
					
					resolve(response);
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText,
						response: opt.responseType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText
					});
				}
			};
			
			xhr.onerror = function () {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};
			
			
			if (headers) {
				Object.keys(headers).forEach(function (key){
					xhr.setRequestHeader(key, headers[key]);
				});
			}

			if (params && typeof params === 'object'){
				params = Object.keys(params).map(function(key){
					return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
				}).join('&');
			}
			
			console.log(params);
			
			
			xhr.send(params);
			
		});
	},
	alert: function(opt){
		
		var dialog = document.createElement('DIV');
		
		return new Promise(function (resolve, reject) {
			
			if (!opt.buttons) opt.buttons = [{label: 'OK'}];
			
			var buttons = '';
			
			for (var i in opt.buttons){
				var bclass = '';
				if (i == 0){
					bclass	+= ' rounded-b-l ';
				} else if (i == opt.buttons.length - 1){
					bclass	+= ' rounded-b-r ';
				}
				
				if (i != 0){
					bclass 	+= ' border-l '
				}
				buttons += '<button class="flex-grow '+bclass+' border-t px-5 py-3 active:text-gray-500" id="dialog-btn-'+i+'">'+opt.buttons[i].label+'</button>';
				
			}
		
			dialog.setAttribute('class','fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-20');
			dialog.innerHTML = `
				<div class="h-full flex w-full items-center p-5">
					<div id="dialog-popup" class="w-full mx-auto transition-all mt-10 opacity-0 text-center bg-white rounded shadow-lg">
						<div class="p-5">
							<div class="font-semibold">${opt.title}</div>
							<div class="text-sm">${opt.message}</div>
						</div>
						<div class="flex">
							${buttons}
						</div>
					</div>
				</div>`;
			document.querySelector('body').appendChild(dialog);
			
			setTimeout(function(){
				document.querySelector('#dialog-popup').setAttribute('class','w-full mx-auto transition-all mt-0 opacity-100 text-center bg-white rounded shadow-lg')
			},50)
			
			
			for (var i in opt.buttons){
				document.getElementById('dialog-btn-'+i).addEventListener('click', function(){
					dialog.remove();
					resolve(this.innerHTML);
				})
			}
			
			
				
				
		})
	},
	queryString: function(params){
		return Object.keys(params).map(function(key){
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
		}).join('&');	
	},
	init: function(data, config){
		
		let app = this._proxify(data, function(change){
			
			if (awan._renderExecuting) return;
			
			
			if (awan._subNode){
				awan._render(awan._subNode, awan._subNode._key, awan._subNode._collection, awan._subNode._idx);
				awan._render(awan._staticNode);
			} else {

				awan._render(awan._mainNodes[awan._currentPage])
				awan._render(awan._staticNode);
			}
		
		})
		
		var h = window.innerHeight;
		var w = window.innerWidth;

		
		window.app = app;
		window.location.hash = '';
		
		var that = this;
		document.querySelectorAll('div.page,div.static-container').forEach(function(el){
			
			
			if (config.orientation == 'portrait'){
				el.style.height = h + 'px';
				el.style.width = w + 'px';
			}
			
			if (el.className.indexOf('static') > -1){
				that._staticNode = that._prep(el);
				that._staticEl = el;
			} else {
				that._mainNodes[el.id] = that._prep(el);	
			}
			
		});
		
		
		if (!this._mainNodes['index']){
			throw "Index page is not defined";
		}
		
		this._currentNode = this._mainNodes['index'];
		this._staticEl.style.display = 'block';
		this._render(this._currentNode);
		this._render(this._staticNode);
		
		
		
		setTimeout(function(){
			
			window.onhashchange = function(){
				awan._transit();	
			}
			
			awan.go('#index');	
			
			setTimeout(function(){
				if (config.ready){
					config.ready();
				}
			},200)
			
		},100);
	}
	
}
