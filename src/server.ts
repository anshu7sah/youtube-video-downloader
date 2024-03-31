import express from "express";

import cors from "cors";
import ytdl from "ytdl-core";
import { getAvailableVideoQuality } from "./helper/helper";
import { chain } from "lodash";

const app = express();

app.use(cors());

const port = 4000;
app.get("/health-check", (req, res) => {
  return res.send("I am good to go");
});

app.get("/api/get-video-info/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const { videoDetails, formats } = await ytdl.getInfo(videoId);
  const { title, thumbnails } = videoDetails;
  const formattedVideoQuality = getAvailableVideoQuality(formats);

  return res.status(200).json({
    videoInfo: {
      title,
      thumbnailsUrl: thumbnails[thumbnails.length - 1].url,
      formattedVideoQuality,
      lastVideoQuality: formattedVideoQuality[0],
    },
  });
});

interface Que {
  id: string;
  quality: string;
}
app.get("/video-download", async (req, res) => {
  const { id, quality } = req.query as { id?: string; quality?: string };

  try {
    if (id && quality) {
      const {
        videoDetails: { title },
        formats,
      } = await ytdl.getInfo(id);

      const videoFormat = chain(formats)
        .filter(
          ({ height, codecs }: any) =>
            height && height === parseInt(quality) && codecs?.startsWith("avc1")
        )
        .orderBy("fps", "desc")
        .head()
        .value();
    }
  } catch (error) {}
});

app.listen(port, () => console.log(`listening on port ${port}`));
