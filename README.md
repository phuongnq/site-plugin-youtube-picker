# site-plugin-youtube-picker

A site plugin for CrafterCMS to integrete YouTube Video

## Setup

### Copy control file to plugin

Source code: `src/main.js`.

Build with Babel to output to `authoring/control/youtubepicker/main.js`.

```
mkdir -p ${SITE}/sandbox/config/studio/plugins/control/youtubepicker/ # If directory is not created
cp authoring/control/youtubepicker/main.js ${SITE}/sandbox/config/studio/plugins/control/youtubepicker/main.js
```

Then commit

### Update site-config-tool.xml

```
vim ${SITE}/sandbox/config/studio/administration/site-config-tools.xml

 <controls>
    <control>
        <plugin>
            <type>control</type>
            <name>youtubepicker</name>
            <filename>main.js</filename>
        </plugin>
        <icon>
            <class>fa-youtube</class>
        </icon>
    </control>
...
</controls>
```

Then commit

Or via UI


### Update Google API Key

https://console.cloud.google.com/apis/dashboard

Sample: `AIzaSyBAQK6l_uH5cYPSMRrU9kZUP0cfJjKc3Cs`

Update studio blacklist:

```
# method java.net.URL openConnection
…
# staticMethod org.codehaus.groovy.runtime.DefaultGroovyMethods getAt java.lang.Object java.lang.String
```

Update studio-config.yaml:

```
# Indicates if access to beans should be restricted
studio.scripting.restrictBeans: false
# List of patterns for bean names that should be accessible for the scripts (regexes separated by commas)
studio.scripting.allowedBeans: 'cstudioSiteServiceSimple,crafter.textEncryptor'
```
