"use strict";

(function () {
  var React = CrafterCMSNext.React;
  var ReactDOM = CrafterCMSNext.ReactDOM;

  async function searchYouTube(keyword, googleApiKey) {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${keyword}&key=${googleApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data || undefined;
    } catch (ex) {
      return undefined;
    }
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
      return /*#__PURE__*/React.createElement("div", null);
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

  function MyPicker({
    googleApiKey
  }) {
    const [selectedVideo, setSelectedVideo] = React.useState(null);
    const [videos, setVideos] = React.useState([]);

    const videoSearch = async keyword => {
      const res = await searchYouTube(keyword, googleApiKey);

      if (res && res.items && res.items.length >= 0) {
        setVideos(res.items);
        setSelectedVideo(res.items[0]);
        const video = res.items[0];
        updateInputs(video);
      }
    };

    const onSelectVideo = video => {
      setSelectedVideo(video);
      updateInputs(video);
    };

    const updateInputs = video => {
      if (typeof $ !== 'function') return;
      $('#youtubeID_s').find('input')[0].focus();
      $('#youtubeID_s').find('input')[0].value = video.id.videoId;
      $('#title_s').find('input')[0].focus();
      $('#title_s').find('input')[0].value = video.snippet.title;
      $('#description_t').find('textarea')[0].focus();
      $('#description_t').find('textarea')[0].value = video.snippet.description;
      $('#posterImage_s').find('input')[0].focus();
      $('#posterImage_s').find('input')[0].value = video.snippet.thumbnails.high.url;
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

  CStudioForms.Controls.YoutubePicker = CStudioForms.Controls.YoutubePicker || function (id, form, owner, properties, constraints) {
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

    if (properties) {
      var required = constraints.find(function (property) {
        return property.name === 'required';
      });

      if (required) {
        this.required = required.value === 'true';
      }

      var googleapi_key = properties.find(function (property) {
        return property.name === 'googleapi_key';
      });

      if (googleapi_key) {
        this.googleapi_key = googleapi_key.value;
      }
    }

    return this;
  };

  YAHOO.extend(CStudioForms.Controls.YoutubePicker, CStudioForms.CStudioFormField, {
    getLabel: function () {
      return 'Youtube Picker';
    },
    render: function (config, containerEl) {
      // we need to make the general layout of a control inherit from common
      // you should be able to override it -- but most of the time it wil be the same
      containerEl.id = this.id;
      var googleApiKey = this.googleapi_key;
      ReactDOM.render( /*#__PURE__*/React.createElement(MyPicker, {
        googleApiKey
      }), containerEl);
    },
    getValue: function () {
      return this.value;
    },
    setValue: function (value) {
      this.value = value;
    },
    getName: function () {
      return 'youtubepicker';
    },
    getSupportedProperties: function () {
      return [{
        label: 'Google API Key',
        name: 'googleapi_key',
        type: 'string',
        defaultValue: ''
      }];
    },
    getSupportedConstraints: function () {
      return [];
    },
    getSupportedPostFixes: function () {
      return this.supportedPostFixes;
    }
  });
  CStudioAuthoring.Module.moduleLoaded('youtubepicker', CStudioForms.Controls.YoutubePicker);
})();