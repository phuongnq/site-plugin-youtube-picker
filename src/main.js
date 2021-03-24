(function () {
  var React = CrafterCMSNext.React;
  var ReactDOM = CrafterCMSNext.ReactDOM;

  async function searchYouTube(keyword, googleApiKey) {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${keyword}&key=${googleApiKey}`
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data || undefined;
    } catch (ex) {
      return undefined;
    }
  }

  function SearchBar({ onSearchSubmit }) {
    const [keyword, setKeyword] = React.useState('');

    const searchChange = (e) => {
      setKeyword(e.target.value);
    };

    const submitSearch = (e) => {
      e.preventDefault();
      onSearchSubmit(keyword);
    };

    return (
      <div>
          <form onSubmit={submitSearch} style={{marginTop:'20px'}}>
            <input
              type="text"
              placeholder="Search Youtube"
              className="form-control"
              onChange={searchChange}
            />
          </form>
        </div>
    );
  }

  function VideoList({ videos, onVideoSelect }) {
    const list = videos.map((video) =>
      <VideoListItem
        onVideoSelect={onVideoSelect}
        key={video.etag}
        video={video}
      />
    );
    return (
      <div>
        <ul className="col-md-4 list-group" style={{marginTop:'20px'}}>
          {list}
        </ul>
      </div>
    )
  }

  function VideoListItem({ video, onVideoSelect }) {
    const imgUrl = video.snippet.thumbnails.default.url;
    return (
      <li className="list-group-item"  onClick={() => onVideoSelect(video)}>
        <div className="video-list-media">
          <div className="media-left">
            <img className="media-object" src={imgUrl} />
          </div>

          <div className="media-body">
            <div className="media-heading">
              <div>{video.snippet.title}</div>
            </div>
          </div>

        </div>
      </li>
    );
  }

  function VideoDetail({ video }) {
    if (!video) {
      return(
        <div>
        </div>
      )
    }

    const videoId = video.id.videoId;
    const url = `https://youtube.com/embed/${videoId}`;

    return (
      <div className="video-detail col-md-8">
        <div className="embed-responsive embed-responsive-16by9" style={{marginTop:'20px'}}>
          <iframe className="embed-responsive-item" src={url}></iframe>
        </div>
        <div className="details">
          <div>{video.snippet.title}</div>
          <div>{video.snippet.description}</div>
        </div>
      </div>
    )
  }

  function MyPicker({ googleApiKey }) {
    const [selectedVideo, setSelectedVideo] = React.useState(null);
    const [videos, setVideos] = React.useState([]);

    const videoSearch = async (keyword) => {
      const res = await searchYouTube(keyword, googleApiKey);

      if (res && res.items && res.items.length >= 0) {
        setVideos(res.items);
        setSelectedVideo(res.items[0]);
        const video = res.items[0];
        updateInputs(video);
      }
    };

    const onSelectVideo = (video) => {
      setSelectedVideo(video);
      updateInputs(video);
    };

    const updateInputs = (video) => {
      if (typeof $ !== 'function') return;

      $('#youtubeID_s').find('input')[0].focus();
      $('#youtubeID_s').find('input')[0].value = video.id.videoId;

      $('#title_s').find('input')[0].focus();
      $('#title_s').find('input')[0].value = video.snippet.title;

      $('#description_t').find('textarea')[0].focus();
      $('#description_t').find('textarea')[0].value = video.snippet.description;

      $('#posterImage_s').find('input')[0].focus();
      $('#posterImage_s').find('input')[0].value = video.snippet.thumbnails.high.url;
    }

    return (
      <div>
        <h4>Youtube Picker</h4>
        <SearchBar onSearchSubmit={(keyword) => videoSearch(keyword)} />
        <VideoDetail video={selectedVideo}/>
        <VideoList
          onVideoSelect={(selectedVideo) => onSelectVideo(selectedVideo)}
          videos={videos}
        />
      </div>
    );
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

    if (properties) {
      var required = constraints.find(function(property) {
        return property.name === 'required';
      });
      if (required) {
        this.required = required.value === 'true';
      }
      var googleapi_key = properties.find(function(property) {
        return property.name === 'googleapi_key';
      });
      if (googleapi_key) {
        this.googleapi_key = googleapi_key.value;
      }
    }

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
      var googleApiKey = this.googleapi_key;

      ReactDOM.render( /*#__PURE__*/React.createElement(MyPicker, { googleApiKey }), containerEl);
    },

    getValue: function() {
      return this.value;
    },

    setValue: function(value) {
      this.value = value;
    },

    getName: function() {
      return 'youtubepicker';
    },

    getSupportedProperties: function() {
      return [{ label: 'Google API Key', name: 'googleapi_key', type: 'string', defaultValue: '' }];
    },

    getSupportedConstraints: function() {
      return [];
    },

    getSupportedPostFixes: function() {
      return this.supportedPostFixes;
    }
  });

  CStudioAuthoring.Module.moduleLoaded('youtubepicker', CStudioForms.Controls.YoutubePicker);
})();