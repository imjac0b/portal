import ReactPlayer from "react-player";
import { useState } from "preact/hooks";
import { Button } from "./components/ui/button";
import {
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { Input } from "./components/ui/input";
import { signal } from "@preact/signals";

const keywords = signal<string[]>(
  JSON.parse(
    localStorage.getItem("portal-keywords") || JSON.stringify(["News"])
  )
);

function saveKeywords() {
  localStorage.setItem("portal-keywords", JSON.stringify(keywords.value));
}

export function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: video, refetch } = useQuery({
    queryKey: ["video", keywords.value],
    queryFn: async () => {
      const { items } = (await ofetch(
        "https://api.piped.private.coffee/search",
        {
          params: {
            q: keywords.value[
              Math.floor(Math.random() * keywords.value.length)
            ],
            filter: "videos",
          },
          cache: "force-cache",
        }
      )) as {
        items: {
          url: string;
          type: string;
          title: string;
          thumbnail: string;
          uploaderName: string;
          uploaderUrl: string;
          uploaderAvatar: string;
          uploadedDate: string;
          shortDescription: string;
          duration: number;
          views: number;
          uploaded: number;
          uploaderVerified: boolean;
          isShort: boolean;
        }[];
      };

      const filteredItems = items.filter((item) => item.isShort === false);

      if (!isPlaying) {
        setIsPlaying(true);
      }

      return filteredItems[Math.floor(Math.random() * filteredItems.length)];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div className={"relative w-full h-full group"}>
      {settingsOpen && <Settings setSettingsOpen={setSettingsOpen} />}
      <div
        className={
          "w-full h-dvh absolute inset-0 z-10 flex flex-col justify-between p-4 opacity-0 group-mobile-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        }
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.7) 100%)",
          }}
        ></div>
        <div className="text-lg font-semibold relative z-10 text-center line-clamp-1">
          {video ? video.title : "Loading..."}
        </div>
        <div className="flex justify-center relative z-10 gap-2">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            size={"icon"}
            variant={"outline"}
          >
            {!isMuted ? <Volume2Icon /> : <VolumeXIcon />}
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            size={"icon"}
            variant={"outline"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => {
              refetch();
            }}
          >
            <SkipForwardIcon />
          </Button>
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => {
              setSettingsOpen(true);
            }}
          >
            <SettingsIcon />
          </Button>
        </div>
      </div>
      {video && (
        <ReactPlayer
          src={`${new URL(
            video.url,
            "https://www.youtube-nocookie.com"
          ).toString()}`}
          muted={isMuted}
          playing={isPlaying}
          width={"100%"}
          height={"100dvh"}
          onEnded={() => {
            refetch();
          }}
          className={"pointer-events-none"}
        />
      )}
    </div>
  );
}

function Settings(props: { setSettingsOpen: (open: boolean) => void }) {
  return (
    <div
      className={
        "w-full h-dvh absolute inset-0 z-20 flex flex-col justify-between p-4 bg-background/50 backdrop-blur-xs py-14 items-center"
      }
    >
      <div className={"max-w-md w-full"}>
        <div className={"flex items-center justify-between"}>
          <h1 className={"text-2xl font-semibold flex items-center gap-2"}>
            <SettingsIcon /> Settings
          </h1>
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => props.setSettingsOpen(false)}
          >
            <XIcon />
          </Button>
        </div>

        <div className={"flex flex-col py-4"}>
          <h2 className={"font-semibold"}>Keywords</h2>
          <h3 className={"text-sm text-muted-foreground mb-2"}>
            Add keywords to search for.
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const keyword = formData.get("keyword") as string;
              keywords.value = [...new Set([...keywords.value, keyword])];
              saveKeywords();
            }}
            className={"flex gap-2"}
          >
            <Input
              name={"keyword"}
              placeholder={"Add keyword"}
              className={"flex-1"}
            />
            <Button type={"submit"}>Save</Button>
          </form>
          <div className={"flex flex-wrap gap-2 py-2"}>
            {keywords.value.map((keyword) => (
              <Button
                key={keyword}
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  keywords.value = keywords.value.filter((k) => k !== keyword);
                  saveKeywords();
                }}
              >
                {keyword}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
