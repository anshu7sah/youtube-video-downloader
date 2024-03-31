import React, { useState } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";

const Download = () => {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState();
  const [showingQuality, setShowingQuality] = useState("");
  const [loading, setLoading] = useState(false);

  const get_video_details = async (e) => {
    e.preventDefault();
    const videoId = url.split("https://youtu.be/")[1];
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:4000/api/get-video-info/${videoId}`
      );
      setLoading(false);
      setVideoInfo(data.videoInfo);
      setShowingQuality(data.videoInfo.lastVideoQuality);
    } catch (error) {
      setLoading(false);
    }
  };
  const videoDownload = () => {
    const videoId = url?.split("https://youtu.be/")[1];

    const videoUrl = `http://localhost:4000/video-download?id=${videoId}&quality=${showingQuality}`;
    window.location.href = videoUrl;
  };
  return (
    <div className="w-[600px] h-[500px] bg-slate-800 flex justify-start items-center flex-col p-4 border-orange-500 border-[8px] relative">
      <h2 className="text-white text-4xl pb-6 pt-4">
        Youtube Video Downloader
      </h2>
      <div className="mb-8">
        <form onSubmit={get_video_details}>
          <div className="w-[380px] h-[40px] flex relative px-3 rounded-md border-indigo-500 border overflow-hidden">
            <input
              type="text"
              className="text-white outline-none w-full bg-transparent"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Input youtube video line here"
            />
            <button className="bg-indigo-500 absolute right-0 h-full px-5 text-white">
              Click
            </button>
          </div>
        </form>
      </div>
      <div>
        {loading ? (
          <div className="w-full py-5 text-center">
            <BounceLoader color="#fff" />
          </div>
        ) : (
          videoInfo && (
            <div className="flex gap-3 px-4">
              <img
                src={videoInfo.thumbnailsUrl}
                alt=""
                className="max-w-[200px] rounded-md h-[150px]"
              />
              <div className="text-white flex gap-2 flex-col">
                <h3>{videoInfo?.title?.slice(0, 70)}</h3>
                <span>Time : 00:00</span>
                <div className="flex gap-3 mt-4">
                  <select
                    className="px-3 py-2 outline-none bg-slate-800 border-indigo-500 rounded-md"
                    name=""
                    id=""
                    onChange={(e) => setShowingQuality(e.target.value)}
                  >
                    {videoInfo?.formattedVideoQuality?.length > 0 &&
                      videoInfo.formattedVideoQuality.map((quality, i) => (
                        <option key={i}>{quality}</option>
                      ))}
                  </select>
                  <button
                    className="px-3 py-2 bg-indigo-500 text-white rounded-md"
                    onClick={videoDownload}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Download;
