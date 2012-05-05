var API = {
  BaseURL: function() {
    this.protocol = 'https';
    this.host     = 'api.desktoppr.co';

    this.urlByAppendingPath = function(path) {
      return this.protocol + '://' + this.host + path;
    };

    return this;
  },

  User: function(id, username) {
    this.baseURL  = new API.BaseURL();
    this.id       = id;
    this.username = username;

    this.getRandomWallpaperURL = function(callback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var json = JSON.parse(xhr.response);
          callback(json.response.image.url);
        }
      }
      xhr.open("GET", this.baseURL.urlByAppendingPath('/' + this.id + '/users/' + this.username + '/wallpapers/random'), true);
      xhr.send();
    };
  }
};

var Cache = function() {
  this.storage = window.localStorage;
  this.images  = JSON.parse(this.storage.getItem('cache') || '[]');

  this.addImage = function(image) {
    this.images.push(image);
    this.save();
  };

  this.save = function() {
    this.storage.setItem('cache', JSON.stringify(this.images));
  };

  return this;
};

var Loader = function() {
  var _isExecuting = false;

  this.cache = new Cache();
  this.user  = new API.User('1', 'keithpitt');

  this.load = function() {
    if (_isExecuting) return;
    _isExecuting = true;
    var _this = this;
    this.user.getRandomWallpaperURL(function(url) {
      var image    = new Image();
      image.onload = function() {
        _this.cache.addImage({url: url});
        _isExecuting = false;
      };
      image.src = url;
    });
  };

  return this;
};

window.loader = new Loader();

window.tabDidLoad = function() {
  loader.load();
};
