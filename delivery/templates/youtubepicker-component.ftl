<#import "/templates/system/common/cstudio-support.ftl" as studio />

<#assign video = contentModel.youtubePicker_s?eval>
<#assign videoId = video.id.videoId>
<#assign url = "https://youtube.com/embed/${videoId}" >
<#assign title = video.snippet.title >
<#assign imgUrl = video.snippet.thumbnails.high.url>
<#assign description = video.snippet.description>

<section>
  <div class="video-detail col-md-12 text-center">
    <h2>${title}</h2>
    <div><img src=${imgUrl} /></div>
    <div class="panel-body">
      <div>${description}</div>
    </div>
    <div class="embed-responsive embed-responsive-16by9" style="margin-top: 20px;">
      <iframe class="embed-responsive-item" src=${url}></iframe>
    </div>
  </div>
</section>
