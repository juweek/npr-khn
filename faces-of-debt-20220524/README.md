# faces-of-debt-20220524/

This project contains a grid of photos and videos that appear at the top of a story on KHN.org and NPR.org. Clicking on a photo or video jumps the user down to the full profile (on the same page).

The original, full-size media is stored on S3. To retrieve it, run this command in dailygraphics-next:

```
node cli sync faces-of-debt-20220524
```

The files will download to the `synced/` folder in this project.

Resizing images
---------------

Use ImageMagick to resize all JPGs in a folder. These instructions assume that you're in terminal, in the `npr-khn/faces-of-debt-20220524/synced/originals/` folder.

```
for f in *.jpg; do convert $f -quality 75 -resize 1000x1000\> -strip -sampling-factor 4:2:0 -define jpeg:dct-method=float -interlace Plane ../../assets/$f; done
```

Sampling down video
-------------------

Use `ffmpeg` to scale down outsize video, where `-i` specifies the input filename and the final line specifies the output filename.

These instructions assume that you're in terminal, in the `npr-khn/faces-of-debt-20220524/synced/originals/` folder.

```
ffmpeg \
-i joepitzo-new.mp4 \
-an \
-vcodec libx264 \
-preset veryslow \
-strict -2 \
-pix_fmt yuv420p \
-crf 21 \
-vf scale=600:-1 \
../../assets/joepitzo.mp4
```

Note: If you get a `height not divisible by 2` error, adjust the `-vf scale=1002:-1 \` value until you no longer get that error.


Generating a poster image
-------------------------

If desired, you can use `ffmpeg` to generate a static poster image for a video.

```
ffmpeg \
-i sherriefoy.mp4 \
-frames:v 1 \
../../assets/sherriefoy-poster.jpg
```
