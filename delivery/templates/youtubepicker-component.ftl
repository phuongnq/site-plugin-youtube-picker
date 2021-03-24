<#import "/templates/system/common/cstudio-support.ftl" as studio />

<section>
  <header class="major">
    <h2>${contentModel.title_s}</h2>
  </header>
  <p>
    ${contentModel.description_t}
  </p>
  <p>
    <img src="${contentModel.posterImage_s}" />
  </p>
  <div>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${contentModel.youtubeID_s}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</section>
