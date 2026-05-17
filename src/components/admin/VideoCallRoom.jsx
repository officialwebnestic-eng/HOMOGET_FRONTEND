import { useParams } from "react-router-dom";
import { useEffect } from "react";

const VideoCallRoom = () => {
  const { roomId } = useParams();



   console.log("thisi is a room id",roomId)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@daily-co/daily-js";
    script.onload = () => {
      const callFrame = window.DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: {
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        },
      });

      callFrame.join({
        url: `https://itsinfotect.daily.co/${roomId}`,
      });
    };
    document.body.appendChild(script);
  }, [roomId]);

  return null;
};

export default VideoCallRoom;
