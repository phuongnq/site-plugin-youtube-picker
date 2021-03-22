# site-plugin-youtube-picker

A site plugin for CrafterCMS to integrete Youtube Video


## Setup

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
