def keyword = params["keyword"]

def list = siteConfig.getDocument().getElementsByTagName('youtubePicker')
def key = list.item(0)
def apiKeyEncrypt = list.item(0).getElementsByTagName('apiKey').item(0).getTextContent().trim()
def apiKey = textEncryptor.decrypt(apiKeyEncrypt)

def searchUrl = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=' + keyword + '&key=' + apiKey
def get = new URL(searchUrl).openConnection();
def getRC = get.getResponseCode();

if (getRC.equals(200)) {
    def data = get.getInputStream().getText()
    return data
}

return null