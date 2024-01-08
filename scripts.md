Get videos durations in a folder

```
ls -rt | xargs -n1 -I file /bin/bash -c 'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 file;'
```
Video names and durations
```
ls -rt | xargs -n1 -I file /bin/bash -c 'echo -n file; echo -n " "; ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 file;'| grep -v betterplay.hl.mp4
```

Concat mp4 videos

```
ls -rt *.mp4 | xargs -n1 -I {} /bin/bash -c 'echo -n file; echo -n " \""; echo -n {}; echo "\""'  | grep -v betterplay.hl.mp4 > list.txt
replace " by '
ffmpeg -safe 0 -f concat -i list.txt -c copy output.mp4
```