import org.apache.commons.lang3.StringUtils

def result = [:]

def site = request.getParameter("siteId")
if (StringUtils.isEmpty(site)) {
   result.code = 400;
   result.message = "Invalid siteId"
   return result
}

def keyword = request.getParameter("keyword")
if (StringUtils.isEmpty(keyword)) {
   result.code = 400;
   result.message = "Invalid keyword"
   return result
}

def siteService = applicationContext["cstudioSiteServiceSimple"]
def textEncryptor = applicationContext["crafter.textEncryptor"]
def config = siteService.getConfiguration(site, "site-config.xml", false);

if (config.youtubePicker != null && config.youtubePicker.apiKey != null) {
   def apiKeyEncrypt = config.youtubePicker.apiKey.trim()
   def apiKey = textEncryptor.decrypt(apiKeyEncrypt)

   def searchUrl = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=' + keyword + '&key=' + apiKey
   def get = new URL(searchUrl).openConnection()
   def getRC = get.getResponseCode()

   if (getRC.equals(200)) {
      def data = get.getInputStream().getText()
      result.code = 200
      result.data = data
      return result
   }
} else {
   result.code = 400
   result.message = "Invalide YouTube API Key"
}

return null