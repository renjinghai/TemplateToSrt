Get videos durations in a folder

```
ls -rt | xargs -n1 -I file /bin/bash -c 'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 file;'
```
Video names and durations
```
ls -rt | xargs -n1 -I file /bin/bash -c 'echo -n file; echo -n " "; ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 file;'
```