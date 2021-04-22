"use strict";

(function () {
  var React = CrafterCMSNext.React;
  var ReactDOM = CrafterCMSNext.ReactDOM;

  async function searchYouTube(keyword) {
    const url = `${location.origin}/api/1/services/plugins/org/craftercms/plugin/youtubepicker/youtubepicker.json?keyword=${keyword}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return JSON.parse(data) || undefined;
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
      placeholder: "Search YouTube",
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

  function MyPicker() {
    const [selectedVideo, setSelectedVideo] = React.useState(null);
    const [videos, setVideos] = React.useState([]);

    const videoSearch = async keyword => {
      const res = await searchYouTube(keyword);

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

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "YouTube Picker"), /*#__PURE__*/React.createElement(SearchBar, {
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
    }

    return this;
  };

  YAHOO.extend(CStudioForms.Controls.YoutubePicker, CStudioForms.CStudioFormField, {
    getLabel: function () {
      return 'YouTube Picker';
    },
    render: function (config, containerEl) {
      // we need to make the general layout of a control inherit from common
      // you should be able to override it -- but most of the time it wil be the same
      containerEl.id = this.id;
      ReactDOM.render( /*#__PURE__*/React.createElement(MyPicker, null), containerEl);
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
    getSupportedConstraints: function () {
      return [];
    },
    getSupportedPostFixes: function () {
      return this.supportedPostFixes;
    }
  });
  CStudioAuthoring.Module.moduleLoaded('youtubepicker', CStudioForms.Controls.YoutubePicker);
})();