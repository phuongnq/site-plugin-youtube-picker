(function () {
    var React = CrafterCMSNext.React;
    var ReactDOM = CrafterCMSNext.ReactDOM;

    function searchYouTube(keyword) {
      const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${keyword}&key=AIzaSyBAQK6l_uH5cYPSMRrU9kZUP0cfJjKc3Cs`;
      const req = new XMLHttpRequest();
      return new Promise((resolve, reject) => {
        req.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              let response = JSON.parse(this.response);
              resolve(response);
            } else {
              let err = JSON.parse(this.response);
              reject(err);
            }
          }
        };

        req.onerror = function (e) {
          reject(new Error(this.statusText));
        };

        req.open('GET', url, true);
        req.send(null);
      });
    }

    function SearchBar({
      onSearchSubmit
    }) {
      const [keyword, setKeyword] = React.useState('');

      const searchChange = e => {
        setKeyword(e.target.value);
      };

      const submitSearch = e => {
        e.preventDefault();
        onSearchSubmit(keyword);
      };

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
        onSubmit: submitSearch,
        style: {
          marginTop: '20px'
        }
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        placeholder: "Search Youtube",
        className: "form-control",
        onChange: searchChange
      })));
    }

    function VideoList({
      videos,
      onVideoSelect
    }) {
      const list = videos.map(video => /*#__PURE__*/React.createElement(VideoListItem, {
        onVideoSelect: onVideoSelect,
        key: video.etag,
        video: video
      }));
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
        className: "col-md-4 list-group",
        style: {
          marginTop: '20px'
        }
      }, list));
    }

    function VideoListItem({
      video,
      onVideoSelect
    }) {
      const imgUrl = video.snippet.thumbnails.default.url;
      return /*#__PURE__*/React.createElement("li", {
        className: "list-group-item",
        onClick: () => onVideoSelect(video)
      }, /*#__PURE__*/React.createElement("div", {
        className: "video-list-media"
      }, /*#__PURE__*/React.createElement("div", {
        className: "media-left"
      }, /*#__PURE__*/React.createElement("img", {
        className: "media-object",
        src: imgUrl
      })), /*#__PURE__*/React.createElement("div", {
        className: "media-body"
      }, /*#__PURE__*/React.createElement("div", {
        className: "media-heading"
      }, /*#__PURE__*/React.createElement("div", null, video.snippet.title)))));
    }

    function VideoDetail({
      video
    }) {
      if (!video) {
        return /*#__PURE__*/React.createElement("div", null, "");
      }

      const videoId = video.id.videoId;
      const url = `https://youtube.com/embed/${videoId}`;
      return /*#__PURE__*/React.createElement("div", {
        className: "video-detail col-md-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "embed-responsive embed-responsive-16by9",
        style: {
          marginTop: '20px'
        }
      }, /*#__PURE__*/React.createElement("iframe", {
        className: "embed-responsive-item",
        src: url
      })), /*#__PURE__*/React.createElement("div", {
        className: "details"
      }, /*#__PURE__*/React.createElement("div", null, video.snippet.title), /*#__PURE__*/React.createElement("div", null, video.snippet.description)));
    }

    function MyPicker() {
      const [selectedVideo, setSelectedVideo] = React.useState(null);
      const [videos, setVideos] = React.useState([]);

      const videoSearch = async keyword => {
        const res = await searchYouTube(keyword);

        if (res && res.items && res.items.length >= 0) {
          setVideos(res.items);
          setSelectedVideo(res.items[0]);

          if (typeof $ === 'function') {
            const video = res.items[0];
            $('#youtubeID_s').find('input')[0].value = video.id.videoId;
            $('#title_s').find('input')[0].value = video.snippet.title;
            $('#description_t').find('textarea')[0].value = video.snippet.description;
            $('#posterImage_s').find('input')[0].value = video.snippet.thumbnails.high.url;
          }
        }
      };

      const onSelectVideo = video => {
        setSelectedVideo(video);

        if (typeof $ === 'function') {
          $('#youtubeID_s').find('input')[0].value = video.id.videoId;
          $('#title_s').find('input')[0].value = video.snippet.title;
          $('#description_t').find('textarea')[0].value = video.snippet.description;
          $('#posterImage_s').find('input')[0].value = video.snippet.thumbnails.high.url;
        }
      };

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Youtube Picker"), /*#__PURE__*/React.createElement(SearchBar, {
        onSearchSubmit: keyword => videoSearch(keyword)
      }), /*#__PURE__*/React.createElement(VideoDetail, {
        video: selectedVideo
      }), /*#__PURE__*/React.createElement(VideoList, {
        onVideoSelect: selectedVideo => onSelectVideo(selectedVideo),
        videos: videos
      }));
    }

    CStudioForms.Controls.YoutubePicker =
    CStudioForms.Controls.YoutubePicker ||
    function(id, form, owner, properties, constraints) {
      this.owner = owner;
      this.owner.registerField(this);
      this.errors = [];
      this.properties = properties;
      this.constraints = constraints;
      this.inputEl = null;
      this.countEl = null;
      this.required = false;
      this.value = '_not-set';
      this.form = form;
      this.id = id;
      this.supportedPostFixes = ['_s'];

      return this;
    };

    YAHOO.extend(CStudioForms.Controls.YoutubePicker, CStudioForms.CStudioFormField, {
      getLabel: function() {
        return 'Youtube Picker';
      },

      render: function(config, containerEl) {
        // we need to make the general layout of a control inherit from common
        // you should be able to override it -- but most of the time it wil be the same
        containerEl.id = this.id;

        ReactDOM.render( /*#__PURE__*/React.createElement(MyPicker, null), containerEl);
      },

      getValue: function() {
        return this.value;
      },

      setValue: function(value) {
        this.value = value;
      },

      getName: function() {
        return 'youtube-picker';
      },

      getSupportedProperties: function() {
        return [{ label: CMgs.format(langBundle, 'text'), name: 'text', type: 'string' }];
      },

      getSupportedConstraints: function() {
        return [];
      },

      getSupportedPostFixes: function() {
        return this.supportedPostFixes;
      }
    });

    CStudioAuthoring.Module.moduleLoaded('youtube-picker', CStudioForms.Controls.YoutubePicker);
  })();