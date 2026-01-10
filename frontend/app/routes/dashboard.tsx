import { useQuery } from "@tanstack/react-query";
import {
  Copy,
  CornerDownRight,
  Globe,
  LoaderIcon,
  MousePointerClickIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import CustomPagination from "~/components/CustomPagination";
import { API_URL } from "~/constants";

// const mockData = [
//   {
//     shortLink: "498c7b11",
//     longLink: "https://github.com",
//     clicks: 4,
//     timestamp: new Date("11.29.2025"),
//   },
//   {
//     shortLink: "139cy8h3",
//     longLink: "https://google.com",
//     clicks: 16,
//     timestamp: new Date("11.28.2025"),
//   },
//   {
//     shortLink: "1249c7nr",
//     longLink: "http://youtube.com",
//     clicks: 0,
//     timestamp: new Date("11.20.2025"),
//   },
//   {
//     shortLink: "3209vh1c",
//     longLink: "https://facebook.com",
//     clicks: 41231,
//     timestamp: new Date("10.20.2025"),
//   },
//   {
//     shortLink: "3209vh1c",
//     longLink: "https://facebook.com",
//     clicks: 4123,
//     timestamp: new Date("10.20.2024"),
//   },
// ];

function timeAgo(date: Date) {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} seconds`;
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""}`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""}`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""}`;
}

const refactorLink = (link: string) => {
  if (link.includes("https")) {
    return link.substring(8);
  }
  return link.substring(7);
};

const Favicon = ({ url }: { url: string }) => {
  const [hasError, setHasError] = useState(false);

  const getIconLink = (longLink: string) => {
    return `https://favicone.com/${refactorLink(longLink)}?s=32`;
  };

  if (hasError) {
    return <Globe className="h-8 w-8 text-gray-400" />;
  }

  return (
    <img
      src={getIconLink(url)}
      alt="Website icon"
      className="h-8 w-8"
      onError={() => setHasError(true)}
    />
  );
};

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const getIconLink = (longLink: string) => {
    return `https://favicone.com/${refactorLink(longLink)}?s=32`;
  };

  const handleNewPage = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(p));
    setSearchParams(newParams);
  };

  const mapRecords = (
    data: any
  ): {
    id: string;
    shortLink: string;
    longLink: string;
    clicks: number;
    timeStamp: Date;
  }[] => {
    return data.records.map((record: any) => ({
      id: record.id,
      shortLink: record.ShortUrl,
      longLink: record.LongUrl,
      clicks: record.total_count,
      timeStamp: record.timeStamp,
    }));
  };

  const {
    data: { links, totalCount } = { links: [], totalCount: 0 },
    isLoading,
  } = useQuery({
    queryKey: ["links", page],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_URL}/links?page=${page}`);
        const data = await response.json();
        console.log(data);

        return {
          links: data && data.records ? mapRecords(data) : [],
          totalCount: data ? data.links_total_count : 0,
        };
      } catch (error) {
        console.error(error);
        return { links: [], totalCount: 0 };
      }
    },
  });

  return (
    <div className="bg-[url(/bg.jpg)] lg:bg-[url(/bgbig.jpg)] bg-cover min-h-screen min-w-screen">
      <div className="min-h-screen p-2 sm:p-8 flex flex-col justify-between gap-8">
        <div className="flex justify-between">
          <h1 className="text-2xl">Dashboard</h1>
          <Link to="/" className="bg-white px-4 py-2 rounded-md text-muted">
            Back to Home
          </Link>
        </div>
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoaderIcon className="animate-spin" size={64} />
          </div>
        ) : links?.length ? (
          <div className="border-2 rounded-2xl bg-white/20 backdrop-blur-lg">
            {links?.map((link, index) => (
              <div
                className="border-b-2 py-2 px-4 gap-2 grid grid-cols-1 sm:grid-cols-[1fr_min-content]"
                key={index}
              >
                <div className="flex gap-4 items-center">
                  <Favicon url={link.longLink} />
                  <div className="flex flex-col">
                    <div
                      className="flex gap-4 items-center cursor-pointer"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          "https://shorther.com/{link.shortLink}"
                        )
                      }
                    >
                      <a
                        href={`${API_URL}/${link.shortLink}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {API_URL}/{link.shortLink}
                      </a>
                      <Copy size={20} />
                    </div>
                    <div className="flex gap-2 items-center">
                      <CornerDownRight
                        color="var(--ring)"
                        width={16}
                        height={16}
                      />
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={link.longLink}
                      >
                        {refactorLink(link.longLink)}
                      </a>
                      {/* <span className="text-xs text-muted-foreground">
                        {timeAgo(link.timeStamp)}
                      </span> */}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 border-2 rounded-md px-2 py-1 items-center min-w-36 justify-between">
                  <div className="size-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="whitespace-nowrap mono">
                    {Intl.NumberFormat("en", {
                      notation: "compact",
                    }).format(link.clicks)}
                  </span>
                  <span>clicks</span>
                  <MousePointerClickIcon size={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="text-center text-3xl font-bold">No links found</h3>
        )}
        {links.length ? (
          <CustomPagination
            totalCount={totalCount}
            pageSize={10}
            page={page}
            handleNewPage={handleNewPage}
          />
        ) : null}
      </div>
    </div>
  );
}
