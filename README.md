This is a project to stand a a reproducible repo for a realm js bug on versions > 12.2.1.
(https://github.com/realm/realm-js/issues/6889)

I used node 18.18.

> yarn (to install all libraries)
> yarn android (to build and install on android)
> yarn start (to launch metro bundler)

After the app starts, tap on the only button isible on the screen. Then check logs:

```
 LOG  metaFields prior to add:  1
 LOG  metaFields after add:  0
```

The subtable of Participant, which is an array of objects ParticipantMeta, will be empty, even though we didn't make any change to the object Participant.